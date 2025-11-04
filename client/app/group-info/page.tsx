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
      <div className="flex items-center mb-4 self-start">
        <button>
          <Image src={backArrow} alt="Voltar" width={32} height={32} />
        </button>
        <p className="ml-2">Grupo 01</p>
      </div>

      <div className="flex flex-col w-full gap-4 px-2 pr-5">
        <ProjectCard />
        <AttendanceCard />
        <GradesCard />
        <CommentsCard />
        <div className="h-1"></div>
      </div>
    </div>
  );
}
