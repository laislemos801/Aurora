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

export default function GroupInfo() {
  const { user, loading } = useAuthGuard();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const turmaId = searchParams.get("turmaId");
  const grupoId = searchParams.get("grupoId");

  const [grupo, setGrupo] = useState<any>(null);
  const router = useRouter();

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
      <div className="flex items-center self-start gap-2 flex-shrink-0">
        <button onClick={() => router.push(`/projects-info/${projectId}`)}>
          <Image src={backArrow} alt="Voltar" width={32} height={32} />
        </button>
        <p className="text-lg font-medium">{grupo?.nome || "Grupo"}</p>
      </div>

      {/* Conteúdo principal */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6">

        {/* Coluna 1 */}
        <div className="flex flex-col gap-4 lg:max-h-[440px]">
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
