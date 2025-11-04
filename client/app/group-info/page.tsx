"use client";

import "primeicons/primeicons.css";
import Image from "next/image";
import backArrow from "@/public/group-back-button.svg";
import ProjectCard from "@/components/group-info/project_card";
import AttendanceCard from "@/components/group-info/attendance_card";
import GradesCard from "@/components/group-info/grades_card";
import CommentsCard from "@/components/group-info/comments_card";

export default function GroupInfo() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-4 self-start">
        <button>
          <Image src={backArrow} alt="Voltar" width={32} height={32} />
        </button>
        <p className="ml-2 text-lg font-medium">Grupo 01</p>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col w-full gap-4 px-2 pr-5 xl:gap-6 xl:pr-10">
        {/* Linha 1: Project + Attendance */}
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6">
          <div className="flex-1">
            <ProjectCard />
          </div>
          <div className="flex-1">
            <AttendanceCard />
          </div>
        </div>

        {/* Linha 2: Grades + Comments */}
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6">
          {/* GradesCard ocupa 40% no lg */}
          <div className="flex-1 lg:basis-2/5 2xl:basis-2/6">
            <GradesCard />
          </div>

          {/* CommentsCard ocupa 60% no lg */}
          <div className="flex-1 lg:basis-3/5 2xl:basis-4/6">
            <CommentsCard />
          </div>
        </div>

        <div className="h-1"></div>
      </div>
    </div>
  );
}
