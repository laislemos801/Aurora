"use client";

import { useState } from "react";
import { FiMoreVertical, FiSearch, FiPlus } from "react-icons/fi";

interface Aluno {
  nome: string;
  ra: number;
}

interface Props {
  alunos: Aluno[];
  onAdd: (nome: string, ra: number) => void;
}

export function AlunosList({ alunos, onAdd }: Props) {
  const [search, setSearch] = useState("");
  const [nomeAlunoNovo, setNomeAlunoNovo] = useState("");
  const [raAlunoNovo, setRaAlunoNovo] = useState("");
  const [addMode, setAddMode] = useState(false);

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleSalvarAluno = () => {
    if (!nomeAlunoNovo.trim() || !raAlunoNovo.trim()) return;
    onAdd(nomeAlunoNovo.trim(), Number(raAlunoNovo));
    setNomeAlunoNovo("");
    setRaAlunoNovo("");
    setAddMode(false);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl py-4 w-full flex flex-col mt-5 px-4">
      
      {/* SEARCH */}
      <div className="flex items-center bg-[#F7F5F7] rounded-full px-3 py-1.5 mb-3">
        <FiSearch className="text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 w-full bg-transparent focus:outline-none text-sm"
        />
      </div>

      {/* LISTA */}
      <div className="flex flex-col gap-1 overflow-y-auto max-h-[180px] pr-1">
        {alunosFiltrados.map((aluno, index) => (
          <div
            key={aluno.ra}
            className={`
              flex justify-between items-center px-2 py-1 cursor-pointer transition hover:bg-gray-50
              ${index !== alunosFiltrados.length - 1 ? "border-b border-[#DEDEDE]" : ""}
            `}
          >
            <span className="text-sm text-gray-800">{aluno.nome}</span>
            <FiMoreVertical className="text-[#9B6CC5]" size={15} />
          </div>
        ))}
      </div>

      {/* ADICIONAR ALUNO */}
      <div className="mt-3">
        {!addMode ? (
          <button
            onClick={() => setAddMode(true)}
            className="flex items-center gap-2 rounded-full py-1.5 px-2 bg-[#FBF2F9] text-[#7B6294] text-sm font-semibold hover:bg-[#ead8f6] transition"
          >
            <FiPlus size={16} /> Adicionar aluno
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Nome do aluno"
              value={nomeAlunoNovo}
              onChange={(e) => setNomeAlunoNovo(e.target.value)}
              className="rounded-lg border px-2 py-1 text-sm"
            />

            <input
              type="text"
              placeholder="RA do aluno"
              value={raAlunoNovo}
              onChange={(e) => setRaAlunoNovo(e.target.value)}
              className="rounded-lg border px-2 py-1 text-sm"
            />

            <button
              onClick={handleSalvarAluno}
              className="rounded-lg bg-[#7B6294] px-3 py-1 text-[#FCF3FA] text-sm w-full hover:opacity-90 self-start font-semibold"
            >
              Salvar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

