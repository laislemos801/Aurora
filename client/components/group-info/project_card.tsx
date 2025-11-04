"use client";

import { useState } from "react";

interface ProjectCardProps {
  initialName?: string;
  initialDescription?: string;
}

export default function ProjectCard({
  initialName = "Nome do projeto",
  initialDescription = "Edite para adicionar uma descrição ao projeto.",
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
    <div className="bg-[#F6F6F6] rounded-lg shadow-md px-3 pt-3 pb-2 w-full flex flex-col justify-between lg:h-full pb-4">
      {/* Input */}
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        readOnly={!isEditing}
        className={`p-1 text-[#3B3B3B] text-[14px] font-medium w-full mb-1
                    border-none outline-none transition-all md:text-[15px] xl:text-[16px] 2xl:text-[18px]
                    ${isEditing ? "bg-white focus:border focus:border-[#C288B3] focus:rounded-md" : "bg-transparent"}`}
      />

      {/* Textarea */}
      <textarea
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
        readOnly={!isEditing}
        className={`p-1 text-[11px] text-[#B8B8B8] text-justify leading-relaxed w-full
                    border-none outline-none resize-none transition-all
                    overflow-y-auto mb-2 lg:text-[12px] xl:text-[13px]
                    h-[70px] lg:h-[105px] 2xl:h-[130px]
                    [&::-webkit-scrollbar]:w-0.75
                    [&::-webkit-scrollbar-thumb]:bg-[#B8B8B8]/60
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-transparent
                    ${isEditing ? "bg-white focus:border focus:border-[#C288B3] focus:rounded-sm" : "bg-transparent"}`}
      />

      {/* Botão */}
      <button
        onClick={handleButtonClick}
        className="self-end mt-auto px-6 py-0.5 rounded-sm bg-[#C288B3] text-white hover:bg-[#6a5583] transition text-sm font-medium "
      >
        {isEditing ? "Salvar" : "Editar"}
      </button>
    </div>
  );
}
