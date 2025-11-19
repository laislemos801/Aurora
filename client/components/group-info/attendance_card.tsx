"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

interface Aluno {
  nome: string;
  ra: number;
  present: boolean;
}

export default function AttendanceCard() {
  const [selectedWeek, setSelectedWeek] = useState("Semana 1 - 25/04/2025");
  const [attendance, setAttendance] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const turmaId = searchParams.get("turmaId");
  const grupoId = searchParams.get("grupoId");

  // === BUSCAR ALUNOS CADASTRADOS (ARRAY no documento OU subcoleção) ===
  useEffect(() => {
    const fetchAlunos = async () => {
      setLoading(true);
      setAttendance([]);

      if (!projectId || !turmaId || !grupoId) {
        setLoading(false);
        return;
      }

      try {
        const grupoRef = doc(db, "Projetos", projectId, "Turmas", turmaId, "Grupos", grupoId);
        const grupoSnap = await getDoc(grupoRef);

        if (grupoSnap.exists()) {
          const data = grupoSnap.data() as any;

          if (Array.isArray(data.alunos) && data.alunos.length > 0) {
            // === Ordena alfabeticamente o array ===
            const alunosList: Aluno[] = data.alunos
              .map((a: any) => ({
                nome: String(a.nome ?? "Sem nome"),
                ra: Number(a.ra ?? 0),
                present: false,
              }))
              .sort((a: { nome: string; }, b: { nome: any; }) => a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" }));

            setAttendance(alunosList);
            setLoading(false);
            return;
          }
        }

        // === Fallback: subcoleção ===
        const alunosRef = collection(
          db,
          "Projetos",
          projectId,
          "Turmas",
          turmaId,
          "Grupos",
          grupoId,
          "alunos"
        );
        const snapshot = await getDocs(alunosRef);

        if (!snapshot.empty) {
          const alunosList = snapshot.docs
            .map((d) => {
              const data = d.data() as any;
              return {
                nome: String(data.nome ?? "Sem nome"),
                ra: Number(data.ra ?? 0),
                present: false,
              } as Aluno;
            })
            // === Também ordena aqui ===
            .sort((a, b) => a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" }));

          setAttendance(alunosList);
        } else {
          setAttendance([]);
        }
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        setAttendance([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, [projectId, turmaId, grupoId]);

  // === TOGGLE PRESENÇA ===
  const togglePresence = (index: number) => {
    setAttendance((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], present: !copy[index].present };
      return copy;
    });
  };

  if (loading) {
    return (
      <div className="bg-[#F6F6F6] rounded-lg shadow-md w-full flex justify-center items-center py-6">
        <p className="text-gray-500 text-sm">Carregando alunos...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F6F6] rounded-lg shadow-md w-full flex flex-col items-start gap-1 pb-3 h-full">
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

      {/* Lista de alunos */}
      <div className="w-full max-h-[150px] overflow-y-auto pr-2 pl-4">
        {attendance.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full text-center">
            <img
              src="/no-students.png"
              alt="Sem alunos"
              className="w-24 h-24 opacity-80 mb-2 xl:w-28 xl:h-28"
            />
            <p className="text-gray-500 text-[12px] mb-2">
              Nenhum aluno adicionado a esse <span className="font-semibold text-[#90416B]">grupo</span>.
            </p>
          </div>
        ) : (
          attendance.map((student, idx) => (
            <div
              key={student.ra ?? idx}
              className="grid grid-cols-[2fr_1fr_1fr] w-full mb-2 text-[12px] font-normal text-[#000000] leading-none items-center
              xl:text-[14px] 2xl:mb-3"
            >
              <span className="text-left text-[#3B3B3B]">{student.nome}</span>
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
          ))
        )}
      </div>
    </div>
  );
}
