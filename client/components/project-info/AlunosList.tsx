'use client';

import { useState, useEffect } from "react";
import { FiMoreVertical, FiSearch, FiPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { doc, updateDoc, arrayUnion, getDocs, collection } from 'firebase/firestore';
import { db } from '@/firebase/clientApp';

interface Aluno {
  nome: string;
  ra: number;
}

interface Grupo {
  id: string;
  nome: string;
  alunos: Aluno[];
}

interface Props {
  alunos: Aluno[];
  onAdd: (nome: string, ra: number) => void;
  grupos?: Grupo[];
  turmaId: string;
  projectId: string;
}

export function AlunosList({ alunos, onAdd, grupos = [], turmaId, projectId }: Props) {
  const [search, setSearch] = useState("");
  const [nomeAlunoNovo, setNomeAlunoNovo] = useState("");
  const [raAlunoNovo, setRaAlunoNovo] = useState("");
  const [addMode, setAddMode] = useState(false);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [gruposState, setGrupos] = useState<Grupo[]>(grupos.map(g => ({ ...g, alunos: g.alunos ?? [] })));

  const alunosFiltrados = alunos.filter(a =>
    a.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleSalvarAluno = () => {
    if (!nomeAlunoNovo.trim() || !raAlunoNovo.trim()) return;
    onAdd(nomeAlunoNovo.trim(), Number(raAlunoNovo));
    setNomeAlunoNovo("");
    setRaAlunoNovo("");
    setAddMode(false);
  };

  const handleMoverAluno = async (alunoRa: number, grupoNome: string) => {
    const aluno = alunos.find(a => a.ra === alunoRa);
    if (!aluno) return;

    const grupoAlvo = gruposState.find(g => g.nome === grupoNome);
    const grupoAtualAluno = gruposState.find(g => g.alunos.some(a => a.ra === alunoRa));

    if (!grupoAlvo) return;

    try {
      const refGrupoAlvo = doc(db, "Projetos", projectId, "Turmas", turmaId, "Grupos", grupoAlvo.id);

      if (grupoAtualAluno?.id === grupoAlvo.id) {
        // Se já está no grupo, remover
        await updateDoc(refGrupoAlvo, { alunos: grupoAlvo.alunos.filter(a => a.ra !== alunoRa) });

        setGrupos(prev =>
          prev.map(g =>
            g.id === grupoAlvo.id ? { ...g, alunos: g.alunos.filter(a => a.ra !== alunoRa) } : g
          )
        );
        toast.success(`Aluno removido de ${grupoAlvo.nome}`);
      } else {
        // Se estiver em outro grupo, remove do antigo
        if (grupoAtualAluno) {
          const refGrupoAtual = doc(db, "Projetos", projectId, "Turmas", turmaId, "Grupos", grupoAtualAluno.id);
          await updateDoc(refGrupoAtual, { alunos: grupoAtualAluno.alunos.filter(a => a.ra !== alunoRa) });
        }

        // Adiciona ao novo grupo
        await updateDoc(refGrupoAlvo, { alunos: arrayUnion(aluno) });

        setGrupos(prev =>
          prev.map(g => {
            if (g.id === grupoAtualAluno?.id) return { ...g, alunos: g.alunos.filter(a => a.ra !== alunoRa) };
            if (g.id === grupoAlvo.id) return { ...g, alunos: [...g.alunos, aluno] };
            return g;
          })
        );
        toast.success(`Aluno movido para ${grupoAlvo.nome}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar grupo");
    }
  };

  const grupoAtual = (ra: number) => {
    return gruposState.find(g => g.alunos?.some(a => a.ra === ra))?.nome || "";
  };

  useEffect(() => {
    if (!turmaId) return; 
    const fetchGrupos = async () => {
      const snap = await getDocs(collection(db, "Projetos", projectId, "Turmas", turmaId, "Grupos"));
      setGrupos(
        snap.docs.map(docSnap => {
          const data = docSnap.data() as Omit<Grupo, 'id'>;
          return { id: docSnap.id, alunos: data.alunos ?? [], nome: data.nome };
        })
      );
    };
    fetchGrupos();
  }, [turmaId, projectId]);

  return (
    <div className="bg-white shadow-xl rounded-2xl py-4 w-full flex flex-col mt-5 px-4 relative md:ml-4">
      {/* SEARCH */}
      <div className="flex items-center bg-[#F7F5F7] rounded-full px-3 py-1.5 mb-3 md:mt-2">
        <FiSearch className="text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 w-full bg-transparent focus:outline-none text-sm"
        />
      </div>

      {/* LISTA DE ALUNOS */}
      <div className="flex flex-col gap-1 overflow-y-auto max-h-[180px] pr-1 relative">
        {alunosFiltrados.map((aluno, index) => (
          <div
            key={aluno.ra}
            className={`flex justify-between items-center px-2 py-1 cursor-pointer transition hover:bg-gray-50
              ${index !== alunosFiltrados.length - 1 ? "border-b border-[#DEDEDE]" : ""}`}
          >
            <span className="text-sm text-gray-800">{aluno.nome}</span>

            <div className="relative">
              <FiMoreVertical
                className="text-[#9B6CC5]"
                size={15}
                onClick={() => setMenuAberto(menuAberto === aluno.ra ? null : aluno.ra)}
              />

              {menuAberto === aluno.ra && (
                <div className="absolute right-0 top-5 bg-[#F4F4F4] rounded-xl shadow-lg border border-gray-200 
                  w-56 z-50 py-2 px-1 max-h-[130px] overflow-y-auto">
                  {gruposState.map((g) => {
                    const isAtual = grupoAtual(aluno.ra) === g.nome;
                    return (
                      <button
                        key={g.id}
                        onClick={() => {
                          handleMoverAluno(aluno.ra, g.nome);
                          setMenuAberto(null);
                        }}
                        className={`flex items-center w-full text-left px-1 py-1 text-[13px] hover:bg-gray-50 rounded ${
                          isAtual ? "text-[#C288B3] font-semibold" : "text-gray-800 italic underline font-medium"
                        }`}
                      >
                        {isAtual ? (
                          <><span className="mr-2">✓</span>{g.nome}</>
                        ) : (
                          <>
                            <img src="/plus_black.svg" alt="plus" className="w-2.5 h-2.5 mr-2" />
                            Mover para {g.nome}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
