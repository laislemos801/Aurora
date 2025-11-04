"use client";

import { useState } from "react";

export default function AttendanceCard() {
  const [selectedWeek, setSelectedWeek] = useState("Semana 1 - 25/04/2025");

  const students = [
    { name: "Adriana Lopes", ra: "2020207", present: false },
    { name: "Afonso Martins", ra: "3838498", present: false },
    { name: "Alessandra Ribeiro", ra: "4365464", present: false },
    { name: "Amanda Nogueira", ra: "6546546", present: false },
    { name: "Carlos Pereira", ra: "2341234", present: false },
  ];

  const [attendance, setAttendance] = useState(students);

  const togglePresence = (index: number) => {
    const updated = [...attendance];
    updated[index].present = !updated[index].present;
    setAttendance(updated);
  };

  return (
    <div className="bg-[#F6F6F6] rounded-lg shadow-md w-full flex flex-col items-start gap-1 pb-3">
      {/* Header */}
      <div className="flex justify-between items-center w-full pr-3 pl-4 pt-4">
        <h2 className="text-md font-medium text-gray-800 xl:text-[16px] 2xl:text-[18px]">
          Marcar Presença
        </h2>
        <div className="relative w-max flex items-center">
          <select
            className="bg-[#3B3B3B] rounded-sm px-2 py-0.5 pr-6 text-[9px] text-[#FCF3FA] font-light border-[0.5px] border-[#FCF3FA] appearance-none
            sm:text-[11px] xl:text-[13px]"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
          >
            <option>Semana 1 - 25/04/2025</option>
            <option>Semana 2 - 02/05/2025</option>
            <option>Semana 3 - 09/05/2025</option>
          </select>

          <div className="pointer-events-none absolute right-2 flex items-center h-full">
            <i className="pi pi-chevron-down text-[10px] text-[#FCF3FA]"></i>
          </div>
        </div>
      </div>

      {/* Linha separadora */}
      <div className="w-full border-b border-[#D9D9D9] mb-2"></div>

      {/* Cabeçalho da tabela */}
      <div
        className="grid grid-cols-[2fr_1fr_1fr] w-full mb-2 text-[12px] font-normal text-[#000000] 
        pr-3 pl-4 xl:text-[15px]"
      >
        <span className="text-left pr-4">Nome</span>
        <span className="text-center">RA</span>
        <span className="text-center">Presença</span>
      </div>

      {/* Lista com scroll */}
      <div className="w-full max-h-[150px] overflow-y-auto pr-2 pl-4">
        {attendance.map((student, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[2fr_1fr_1fr] w-full mb-2 text-[12px] font-normal text-[#000000] leading-none items-center
            xl:text-[14px] 2xl:mb-3"
          >
            <span className="text-left text-[#3B3B3B]">{student.name}</span>
            <span className="text-center">{student.ra}</span>
            <div className="flex justify-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={student.present}
                  onChange={() => togglePresence(idx)}
                  className="peer sr-only"
                />
                <div className="w-3 h-3 border border-[#C288B3] rounded-[3px] bg-white peer-checked:bg-[#C288B3] sm:w-3.5 sm:h-3.5 2xl:w-4 2xl:h-4"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
