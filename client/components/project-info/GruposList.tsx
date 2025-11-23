"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";

interface Grupo {
  id: string;
  nome: string;
  alunos?: string[];
  nomeProjeto?: string;
}

interface Props {
  projectId: string;
  turmaId: string;
  projectName?: string;
  onDeleteTurma?: () => void;
}

export function GruposList({ projectId, turmaId, projectName, onDeleteTurma }: Props) {
  const router = useRouter();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleManage = (grupoId: string) => {
    router.push(
      `/group-info?page=group-info&projectId=${projectId}&turmaId=${turmaId}&grupoId=${grupoId}`
    );
  };

  useEffect(() => {
    if (!turmaId) return;

    const unsubscribe = onSnapshot(
      collection(db, "Projetos", projectId, "Turmas", turmaId, "Grupos"),
      (snap) => {
        const gruposData = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
          nomeProjeto: projectName || undefined,
        }));

        gruposData.sort((a, b) =>
          a.nome.localeCompare(b.nome, "pt", { numeric: true })
        );

        setGrupos(gruposData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [projectId, turmaId, projectName]);

  const handleAddGroup = async () => {
    const indice = grupos.length + 1;
    const nome = `Grupo ${String(indice).padStart(2, "0")}`;
    const nomeProjeto = projectName || undefined;

    const docRef = await addDoc(
      collection(db, "Projetos", projectId, "Turmas", turmaId, "Grupos"),
      { nome }
    );

    setGrupos((prev) =>
      [...prev, { id: docRef.id, nome, nomeProjeto }].sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt", { numeric: true })
      )
    );

    toast.success(`${nome} criado com sucesso!`);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl py-4 w-full flex flex-col mt-5 px-4 max-h-[240px] md:max-h-[300px] 
    md:ml-4 lg:max-h-[609px]">
      {/* Lista de grupos — rolagem apenas aqui */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 lg:gap-4">
        {loading && <p className="text-sm text-gray-500">Carregando grupos...</p>}
        {!loading && grupos.length === 0 && (
          <p className="text-sm text-gray-500">Nenhum grupo criado.</p>
        )}
        {grupos.map((g) => (
          <div
            key={g.id}
            className="flex justify-between items-center px-3 py-2 rounded-md shadow-inner bg-[#FCF3FA] lg:py-4 lg:px-5"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#4A3A55] lg:text-[16px]">
                {g.nome}
                {g.nomeProjeto ? ` - ${g.nomeProjeto}` : ""}
              </span>

              {/* Lista de alunos do grupo lado a lado */}
              {g.alunos && g.alunos.length > 0 ? (
                <div className="flex flex-wrap gap-4 mt-1 ml-1">
                  {g.alunos.map((aluno: any) => (
                    <span
                      key={aluno.ra}
                      className="text-xs text-[#3B3B3B] px-2 py-[2px] rounded-md"
                    >
                      {aluno.nome}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-gray-400 italic ml-1 mt-1">
                  Nenhum aluno alocado
                </span>
              )}
            </div>

            <button
              onClick={() => handleManage(g.id)}
              className="px-4 py-0.5 text-xs rounded-md bg-[#7B6294] hover:bg-[#674984] cursor-pointer text-[#FCF3FA] font-medium lg:py-1 lg:rounded-sm"
            >
              Gerenciar
            </button>
          </div>
        ))}
      </div>

      {/* Botão “Novo grupo” */}
      <div className="mt-3 flex gap-2 pr-4 pl-3 justify-start">
        <button
          onClick={handleAddGroup}
          className="inline-flex items-center gap-2 justify-start rounded-sm py-1.5 px-4 bg-[#3B3B3B] hover:opacity-80 cursor-pointer text-[#FCF3FA]
          text-[12px] font-semibold transition"
        >
          <FiPlus size={16} /> Novo grupo
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 justify-start cursor-pointer rounded-sm py-1.5 px-4 bg-[#B65254] hover:bg-[#863435] text-[#FCF3FA]
          text-[12px] font-semibold hover:opacity-90 transition"
        >
          <RiDeleteBin6Line size={12} className="sm:size-4" />
          <span>Excluir turma</span>
        </button>
      </div>

      {/* Modal de confirmação */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white flex flex-col items-center justify-center rounded-2xl p-6 w-80 sm:w-full max-w-md shadow-lg text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Excluir turma?</h2>
            <p className="text-sm text-center text-gray-600 mb-6">
              Tem certeza que deseja excluir esta turma e todos os grupos associados?
            </p>
            <p className="text-sm font-semibold text-center text-[#B65254] mb-6">
              Essa ação não poderá ser desfeita.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  onDeleteTurma?.();
                }}
                className="px-4 py-2 rounded-lg bg-[#B65254] hover:bg-[#863435] text-white transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
