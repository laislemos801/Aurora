"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IoMdClose } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { FiUpload } from "react-icons/fi";
import { IoTrashOutline, IoLinkSharp } from "react-icons/io5";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import ModalInviteProfessor from "../ui/modalinviteprofessor";
import { criarProjeto } from "@/firebase/addProject";
import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { Turma } from "@/types/turma";
import { Professor } from "@/types/professor";

interface AlunoXLS {
  nome: string;
  ra: number | string; // pode vir como string do Excel
}

interface Aluno {
  nome: string;
  ra: number | null;
}

interface ModalAddProjectProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isAddClassOpen: boolean;
  setIsAddClassOpen: (value: boolean) => void;
  turmas: Turma[];
  setTurmas: (value: Turma[]) => void;
}

// Extrair dados do arquivo .xls, .xlsx ou .csv
export async function extrairAlunosDoArquivo(file: File): Promise<Aluno[]> {
  const fileName = file.name.toLowerCase();
  let data: any[] = [];

  try {
    // Ler conteúdo dependendo da extensão
    if (fileName.endsWith(".csv")) {
      const text = await file.text();
      const workbook = XLSX.read(text, { type: "string" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(worksheet);
    } else {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(worksheet);
    }

    // Mapeia e normaliza os alunos
    const alunos = data
        .map((row: any, index: number): Aluno | null => {
            const nome =
            row.Student ||
            row.Nome ||
            row.Aluno ||
            row["Nome do Aluno"] ||
            null;

            const ra = row.RA || row.Id;

            if (!nome) return null;

            const safeRa =
            ra && !isNaN(Number(ra)) ? Number(ra) : null;

            return { nome: String(nome).trim(), ra: safeRa };
        })
        .filter((a): a is Aluno => !!a && a.nome.toUpperCase() !== "POINTS POSSIBLE");

    if (!alunos.length) {
      toast.error("Nenhum aluno encontrado no arquivo.");
    }

    return alunos;
  } catch (error) {
    console.error("Erro ao extrair alunos:", error);
    toast.error("Não foi possível ler o arquivo.");
    return [];
  }
}


export default function ModalAddProject({isOpen,setIsOpen,isAddClassOpen,setIsAddClassOpen,turmas,setTurmas,
}: ModalAddProjectProps) {
    //Estados principais
    
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [semestre, setSemestre] = useState("");
    const [ano, setAno] = useState("");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [nomeTurma, setNomeTurma] = useState("");
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [professorSelecionado, setProfessorSelecionado] = useState<string>(""); // uid do professor selecionado
    const [projeto, setProjeto] = useState<{ uid: string } | null>(null);
    const [turmaEditandoIndex, setTurmaEditandoIndex] = useState<number | null>(null);
    const [curso, setCurso] = useState("");

    const handleSalvarTurma = async () => {
        if (!nomeTurma) return toast.error("Por favor, digite o nome da turma!");
        if (!uploadedFile) return toast.error("Por favor, adicione um arquivo PDF ou XLS/XLSX!");

        let alunos: Aluno[] = [];

        try {
            alunos = await extrairAlunosDoArquivo(uploadedFile);
        } catch (err) {
            console.error(err);
            toast.error("Não foi possível ler o arquivo. Verifique se ele está correto.");
            return;
        }

        const novaTurma: Turma = { nome: nomeTurma, alunos };

        if (turmaEditandoIndex !== null) {
            // Se está editando, substitui a turma existente
            const novasTurmas = [...turmas];
            novasTurmas[turmaEditandoIndex] = novaTurma;
            setTurmas(novasTurmas);
            setTurmaEditandoIndex(null); // reset
        } else {
            // Adiciona nova turma
            setTurmas([...turmas, novaTurma]);
        }

        setNomeTurma("");
        setUploadedFile(null);
        setIsAddClassOpen(false);
    };



    // Remover turma
    const handleRemoverTurma = (index: number) => {
        const novasTurmas = [...turmas];
        novasTurmas.splice(index, 1);
        setTurmas(novasTurmas);
    };

    // Salvar projeto
    const handleSalvarProjeto = async () => {
        if (!nome || !descricao || !semestre || !ano || !curso) {
            toast.error("Preencha os campos obrigatórios!");
            return;
        }

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            toast.error("Usuário não autenticado!");
            return;
        }

        // 🔹 Garante que o criador seja adicionado como professor
        const professoresUIDs = Array.from(
            new Set([user.uid, ...professores.map((p) => p.uid)])
        );

        const projetoData = {
        nome,
        descricao,
        semestre,
        ano,
        curso,
        turmas: turmas.map((t) => ({
        ...t,
            alunos: (t.alunos ?? []).map((a) => ({
                ...a,
                ra: a.ra ?? 0,
            })),
        })),
        professores: professoresUIDs,
        };

        const res = await criarProjeto(projetoData as Parameters<typeof criarProjeto>[0]);

        if (res.sucesso) {
            if (!res.uid) {
            toast.error("Erro: UID do projeto não retornou!");
            return;
            }

            setProjeto({ uid: res.uid });
            toast.success("Projeto criado com sucesso!");

            // limpa campos após adicionar projeto
            setNome("");
            setDescricao("");
            setSemestre("");
            setAno("");
            setCurso("");
            setTurmas([]);
            setProfessores([]);
            setProfessorSelecionado("");
            setIsOpen(false);
        } else {
            toast.error("Erro ao criar o projeto: " + res.erro);
        }
        };

  return (
    <>
    {/* MODAL PRINCIPAL — Novo Projeto */}
    {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-[#F6F6F6] rounded-2xl shadow-xl p-6 sm:p-6 w-96 md:w-full max-w-lg sm:max-w-2xl animate-fadeIn relative">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-[#3B3B3B] rounded-full p-2 hover:bg-gray-200 transition cursor-pointer">
                    <IoMdClose size={24} />
                </button>

                <h2 className="text-xl sm:text-2xl font-normal mb-2 sm:mb-4 pl-2 pt-2 text-start text-[#C288B3]">
                    Novo Projeto
                </h2>

                <div className="flex flex-col sm:gap-2">
                    {/* Nome, Semestre, Ano */}
                    <div className="flex flex-row p-2 gap-4">
                    <div className="flex flex-col w-2/5 sm:3/5">
                        <label className="text-[#353535] text-sm md:text-lg font-medium mb-1">
                        Nome
                        </label>
                        <Input
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="border-[#C288B3] text-sm md:text-md lg:text-lg pt-6 pb-6 border-2 text-[#A1A1A1]"/>
                    </div>
                    <div className="flex flex-col w-1/3">
                        <label className="text-[#353535] text-sm md:text-lg font-medium mb-1">
                        Semestre
                        </label>
                        <Input
                        type="text"
                        placeholder="Semestre"
                        value={semestre}
                        onChange={(e) => setSemestre(e.target.value)}
                        className="border-[#C288B3] text-sm md:text-lg pt-6 pb-6 border-2 text-[#A1A1A1]" />
                    </div>
                    <div className="flex flex-col w-1/4">
                        <label className="text-[#353535] text-sm md:text-lg font-medium mb-1">
                        Ano
                        </label>
                        <Input
                        type="text"
                        placeholder="Ano"
                        value={ano}
                        onChange={(e) => setAno(e.target.value)}
                        className="border-[#C288B3] text-sm md:text-lg pt-6 pb-6 border-2 text-[#A1A1A1]"/>
                    </div>
                </div>

                {/* Descrição + adicionar turma */}
                <div className="flex flex-row w-full p-2 gap-4 justify-start items-start">
                    <div className="flex flex-col w-full sm:w-full">
                        <label className="text-[#353535] font-medium mb-1 text-sm md:text-lg ">
                        Descrição
                        </label>
                        <div className="flex flex-row w-full sm:w-full gap-6">
                        <Textarea
                            placeholder="Descrição"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="border-[#C288B3] border-2 text-sm md:text-lg text-[#A1A1A1] pb-6"
                            rows={4}/>
                        <div className="flex flex-col gap-2 justify-start w-60 sm:w-full max-h-60 overflow-y-auto">
                            <button
                            onClick={() => setIsAddClassOpen(true)}
                            className="bg-[#C288B3] text-sm md:text-lg text-[#FCF3FA] font-medium p-2 w-full rounded-md hover:bg-[#90416B] mb-1 transition flex items-center justify-start gap-2">
                            <GoPlus size={20} />
                            Adicionar turma
                            </button>
                            {/* Lista de turmas adicionadas */}
                            {turmas.map((t, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between gap-2 p-2 border-2 border-[#C288B3] rounded-lg cursor-pointer hover:bg-[#F3EAF5]"
                                    onClick={() => {
                                    setNomeTurma(t.nome);
                                    setUploadedFile(null); // se quiser, poderia tentar recuperar o arquivo original
                                    setTurmaEditandoIndex(i);
                                    setIsAddClassOpen(true);
                                    }}>
                                    <p className="text-[#C288B3] text-sm sm:text-md">{t.nome}</p>
                                    <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation(); // previne abrir o modal ao clicar no botão de remover
                                        handleRemoverTurma(i);
                                    }}
                                    className="text-[#90416B] hover:bg-[#C288B3] cursor-pointer rounded-full p-1 transition"
                                    >
                                    <IoTrashOutline size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Professor + salvar */}
            <div className="flex flex-col p-2 w-full">

                <div className="flex flex-row justify-between items-end w-full gap-3">
                    {/* Select */}
                    <div className="w-1/2 flex flex-col">
                        <label className="text-[#353535] font-medium mb-1 text-sm md:text-lg">
                            Professor
                        </label>
                        <Select>
                            <SelectTrigger className="w-full border-2 pt-6 pb-6 border-[#C288B3] focus:ring-0 focus:border-[#C288B3]">
                            <SelectValue placeholder="Selecione o professor" />
                            </SelectTrigger>
                            <SelectContent className="w-50 sm:w-full">
                            {professores.map((p) => (
                                <SelectItem key={p.email} value={p.uid || p.email}>
                                {p.nome}
                                </SelectItem>
                            ))}
                            <div className="border-t border-[#E8CBE0] my-1" />
                            <button
                                type="button"
                                onClick={() => setIsInviteOpen(true)}
                                className="flex items-center gap-2 text-[#C288B3] px-3 py-2 hover:bg-[#F3EAF5] w-full text-left rounded-md">
                                <IoLinkSharp size={18} />
                                Convidar um professor
                            </button>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Campo Curso */}
                    <div className="w-1/2 flex flex-col">
                        <label className="text-[#353535] font-medium mb-1 text-sm md:text-lg">
                            Curso
                        </label>
                        <Input
                            type="text"
                            placeholder="Curso"
                            value={curso}
                            onChange={(e) => setCurso(e.target.value)}
                            className="border-[#C288B3] text-sm md:text-md lg:text-lg pt-6 pb-6 border-2 text-[#A1A1A1] w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-end items-end pt-2">
                <button onClick={handleSalvarProjeto} className="bg-[#C288B3] text-[#FCF3FA] font-semibold px-8 py-2 sm:px-6 sm:py-2 md:px-16 md:py-2 text-center rounded-lg hover:bg-[#90416B] transition">
                Salvar
                </button>
            </div>
        </div>
    </div>
</div>
)}

    {/* MODAL SECUNDÁRIO — Adicionar Turma */}
    {isAddClassOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-96 sm:w-[480px] animate-fadeIn relative">
            <button
                onClick={() => setIsAddClassOpen(false)}
                className="absolute top-4 right-4 text-[#3B3B3B] rounded-full p-2 hover:bg-gray-200 transition cursor-pointer">
                <IoMdClose size={24} />
            </button>

            <h2 className="text-xl font-normal mb-4 text-[#C288B3] text-start">
                Adicionar Turma
            </h2>

            <div className="flex flex-col gap-4">
                <div>
                    <label className="text-[#353535] font-medium mb-1 text-sm md:text-lg">
                        Nome da turma
                    </label>
                    <Input
                        type="text"
                        placeholder="Nome da turma"
                        value={nomeTurma}
                        onChange={(e) => setNomeTurma(e.target.value)}
                        className="border-[#C288B3] border-2 text-[#A1A1A1] pt-3 pb-3 text-sm sm:text-md"/>
                </div>

                <div className="flex flex-col w-full">
                    <label className="text-[#353535] font-medium mb-1 text-sm md:text-lg">
                        Adicionar arquivo
                    </label>

                    {uploadedFile ? (
                        <div className="flex items-center justify-between p-2 border-2 border-[#C288B3] rounded-lg">
                            <p className="text-[#C288B3] text-sm sm:text-md">
                                {uploadedFile.name}
                            </p>
                            <button
                                type="button"
                                onClick={() => setUploadedFile(null)}
                                className="text-[#90416B] hover:bg-[#C288B3] rounded-full p-1 transition"
                            >
                                <IoTrashOutline size={20} />
                            </button>
                        </div>
                        ) : (
                        <div
                            className="relative w-full h-40 border-2 border-[#C288B3] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#F3EAF5] transition"
                            onClick={() => document.getElementById("fileUpload")?.click()}>
                                <div className="text-[#C288B3] mb-2">
                                    <FiUpload size={40} />
                                </div>
                                <p className="text-[#C288B3] text-sm sm:text-md text-center">
                                    Arraste ou insira um arquivo xls, xlsx ou csv
                                </p>
                                <input
                                    type="file"
                                    id="fileUpload"
                                    accept="application/.xls, .xlsx, .csv"
                                    className="hidden"
                                    onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                    setUploadedFile(e.target.files[0]);}
                            }}
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSalvarTurma}
                        className="bg-[#C288B3] text-[#FCF3FA] font-semibold px-6 sm:px-10 py-2 rounded-lg hover:bg-[#90416B] transition"
                    >
                        Salvar turma
                    </button>
                </div>
            </div>
        </div>
    </div>
)}
    <ModalInviteProfessor
        isInviteOpen={isInviteOpen}
        setIsInviteOpen={setIsInviteOpen}
        professores={professores}
        setProfessores={setProfessores}
        projetoUid={projeto?.uid ?? ""}
        />
    </>
  );
}
