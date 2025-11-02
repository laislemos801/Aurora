"use client";

import { useState } from "react";

export default function GradesCard() {
  const [selectedStudent, setSelectedStudent] = useState("Alunos");

  // Estados das notas
  const [grades, setGrades] = useState({
    documentacao: "",
    fichaHoras: "",
  });

  // Lista de itens de notas
  const gradeItems = [
    { key: "documentacao", label: "Documentação" },
    { key: "fichaHoras", label: "Ficha de Horas" },
    { key: "relatorioExtensao", label: "Relatório de Extensão" },
    { key: "apresentacao", label: "Apresentação" },
  ];

  const handleGradeChange = (key: string, value: string) => {
    setGrades((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-[#F6F6F6] rounded-lg shadow-md w-full flex flex-col items-start gap-1 pb-3">
      {/* Header */}
      <div className="flex justify-between items-center w-full pr-3 pl-4 pt-4">
        <h2 className="text-md font-medium text-gray-800">Notas</h2>
        <div className="relative w-max flex items-center">
          <select
            className="bg-[#3B3B3B] rounded-sm px-2 py-0.5 pr-6 text-[9px] text-[#FCF3FA] font-light border-[0.5px] border-[#FCF3FA] appearance-none"
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
      <div className="w-full mt-3 px-4 flex flex-col gap-2 max-h-[100px] overflow-y-auto">
        {gradeItems.map((item) => (
            <div
            key={item.key}
            className="flex justify-between items-center w-full bg-white py-2 px-4 rounded-sm"
            >
            <span className="text-[#000000] text-[12px]">{item.label}</span>
            <input
                type="text"
                value={grades[item.key as keyof typeof grades]}
                onChange={(e) => handleGradeChange(item.key, e.target.value)}
                className="bg-[#D9D9D9] border border-gray-300 rounded-md px-2 py-1 w-14 text-sm text-gray-800 text-center shadow-inner"
            />
            </div>
        ))}
      </div>
    </div>
  );
}
