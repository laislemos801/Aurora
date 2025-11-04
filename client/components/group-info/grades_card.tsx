"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";

interface GradeItem {
  key: string;
  label: string;
}

export default function GradesCard() {
  const [selectedStudent, setSelectedStudent] = useState("Alunos");

  // Estado das notas
  const [grades, setGrades] = useState<Record<string, string>>({
    documentacao: "",
    fichaHoras: "",
    relatorioExtensao: "",
    apresentacao: "",
  });

  // Estado dos campos exibidos
  const [gradeItems, setGradeItems] = useState<GradeItem[]>([
    { key: "documentacao", label: "Documentação" },
    { key: "fichaHoras", label: "Ficha de Horas" },
    { key: "relatorioExtensao", label: "Relatório de Extensão" },
    { key: "apresentacao", label: "Apresentação" },
  ]);

  // Controle para adicionar novo campo
  const [adding, setAdding] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");

  const handleGradeChange = (key: string, value: string) => {
    setGrades((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    const key = newFieldName.toLowerCase().replace(/\s+/g, "_");

    // Evita duplicados
    if (gradeItems.some((item) => item.key === key)) return;

    const newItem = { key, label: newFieldName };
    setGradeItems((prev) => [...prev, newItem]);
    setGrades((prev) => ({ ...prev, [key]: "" }));
    setNewFieldName("");
    setAdding(false);
  };

  return (
    <div className="bg-[#F6F6F6] rounded-lg shadow-md w-full flex flex-col items-start gap-1 pb-3 pr-2">
      {/* Header */}
      <div className="flex justify-between items-center w-full pr-3 pl-4 pt-4">
        <h2 className="text-md font-medium text-gray-800 2xl:text-[18px]">Notas</h2>

        <div className="relative w-max flex items-center">
          <select
            className="bg-[#3B3B3B] rounded-sm px-2 py-0.5 pr-6 text-[9px] text-[#FCF3FA] font-light border-[0.5px] border-[#FCF3FA] appearance-none 
            sm:text-[11px] xl:text-[13px]"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option>Adriana Lopes</option>
            <option>Afonso Martins</option>
            <option>Alessandra Ribeiro</option>
            <option>Amanda Nogueira</option>
          </select>
          <div className="pointer-events-none absolute right-2 flex items-center h-full">
            <i className="pi pi-chevron-down text-[10px] text-[#FCF3FA]"></i>
          </div>
        </div>
      </div>

      {/* Lista de Inputs com scroll */}
      <div className="w-full mt-3 px-4 flex flex-col gap-2 max-h-[100px] overflow-y-auto lg:max-h-[240px] xl:gap-4 2xl:gap-5 2xl:max-h-[260px]">
        {gradeItems.map((item) => (
          <div
            key={item.key}
            className="flex justify-between items-center w-full bg-white py-2 px-2 rounded-sm"
          >
            <span className="text-[#000000] text-[12px] lg:text-[13px] xl:text-[14px]">{item.label}</span>
            <input
              type="text"
              value={grades[item.key] || ""}
              onChange={(e) => handleGradeChange(item.key, e.target.value)}
              className="bg-[#D9D9D9] border border-gray-300 rounded-md px-2 py-1 w-14 text-sm text-gray-800 text-center shadow-inner"
            />
          </div>
        ))}
      </div>

      {/* Campo para adicionar nova nota */}
      <div className="w-full px-4 mt-2">
        {adding ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="Nome da nova nota..."
              className="flex-1 bg-white rounded-md border border-gray-200 text-[13px] p-2 focus:outline-none focus:ring-1 focus:ring-[#B86B9F]"
            />
            <button
              onClick={handleAddField}
              className="bg-[#C288B3] text-white font-medium px-3 py-1 rounded-md text-sm hover:bg-[#6a5583]"
            >
              Adicionar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="bg-white w-full flex items-center gap-2 text-[#B86B9F] text-[13px] rounded-md mt-2 p-2 hover:underline
            xl:text-[14px]"
          >
            <FiPlus size={16} />
            Nova nota
          </button>
        )}
      </div>
    </div>
  );
}
