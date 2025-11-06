"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import Avatar from "../../public/avatar.svg";

interface TemplateCardProps {
  nome: string;
  semestre: number;
  curso: string;
  descricao: string;
  professores: string[];
}

interface ProfessorData {
  profilePicture?: string;
  nome: string;
}

export default function TemplateCard({
  nome,
  curso,
  semestre,
  descricao,
  professores,
}: TemplateCardProps) {
  const semestreFormatado = String(semestre).padStart(2, "0");

  const [professoresData, setProfessoresData] = useState<ProfessorData[]>([]);

  useEffect(() => {
    async function carregarProfessores() {
      const promises = professores.map(async (profUid) => {
        const profRef = doc(db, "Professores", profUid);
        const profSnap = await getDoc(profRef);

        if (profSnap.exists()) {
          const data = profSnap.data();
          return {
            profilePicture: data.profilePicture,
            nome: data.nome,
          };
        }

        return { nome: "Sem nome" };
      });

      const result = await Promise.all(promises);
      setProfessoresData(result);
    }

    carregarProfessores();
  }, [professores]);

    const getProfileImage = (path?: string) => {
    if (!path || path === "") return Avatar;

    if (path.startsWith("http")) return path;

    if (path.startsWith("/")) return path;

    return Avatar;
    };

  return (
    <button className="bg-[#F6F6F6] rounded-xl p-3 w-full flex flex-col h-52 hover:scale-[1.02] transition cursor-pointer text-left">

      <p className="text-3xl font-medium">{semestreFormatado}</p>

      <p className="text-[12px] font-medium text-[#90416B]">{nome}</p>
      <p className="text-[10px] italic text-[#3B3B3B] font-medium">{curso}</p>

      <p className="mt-3 text-[8px] line-clamp-3 text-[#333] font-medium italic">
        {descricao}
      </p>

      <p className="text-xs font-medium mt-4 italic text-[#1E1E1E]">Professores</p>

      <div className="flex gap-2 mt-2">
        {professoresData.map((prof, i) => (
          <Image
            key={i}
            src={getProfileImage(prof.profilePicture)}
            alt={prof.nome}
            width={24}
            height={24}
            className="rounded-full object-cover w-6 h-6"
          />
        ))}
      </div>
    </button>
  );
}
