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

interface Turma {
  nome: string;
  arquivo?: File | null;
}

interface ModalAddProjectProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isAddClassOpen: boolean;
  setIsAddClassOpen: (value: boolean) => void;
  turmas: Turma[];
  setTurmas: (value: Turma[]) => void;
}

export default function ModalAddProject({
  isOpen,
  setIsOpen,
  isAddClassOpen,
  setIsAddClassOpen,
  turmas,
  setTurmas,
}: ModalAddProjectProps) {
    const [nomeTurma, setNomeTurma] = useState("");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [professores, setProfessores] = useState<{ nome: string; email: string }[]>([]);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    const handleSalvarTurma = () => {
        if (nomeTurma.trim() === "") return;

        const novaTurma: Turma = {
        nome: nomeTurma,
        arquivo: uploadedFile,
        };

        setTurmas([...turmas, novaTurma]);
        setUploadedFile(null);
        setNomeTurma("");
        setIsAddClassOpen(false);
    };

    const handleRemoverTurma = (index: number) => {
        const novasTurmas = [...turmas];
        novasTurmas.splice(index, 1);
        setTurmas(novasTurmas);
    };

  return (
    <>
    {/* MODAL PRINCIPAL — Novo Projeto */}
    {isOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div className="bg-[#F6F6F6] rounded-2xl shadow-xl p-6 sm:p-6 w-96 md:w-full max-w-lg sm:max-w-2xl animate-fadeIn relative">
        <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-[#3B3B3B] rounded-full p-2 hover:bg-gray-200 transition cursor-pointer"
        >
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
                className="border-[#C288B3] text-sm md:text-md lg:text-lg pt-6 pb-6 border-2 text-[#A1A1A1]"
                />
            </div>
            <div className="flex flex-col w-1/3">
                <label className="text-[#353535] text-sm md:text-lg font-medium mb-1">
                Semestre
                </label>
                <Input
                type="text"
                placeholder="Semestre"
                className="border-[#C288B3] text-sm md:text-lg pt-6 pb-6 border-2 text-[#A1A1A1]"
                />
            </div>
            <div className="flex flex-col w-1/4">
                <label className="text-[#353535] text-sm md:text-lg font-medium mb-1">
                Ano
                </label>
                <Input
                type="text"
                placeholder="Ano"
                className="border-[#C288B3] text-sm md:text-lg pt-6 pb-6 border-2 text-[#A1A1A1]"
                />
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
                    className="border-[#C288B3] border-2 text-sm md:text-lg text-[#A1A1A1] pb-6"
                    rows={4}
                />
                <div className="flex flex-col justify-start w-60 sm:w-full">
                    <button
                    onClick={() => setIsAddClassOpen(true)}
                    className="bg-[#C288B3] text-sm md:text-lg text-[#FCF3FA] font-medium p-2 w-full rounded-md hover:bg-[#90416B] transition flex items-center justify-start gap-2"
                    >
                    <GoPlus size={20} />
                    Adicionar turma
                    </button>
                    {/* Lista de turmas adicionadas */}
                    {turmas.length > 0 && (
                    <div className="mt-4 flex flex-col gap-2">
                        {turmas.map((t, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-2 border-2 border-[#C288B3] rounded-lg"
                        >
                            <p className="text-[#C288B3] text-sm sm:text-md">
                            {t.nome} 
                            </p>
                            <button
                                type="button"
                                onClick={() => handleRemoverTurma(i)}
                                className="text-[#90416B] hover:bg-[#C288B3] rounded-full p-1 transition"
                            >
                                <IoTrashOutline size={20} />
                            </button>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                </div>

                
            </div>
            </div>

            {/* Professor + salvar */}
            <div className="flex flex-col p-2">
            <label className="text-[#353535] font-medium mb-1 text-sm md:text-lg">
                Professor
            </label>
            <div className="flex flex-row justify-start gap-6 w-full sm:w-full">
                <Select>
                    <SelectTrigger className="w-full sm:w-full border-2 pt-6 pb-6 border-[#C288B3] focus:ring-0 focus:border-[#C288B3]">
                        <SelectValue placeholder="Selecione o professor" />
                    </SelectTrigger>
                    <SelectContent className="w-50 sm:w-full">
                        <SelectItem value="silva">Prof. Silva</SelectItem>
                        <SelectItem value="almeida">Prof. Almeida</SelectItem>
                        <SelectItem value="sousa">Prof. Sousa</SelectItem>
                        <div className="border-t border-[#E8CBE0] my-1" />
                        <button
                        type="button"
                        onClick={() => setIsInviteOpen(true)}
                        className="flex items-center gap-2 text-[#C288B3] px-3 py-2 hover:bg-[#F3EAF5] w-full text-left rounded-md"
                        >
                        <IoLinkSharp size={18} />
                        Convidar um professor
                        </button>
                    </SelectContent>
                </Select>

                <div className="w-full flex justify-end items-end ">
                    <button className="bg-[#C288B3] text-[#FCF3FA] font-semibold px-8 py-2 sm:px-6 sm:py-2 md:px-16 md:py-2 text-center rounded-lg hover:bg-[#90416B] transition">
                        Salvar
                    </button>
                </div>
            </div>
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
            className="absolute top-4 right-4 text-[#3B3B3B] rounded-full p-2 hover:bg-gray-200 transition cursor-pointer"
        >
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
                className="border-[#C288B3] border-2 text-[#A1A1A1] pt-3 pb-3 text-sm sm:text-md"
            />
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
                onClick={() => document.getElementById("fileUpload")?.click()}
                >
                <div className="text-[#C288B3] mb-2">
                    <FiUpload size={40} />
                </div>
                <p className="text-[#C288B3] text-sm sm:text-md text-center">
                    Arraste ou insira um PDF
                </p>
                <input
                    type="file"
                    id="fileUpload"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        setUploadedFile(e.target.files[0]);
                    }
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
        setProfessores={setProfessores}/>
    </>
  );
}
