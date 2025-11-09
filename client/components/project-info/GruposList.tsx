"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface Grupo {
  id: string;
  nome: string;
  nomeProjeto?: string; 
}

interface Props {
  projectId: string;
  turmaId: string;
  projectName?: string;
}

export function GruposList({ projectId, turmaId, projectName }: Props) {
  const router = useRouter();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);

  const handleManage = (grupoId: string) => {
    router.push(
      `/group-info?page=group-info&projectId=${projectId}&turmaId=${turmaId}&grupoId=${grupoId}`
    );
  };

  useEffect(() => {
    if (!turmaId) return;

    const fetchGroups = async () => {
      setLoading(true);

      const snap = await getDocs(
        collection(db, "Projetos", projectId, "Turmas", turmaId, "Grupos")
      );

      const gruposData = snap.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any),
        nomeProjeto: projectName || undefined, 
      }));

      setGrupos(gruposData);
      setLoading(false);
    };

    fetchGroups();
  }, [projectId, turmaId, projectName]);

  const handleAddGroup = async () => {
    const indice = grupos.length + 1;
    const nome = `Grupo ${String(indice).padStart(2, "0")}`;
    const nomeProjeto = projectName || undefined;

    const docRef = await addDoc(
      collection(db, "Projetos", projectId, "Turmas", turmaId, "Grupos"),
      { nome } // salva só o nome do grupo no Firestore
    );

    setGrupos(prev => [...prev, { id: docRef.id, nome, nomeProjeto }]);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl py-4 w-full flex flex-col mt-5 px-4 max-h-[240px] md:max-h-[300px] 
    md:ml-4 lg:max-h-[609px]">
      {/* Lista de grupos — rolagem apenas aqui */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 lg:gap-4">
        {loading && <p className="text-sm text-gray-500">Carregando grupos...</p>}
        {!loading && grupos.length === 0 && <p className="text-sm text-gray-500">Nenhum grupo criado.</p>}
        {grupos.map((g) => (
          <div
            key={g.id}
            className="flex justify-between items-center px-3 py-2 rounded-md shadow-inner bg-[#FCF3FA] lg:py-4 lg:px-5"
          >
            <span className="text-sm font-medium text-[#4A3A55] lg:text-[16px]">
              {g.nome}{g.nomeProjeto ? ` - ${g.nomeProjeto}` : ''}
            </span>

            <button
              onClick={() => handleManage(g.id)}
              className="px-4 py-0.5 text-xs rounded-md bg-[#3B3B3B] text-[#FCF3FA] font-medium lg:py-1 lg:rounded-sm"
            >
              Gerenciar
            </button>
          </div>
        ))}
      </div>

      {/* Botão “Novo grupo” não ocupa toda a largura */}
      <div className="mt-3">
        <button
          onClick={handleAddGroup}
          className="inline-flex items-center gap-2 justify-start rounded-sm py-1.5 px-4 bg-[#3B3B3B] text-[#FCF3FA]
          text-[12px] font-semibold hover:opacity-90 transition"
        >
          <FiPlus size={16} /> Novo grupo
        </button>
      </div>
    </div>
  );
}
