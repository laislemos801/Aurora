"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { db } from "@/firebase/clientApp";
import { doc, getDoc, collection, getDocs, setDoc, updateDoc } from "firebase/firestore";

interface GradeItem {
  key: string;
  label: string;
}

interface Aluno {
  nome: string;
  ra: number;
}

export default function GradesCard() {
  const [selectedStudent, setSelectedStudent] = useState("Alunos");
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const turmaId = searchParams.get("turmaId");
  const grupoId = searchParams.get("grupoId");

  // === BUSCAR ALUNOS ===
  useEffect(() => {
    const fetchAlunos = async () => {
      if (!projectId || !turmaId || !grupoId) return;
      setLoading(true);

      try {
        const grupoRef = doc(db, "Projetos", projectId, "Turmas", turmaId, "Grupos", grupoId);
        const grupoSnap = await getDoc(grupoRef);

        if (grupoSnap.exists()) {
          const data = grupoSnap.data() as any;

          if (Array.isArray(data.alunos) && data.alunos.length > 0) {
            const listaOrdenada = data.alunos
              .map((a: any) => ({
                nome: String(a.nome ?? "Sem nome"),
                ra: Number(a.ra ?? 0),
              }))
              // ✅ Ordena alfabeticamente (case-insensitive)
              .sort((a: { nome: string; }, b: { nome: any; }) => a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" }));

            setAlunos(listaOrdenada);
            setSelectedStudent(listaOrdenada[0]?.nome ?? "Alunos");
            setLoading(false);
            return;
          }
        }

        // Fallback: subcoleção
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
        const snap = await getDocs(alunosRef);

        if (!snap.empty) {
          const lista = snap.docs.map((doc) => {
            const d = doc.data() as any;
            return { nome: String(d.nome ?? "Sem nome"), ra: Number(d.ra ?? 0) };
          });

          // ✅ Também ordena no fallback
          const listaOrdenada = lista.sort((a, b) =>
            a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" })
          );

          setAlunos(listaOrdenada);
          setSelectedStudent(listaOrdenada[0]?.nome ?? "Alunos");
        } else {
          setAlunos([]);
        }
      } catch (err) {
        console.error("Erro ao buscar alunos:", err);
        setAlunos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, [projectId, turmaId, grupoId]);

  useEffect(() => {
    const fetchNotas = async () => {
      if (!selectedStudent || alunos.length === 0) return;

      const aluno = alunos.find(a => a.nome === selectedStudent);
      if (!aluno) return;

      const notasRef = doc(
        db,
        "Projetos",
        projectId!,
        "Turmas",
        turmaId!,
        "Grupos",
        grupoId!,
        "notas",
        String(aluno.ra)
      );

      const snap = await getDoc(notasRef);

      if (snap.exists()) {
        setGrades(snap.data() as Record<string, string>);
      } else {
        // inicializa vazio para novo aluno
        setGrades({
          documentacao: "",
          fichaHoras: "",
          relatorioExtensao: "",
          apresentacao: "",
        });
      }
    };

    fetchNotas();
  }, [selectedStudent]);


  // === ESTADOS DAS NOTAS ===
  const [grades, setGrades] = useState<Record<string, string>>({
    documentacao: "",
    fichaHoras: "",
    relatorioExtensao: "",
    apresentacao: "",
  });

  const [gradeItems, setGradeItems] = useState<GradeItem[]>([
    { key: "documentacao", label: "Documentação" },
    { key: "fichaHoras", label: "Ficha de Horas" },
    { key: "relatorioExtensao", label: "Relatório de Extensão" },
    { key: "apresentacao", label: "Apresentação" },
  ]);

  const [adding, setAdding] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");

  const handleGradeChange = async (key: string, value: string) => {
    const aluno = alunos.find(a => a.nome === selectedStudent);
    if (!aluno) return;

    // Atualiza estado local imediatamente
    setGrades((prev) => ({ ...prev, [key]: value }));

    const notasRef = doc(
      db,
      "Projetos",
      projectId!,
      "Turmas",
      turmaId!,
      "Grupos",
      grupoId!,
      "notas",
      String(aluno.ra)
    );

    const snap = await getDoc(notasRef);

    if (!snap.exists()) {
      // === PRIMEIRA VEZ SALVANDO ===
      await setDoc(notasRef, {
        ...grades,
        [key]: value,
      });
      return;
    }

    // === ATUALIZA SOMENTE O QUE MUDOU ===
    await updateDoc(notasRef, {
      [key]: value,
    });
  };


  return (
    <div className="bg-[#F6F6F6] rounded-lg shadow-md w-full flex flex-col items-start gap-1 pb-3 pr-2">
      {/* Header */}
      <div className="flex justify-between items-center w-full pr-3 pl-4 pt-4">
        <h2 className="text-md font-medium text-gray-800 2xl:text-[18px]">Notas</h2>

        <div className="relative w-max flex items-center">
          {loading ? (
            <div className="text-xs text-gray-500">Carregando...</div>
          ) : alunos.length > 0 ? (
            <select
              className="bg-[#3B3B3B] rounded-sm px-2 py-0.5 pr-6 text-[9px] text-[#FCF3FA] font-light border-[0.5px] border-[#FCF3FA] appearance-none 
              sm:text-[11px] xl:text-[13px]"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              {alunos.map((a) => (
                <option key={a.ra} value={a.nome}>
                  {a.nome}
                </option>
              ))}
            </select>
          ) : (
            <div className="bg-[#3B3B3B] rounded-sm px-2 py-0.5 pr-6 text-[9px] text-[#FCF3FA] font-light border-[0.5px] border-[#FCF3FA] appearance-none 
              sm:text-[11px] xl:text-[13px]">Nenhum aluno</div>
          )}

          <div className="pointer-events-none absolute right-2 flex items-center h-full">
            <i className="pi pi-chevron-down text-[10px] text-[#FCF3FA]"></i>
          </div>
        </div>
      </div>

      {/* Lista de Inputs com scroll */}
      <div className="w-full mt-3 px-4 flex flex-col gap-2 max-h-[100px] overflow-y-auto lg:max-h-[189px] xl:gap-4 2xl:gap-5">
        {gradeItems.map((item) => (
          <div
            key={item.key}
            className="flex justify-between items-center w-full bg-white py-2 px-2 rounded-sm"
          >
            <span className="text-[#000000] text-[12px] lg:text-[13px] xl:text-[14px]">
              {item.label}
            </span>
            <input
              type="number"
              value={grades[item.key] || ""}
              onChange={(e) => handleGradeChange(item.key, e.target.value)}
              className="bg-[#D9D9D9] border border-gray-300 rounded-md px-2 py-1 w-14 text-sm text-gray-800 text-center shadow-inner
              appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
