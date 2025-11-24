"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { MdEdit, MdCalendarMonth } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";


interface Aluno {
  nome: string;
  ra: number;
}

interface PresencaCol {
  data: string; // ex: "20/Nov"
  presencas: Record<string, boolean>;
}

export default function AttendanceCard() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  const [presencasCols, setPresencasCols] = useState<PresencaCol[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const turmaId = searchParams.get("turmaId");
  const grupoId = searchParams.get("grupoId");

  // -------------------------
  // util: formatar para "DD/Mon" (pt-BR abreviado)
  // -------------------------
  function formatarDataColuna(date: Date) {
    const dia = String(date.getDate()).padStart(2, "0");
    const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    const mes = meses[date.getMonth()];
    return `${dia}/${mes}`;
  }

  // -------------------------
  // Buscar alunos e colunas de presença do grupo
  // -------------------------
  useEffect(() => {
    const fetchTudo = async () => {
      setLoading(true);
      if (!projectId || !turmaId || !grupoId) {
        setLoading(false);
        return;
      }

      try {
        // pega doc do grupo
        const grupoRef = doc(
          db,
          "Projetos",
          projectId,
          "Turmas",
          turmaId,
          "Grupos",
          grupoId
        );
        const grupoSnap = await getDoc(grupoRef);
        let alunosList: Aluno[] = [];

        if (grupoSnap.exists()) {
          const data = grupoSnap.data() as any;

          // Alunos podem estar em data.alunos (array) ou em subcoleção 'alunos'
          if (Array.isArray(data.alunos) && data.alunos.length > 0) {
            alunosList = data.alunos
              .map((a: any) => ({
                nome: String(a.nome ?? "Sem nome"),
                ra: Number(a.ra ?? 0),
              }))
              .sort((a: Aluno, b: Aluno) =>
                a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" })
              );
          } else {
            // fallback: subcoleção
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
            alunosList = snap.docs
              .map((d) => d.data() as any)
              .map((s) => ({
                nome: String(s.nome ?? "Sem nome"),
                ra: Number(s.ra ?? 0),
              }))
              .sort((a: Aluno, b: Aluno) =>
                a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" })
              );
          }

          // carrega presencas (se houver)
          const pres = (grupoSnap.data() as any).presencas || [];
          // pres deve ser array de {data: string, presencas: Record<string,boolean>}
          setPresencasCols(pres);
        }

        setAlunos(alunosList);
      } catch (error) {
        console.error("Erro ao buscar dados do grupo:", error);
        toast.error("Erro ao carregar dados do grupo.");
      } finally {
        setLoading(false);
      }
    };

    fetchTudo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, turmaId, grupoId]);

  // -------------------------
  // clique fora do calendário
  // -------------------------
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const t = e.target as Node;
      if (
        calendarRef.current &&
        !calendarRef.current.contains(t) &&
        buttonRef.current &&
        !buttonRef.current.contains(t)
      ) {
        setCalendarOpen(false);
      }
    }

    if (calendarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [calendarOpen]);

  // -------------------------
  // criar nova coluna (Today ou calendar)
  // -------------------------
  const criarColuna = async (date: Date) => {
    if (!projectId || !turmaId || !grupoId) {
      toast.error("Parâmetros do projeto/turma/grupo faltando.");
      return;
    }

    const dataFormatada = formatarDataColuna(date); // ex: "20/Nov"

    const grupoRef = doc(
      db,
      "Projetos",
      projectId,
      "Turmas",
      turmaId,
      "Grupos",
      grupoId
    );

    try {
      const grupoSnap = await getDoc(grupoRef);
      const dados = grupoSnap.exists() ? (grupoSnap.data() as any) : {};

      const presArray: PresencaCol[] = dados.presencas || [];

      // checar duplicata
      const existe = presArray.some((p) => p.data === dataFormatada);
      if (existe) {
        toast.error("A presença para este dia já foi atribuída.");
        return;
      }

      // construir mapa { nome: false }
      const mapa: Record<string, boolean> = {};
      alunos.forEach((a) => (mapa[a.nome] = false));

      const novaCol: PresencaCol = {
        data: dataFormatada,
        presencas: mapa,
      };

      const novoArray = [...presArray, novaCol];

      // salvar
      await updateDoc(grupoRef, { presencas: novoArray });

      // atualizar estado local
      setPresencasCols(novoArray);
      toast.success("Coluna de presença criada!");
    } catch (error) {
      console.error("Erro ao criar coluna:", error);
      toast.error("Erro ao criar coluna de presença.");
    }
  };

  // -------------------------
  // atualizar uma presença (checkbox)
  // -------------------------
  const togglePresenca = async (colData: string, nomeAluno: string) => {
    if (!projectId || !turmaId || !grupoId) {
      toast.error("Parâmetros do projeto/turma/grupo faltando.");
      return;
    }

    const grupoRef = doc(
      db,
      "Projetos",
      projectId,
      "Turmas",
      turmaId,
      "Grupos",
      grupoId
    );

    try {
      // encontra coluna
      const idx = presencasCols.findIndex((c) => c.data === colData);
      if (idx === -1) return;

      // copia e inverte valor
      const novoArray = presencasCols.map((c) =>
        c.data === colData
          ? {
              ...c,
              presencas: {
                ...c.presencas,
                [nomeAluno]: !c.presencas[nomeAluno],
              },
            }
          : c
      );

      // salva todo o array (simples e seguro)
      await updateDoc(grupoRef, { presencas: novoArray });

      // atualiza UI local
      setPresencasCols(novoArray);
    } catch (error) {
      console.error("Erro ao atualizar presença:", error);
      toast.error("Erro ao atualizar presença.");
    }
  };

  // -------------------------
  // handlers para os botões
  // -------------------------
  const handleHoje = async () => {
    await criarColuna(new Date());
  };

  const handleSelecionarData = async (d: Date | null) => {
    if (!d) return;
    setSelectedDate(d);
    setCalendarOpen(false);
    await criarColuna(d);
  };

  // placeholder editar/salvar (você adapta)
  const handleEditar = () => setIsEditing(true);
  const handleSalvar = () => setIsEditing(false);

  // -------------------------
  // render
  // -------------------------
  if (loading) {
    return (
      <div className="bg-[#F6F6F6] rounded-lg shadow-md w-full flex justify-center items-center py-6">
        <p className="text-gray-500 text-sm">Carregando...</p>
      </div>
    );
  }

 return (
  <div className="bg-[#F6F6F6] rounded-lg shadow-md max-w-full flex flex-col gap-1 pb-3 relative
                h-[330px]">

    {/* Header */}
    <div className="flex items-center w-full pr-3 pl-4 pt-4 gap-2">
      <h2 className="text-[14px] font-medium text-[#000000] xl:text-[16px] 2xl:text-[18px]">
        Marcar Presença
      </h2>

      <div className="flex items-center gap-2 ml-auto">
        {isEditing ? (
          <button
            onClick={handleSalvar}
            className="px-3 py-0.5 rounded-sm bg-[#7B6294] text-white hover:bg-[#6a5583] transition text-[12px]"
          >
            Salvar
          </button>
        ) : (
          <button
            onClick={handleEditar}
            className="bg-[#7B6294] p-1.5 rounded-full shadow hover:bg-[#674984] transition lg:p-2"
          >
            <MdEdit size={14} className="text-[#FCF3FA]" />
          </button>
        )}

        <button
          onClick={handleHoje}
          className="px-3 py-0.5 rounded-sm bg-[#3B3B3B] text-[#FCF3FA] text-[12px] hover:bg-[#6a5583] transition lg:py-1.5 "
        >
          Hoje
        </button>

        <button
          ref={buttonRef}
          onClick={() => setCalendarOpen((p) => !p)}
          className="bg-[#3B3B3B] flex items-center gap-2 p-1.5 rounded-full shadow cursor-pointer hover:bg-[#674984] transition lg:rounded-md"
        >
          <MdCalendarMonth size={14} className="text-[#FCF3FA]" />

          {/* Texto visível só em telas >= lg */}
          <span className="hidden lg:inline text-[12px] text-[#FCF3FA] pr-1">
            Escolha uma data
          </span>
        </button>

      </div>
    </div>

    {/* calendário */}
    {calendarOpen && (
      <div ref={calendarRef} className="absolute right-4 top-16 z-50">
        <DatePicker
          selected={selectedDate}
          onChange={(d) => handleSelecionarData(d)}
          locale={ptBR}
          dateFormat="dd/MM/yyyy"
          inline
        />
      </div>
    )}

    {/* linha separadora */}
    <div className="w-full border-b border-[#D9D9D9] mb-2 mt-2"></div>

    {/* Se NÃO houver alunos */}
      {alunos.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full py-6 text-center gap-3">
          <img
            src="/no-students.png" 
            alt="Sem alunos"
            className="w-22 h-22 opacity-80 lg:w-32 lg:h-32"
          />
          <p className="text-gray-500 text-[12px]">
            Ainda não há <span className="font-semibold text-[#90416B]">alunos</span> neste grupo.
            <br />
            <span className="font-semibold text-[#90416B]">Adicione</span> alunos para começar a marcar presença!
          </p>
        </div>
      )}

      {/* Se houver alunos */}
      {alunos.length > 0 && (
        <div className="overflow-x-auto min-w-0">
          <div className="min-w-max">

            {/* HEADER */}
            <div
              className="grid border-b pb-2 gap-0"
              style={{
                gridTemplateColumns: `minmax(145px, 145px) repeat(${presencasCols.length}, 60px)`
              }}
            >
              <div className="font-medium text-[12px] px-4 whitespace-nowrap overflow-hidden text-ellipsis">
                Nome / RA
              </div>

              {presencasCols.map((col) => (
                <div
                  key={col.data}
                  className="text-center text-[12px] font-medium"
                >
                  {col.data}
                </div>
              ))}
            </div>

            {/* LINHAS */}
            {alunos.map((a) => (
              <div
                key={a.ra}
                className="grid border-b py-2 gap-0 px-4"
                style={{
                  gridTemplateColumns: `minmax(130px, 130px) repeat(${presencasCols.length}, 60px)`
                }}
              >
                <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                  <div className="font-medium text-[14px] text-[#3B3B3B]">{a.nome}</div>
                  <div className="text-[12px] text-[#6B6B6B]">({a.ra})</div>
                </div>

                {presencasCols.map((col) => (
                  <div key={col.data} className="flex items-center justify-center">
                    <label className="cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(col.presencas[a.nome])}
                        onChange={() => togglePresenca(col.data, a.nome)}
                        className="peer sr-only"
                      />
                      <div className="w-4 h-4 border border-[#C288B3] rounded bg-white peer-checked:bg-[#C288B3]"></div>
                    </label>
                  </div>
                ))}
              </div>
            ))}

          </div>
        </div>
      )}
  </div>
  );
}
