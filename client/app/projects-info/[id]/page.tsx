'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { addDoc, doc, getDoc, collection, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '@/firebase/clientApp';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";

import { ProjectHeader } from '@/components/project-info/ProjectHeader';
import { TurmasSelector } from '@/components/project-info/TurmasSelector';
import { AddTurmaModal } from '@/components/project-info/AddTurmaModal';
import { AlunosList } from "@/components/project-info/AlunosList";
import { GruposList } from "@/components/project-info/GruposList";

interface Turma {
  id: string;
  nome: string;
  alunos: Aluno[];
  createdAt?: string;
}

interface Aluno {
  nome: string;
  ra: number;
}

export async function extrairAlunosDoArquivo(file: File): Promise<Aluno[]> {
  const fileName = file.name.toLowerCase();
  let data: any[] = [];

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

  const alunos = data
    .map((row: any) => {
      const nome = row.Student || row.Nome || row.Aluno || row["Nome do Aluno"];
      const ra = row.RA || row.Id || null;
      if (!nome) return null;
      return { nome: String(nome).trim(), ra: ra ? Number(ra) || 0 : 0 };
    })
    .filter((a): a is Aluno => !!a && a.nome.toUpperCase() !== "POINTS POSSIBLE");

  if (!alunos.length) toast.error("Nenhum aluno encontrado no arquivo.");
  return alunos;
}

export default function ProjectInfoPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaSelecionadaId, setTurmaSelecionadaId] = useState<string | null>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [nomeTurma, setNomeTurma] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [turmaEditandoIndex, setTurmaEditandoIndex] = useState<number | null>(null);

  const turmaSelecionada = turmas.find((t) => t.id === turmaSelecionadaId) || null;

  const handleSalvarTurma = async () => {
    if (!nomeTurma) return toast.error("Digite o nome da turma!");
    if (!uploadedFile) return toast.error("Adicione um arquivo!");

    let alunos: Aluno[] = [];

    try {
      alunos = await extrairAlunosDoArquivo(uploadedFile);
    } catch {
      return toast.error("Erro ao ler o arquivo");
    }

    const novaTurmaSemId = {
      nome: nomeTurma,
      alunos,
      createdAt: new Date().toISOString()
    };

    if (turmaEditandoIndex !== null) {
      const copy = [...turmas];
      copy[turmaEditandoIndex] = { ...copy[turmaEditandoIndex], ...novaTurmaSemId };
      setTurmas(copy);
      setTurmaEditandoIndex(null);
    } else {
      try {
        const docRef = await addDoc(
          collection(db, "Projetos", projectId, "Turmas"),
          novaTurmaSemId
        );

        setTurmas(prev => [...prev, { id: docRef.id, ...novaTurmaSemId }]);
        toast.success("Turma salva!");
      } catch {
        return toast.error("Erro ao salvar no banco");
      }
    }

    setNomeTurma("");
    setUploadedFile(null);
    setIsAddClassOpen(false);
  };

  const handleAddAluno = async (nome: string, ra: number) => {
    if (!turmaSelecionada) return;

    try {
      if (!turmaSelecionada?.id) return;
      const turmaRef = doc(db, "Projetos", projectId, "Turmas", turmaSelecionada.id);
      await updateDoc(turmaRef, {
        alunos: arrayUnion({ nome, ra })
      });

      setTurmas((prev) =>
        prev.map((t) =>
          t.id === turmaSelecionada?.id
            ? { ...t, alunos: [...t.alunos, { nome, ra }] }
            : t
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar aluno");
      return;
    }

    toast.success("Aluno adicionado!");
  };

  useEffect(() => {
    const un = onAuthStateChanged(auth, u => setUser(u));
    return () => un();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const snap = await getDoc(doc(db, 'Projetos', projectId));
        if (!snap.exists()) return setError("Projeto não encontrado");
        setProject({ id: snap.id, ...snap.data() });
      } catch {
        setError("Erro ao carregar projeto");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const fetchTurmas = async () => {
      const snap = await getDocs(collection(db, "Projetos", projectId, "Turmas"));
      setTurmas(snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })));
    };
    fetchTurmas();
  }, [projectId]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col w-full min-h-screen p-1">

      <ProjectHeader
        nome={project?.nome}
        semestre={project?.semestre}
        ano={project?.ano}
      />

       <div className="flex-1 w-full pl-3 pt-5">
        <div className="flex flex-col bg-[#FCF3FA] shadow-md rounded-l-[15px] md:rounded-l-[25px] rounded-r-none w-full p-3 pr-6 h-full">
          <p className="self-start text-[12px] font-medium text-[#3B3B3B] pl-2 mb-2">
            Turmas
          </p>

          <TurmasSelector
            turmas={turmas}
            turmaSelecionada={turmaSelecionadaId}
            onSelect={setTurmaSelecionadaId}
            onAdd={() => setIsAddClassOpen(true)}
          />

          {turmaSelecionada ? (
            <AlunosList
              alunos={turmaSelecionada.alunos ?? []}
              onAdd={(nome, ra) => handleAddAluno(nome, ra)}
            />
          ) : (
            <div className="flex flex-col justify-center items-center flex-1 bg-white text-gray-500 text-[12px] gap-4 rounded-xl p-4 mt-4 ml-2">
              <img
                src="/semTurma.svg"
                alt="Nenhuma turma selecionada"
                className="w-56 h-56 object-contain"
              />
              <p className="text-center text-sm">
                <span className="font-semibold text-[#90416B]">Crie</span> ou{' '}
                <span className="font-semibold text-[#90416B]">selecione</span> uma turma para começar!
              </p>
            </div>
          )}

          {/* Lista de Grupos */}
          {turmaSelecionadaId && (
            <GruposList
              projectId={projectId}
              turmaId={turmaSelecionadaId}
              onManage={(grupoId) => {}}
            />
          )}
        </div>
      </div>

      {isAddClassOpen && (
        <AddTurmaModal
          nomeTurma={nomeTurma}
          setNomeTurma={setNomeTurma}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          onClose={() => setIsAddClassOpen(false)}
          onSave={handleSalvarTurma}
        />
      )}

    </div>
  );
}
