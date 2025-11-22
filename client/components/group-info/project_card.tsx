"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/clientApp";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { MdEdit } from "react-icons/md";

export default function ProjectCard() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const turmaId = searchParams.get("turmaId");
  const grupoId = searchParams.get("grupoId");

  const [isEditing, setIsEditing] = useState(false);
  const [projectName, setProjectName] = useState<string>("Nome do projeto");
  const [projectDescription, setProjectDescription] = useState<string>(
    "Edite para adicionar uma descrição ao projeto."
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !turmaId || !grupoId) return;

    const fetchData = async () => {
      try {
        const grupoRef = doc(db, "Projetos", projectId, "Turmas", turmaId, "Grupos", grupoId);
        const grupoSnap = await getDoc(grupoRef);

        if (grupoSnap.exists()) {
          const data = grupoSnap.data();
          if (data.nomeProjeto) setProjectName(data.nomeProjeto);
          if (data.descricao) setProjectDescription(data.descricao);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do grupo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, turmaId, grupoId]);

  const handleButtonClick = async () => {
    if (isEditing && projectId && turmaId && grupoId) {
      try {
        const grupoRef = doc(db, "Projetos", projectId, "Turmas", turmaId, "Grupos", grupoId);
        await updateDoc(grupoRef, {
          nomeProjeto: projectName,
          descricao: projectDescription,
        });
        console.log("Salvo com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar:", error);
      }
    }
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="bg-[#F6F6F6] rounded-lg shadow-md p-4">
        <p className="text-[#7A4C77] text-sm">Carregando projeto...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F6F6] rounded-lg shadow-md px-3 pt-3 w-full flex flex-col justify-between relative pb-4">

      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        readOnly={!isEditing}
        className={`p-1 text-[#000000] text-[14px] font-medium w-full mb-1
                    border-none outline-none transition-all md:text-[15px] xl:text-[16px] 2xl:text-[18px]
                    ${isEditing ? "bg-white focus:border focus:border-[#C288B3] focus:rounded-md" : "bg-transparent"}`}
      />

      <textarea
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
        readOnly={!isEditing}
        className={`p-1 text-[11px] text-[#3B3B3B] text-justify leading-relaxed w-full
                    border-none outline-none resize-none transition-all font-medium
                    overflow-y-auto mb-2 lg:text-[12px] xl:text-[13px]
                    h-[70px] lg:h-[100px]
                    [&::-webkit-scrollbar]:w-0.75
                    [&::-webkit-scrollbar-thumb]:bg-[#3B3B3B]/60
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-transparent
                    ${isEditing ? "bg-white focus:border focus:border-[#C288B3] focus:rounded-sm" : "bg-transparent"}`}
      />

      <div className="flex justify-end items-center mt-2">
        {isEditing ? (
          <button
            onClick={handleButtonClick}
            className="px-6 py-0.5 rounded-sm bg-[#7B6294] cursor-pointer text-white hover:bg-[#6a5583] transition text-sm font-medium"
          >
            Salvar
          </button>
        ) : (
          <button
            onClick={handleButtonClick}
            className="bg-[#7B6294] p-1.5 rounded-full shadow cursor-pointer hover:bg-[#674984] transition"
          >
            <MdEdit size={12} className="text-[#FCF3FA]" />
          </button>
        )}
      </div>
    </div>
  );
}
