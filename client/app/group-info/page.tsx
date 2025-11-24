"use client";

import "primeicons/primeicons.css";
import Image from "next/image";
import backArrow from "@/public/group-back-button.svg";
import ProjectCard from "@/components/group-info/project_card";
import AttendanceCard from "@/components/group-info/attendance_card";
import GradesCard from "@/components/group-info/grades_card";
import CommentsCard from "@/components/group-info/comments_card";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { collection, deleteDoc, getDocs } from "firebase/firestore";

export default function GroupInfo() {
  const { user, loading } = useAuthGuard();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const turmaId = searchParams.get("turmaId");
  const grupoId = searchParams.get("grupoId");
  const [showModal, setShowModal] = useState(false);

  const [grupo, setGrupo] = useState<any>(null);
  const router = useRouter();

  const onDelete = async () => {
    if (!projectId || !turmaId || !grupoId) return;

    try {
      // Referência principal do grupo
      const grupoRef = doc(
        db,
        "Projetos",
        projectId,
        "Turmas",
        turmaId,
        "Grupos",
        grupoId
      );

      const subcollections = ["alunos", "presencas", "notas", "comentarios"];

      for (const sub of subcollections) {
        const colRef = collection(grupoRef, sub);
        const snap = await getDocs(colRef);

        const deletes = snap.docs.map((d) => deleteDoc(doc(colRef, d.id)));
        await Promise.all(deletes); // Remove todos os docs da subcoleção
      }

      await deleteDoc(grupoRef);

      router.push(`/projects-info/${projectId}`);

    } catch (error: any) {
      console.error("Erro ao excluir grupo:", error);
      alert("Erro ao excluir o grupo.");
    }
  };

  useEffect(() => {
    if (!projectId || !turmaId || !grupoId) return;

    const fetchGrupo = async () => {
      const snap = await getDoc(
        doc(db, "Projetos", projectId, "Turmas", turmaId, "Grupos", grupoId)
      );
      if (snap.exists()) setGrupo({ id: snap.id, ...snap.data() });
    };

    fetchGrupo();
  }, [projectId, turmaId, grupoId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4EAF4]">
        <p className="text-[#7A4C77] text-lg">Carregando informações...</p>
      </div>
    );
  }

  if (!user) return null;
  if (!grupo) return <p>Carregando grupo...</p>;

  return (
    <div
      className="
        flex flex-col 
        w-full 
        flex-1 
        min-h-0 
        overflow-y-auto 
        overflow-x-auto
        items-center 
        px-4 sm:px-4 xl:px-8 
        py-4 
        gap-6
      "
    >
     {/* Header */}
      <div className="flex items-center justify-between w-full flex-shrink-0">

        {/* Esquerda: Voltar + Nome */}
        <div className="flex items-center gap-2">
          <button onClick={() => router.push(`/projects-info/${projectId}`)}>
            <Image src={backArrow} alt="Voltar" width={32} height={32} />
          </button>

          <p className="text-lg font-medium">{grupo?.nome || "Grupo"}</p>
        </div>

        {/* Direita: Botão Excluir */}
        <button
          onClick={() => setShowModal(true)}
          className="
            flex items-center gap-1 sm:gap-2
            bg-[#B65254] hover:bg-[#863435] text-white
            px-2 py-1.5 sm:px-2 sm:py-2
            text-xs sm:text-sm
            rounded-lg cursor-pointer transition
          "
        >
          <i className="pi pi-trash text-[12px] sm:text-[14px]" />
          <span>Excluir grupo</span>
        </button>
      </div>

      {/* Modal de confirmação */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white flex flex-col items-center justify-center rounded-2xl p-6 w-80 sm:w-full max-w-md shadow-lg text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Excluir grupo?
            </h2>
            <p className="text-sm text-center text-gray-600 mb-6">
              Tem certeza que deseja excluir este grupo e todos os dados associados?
            </p>
            <p className="text-sm font-semibold text-center text-[#B65254] mb-6" >
              Essa ação não poderá ser desfeita.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  onDelete?.(); 
                }}
                className="px-4 py-2 rounded-lg bg-[#B65254] hover:bg-[#863435] text-white transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6">

        {/* Coluna 1 */}
        <div className="flex flex-col gap-4 lg:max-h-[680px]">
          <ProjectCard />
          <CommentsCard />
        </div>

        {/* Coluna 2 */}
        <div className="flex flex-col gap-4">
          <AttendanceCard />
          <GradesCard />
        </div>

        {/* Espaço final */}
        <div className="h-1 flex-shrink-0"></div>
      </div>
    </div>
  );
}
