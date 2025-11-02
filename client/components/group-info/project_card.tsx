"use client";

import { useState } from "react";

interface ProjectCardProps {
  initialName?: string;
  initialDescription?: string;
}

export default function ProjectCard({
  initialName = "Nome do projeto",
  initialDescription = "Clique aqui para adicionar uma descrição ao projeto.",
}: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [projectName, setProjectName] = useState(initialName);
  const [projectDescription, setProjectDescription] = useState(initialDescription);

  const handleButtonClick = () => {
    if (isEditing) {
      console.log("Salvando:", { projectName, projectDescription });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-[#F6F6F6] rounded-lg shadow-md px-3 py-2 w-full flex flex-col items-start gap-1">
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        readOnly={!isEditing}
        className={`p-1 text-[#3B3B3B] text-[14px] font-medium w-full
                    border-none outline-none transition-all
                    ${isEditing ? "bg-white focus:border focus:border-[#C288B3] focus:rounded-sm focus:shadow-sm" : "bg-transparent"}`}
      />

      <textarea
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
        rows={4}
        readOnly={!isEditing}
        className={`p-1 text-[11px] text-[#B8B8B8] text-justify leading-relaxed w-full pr-3
                    border-none outline-none resize-none transition-all
                    overflow-y-auto
                    [&::-webkit-scrollbar]:w-0.75
                    [&::-webkit-scrollbar-thumb]:bg-[#B8B8B8]/60
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-transparent
                    ${isEditing ? "bg-white focus:border focus:border-[#C288B3] focus:rounded-sm focus:shadow-sm" : "bg-transparent"}`}
      />

      <button
        onClick={handleButtonClick}
        className="mt-2 mb-1 self-end px-6 py-0.5 rounded-sm bg-[#C288B3] text-white hover:bg-[#6a5583] transition text-sm font-medium"
      >
        {isEditing ? "Salvar" : "Editar"}
      </button>
    </div>
  );
}
