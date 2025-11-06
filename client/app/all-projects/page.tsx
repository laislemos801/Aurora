"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import TemplateCard from "@/components/all-projects/card";
import { IoSearchSharp } from "react-icons/io5";
import Link from "next/link";

interface Projeto {
  id: string;
  nome: string;
  curso: string;
  semestre: number;
  descricao: string;
  professores: string[];
}

export default function AllProjectsCards() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);

  useEffect(() => {
    async function loadProjects() {
      const querySnapshot = await getDocs(collection(db, "Projetos"));
      const list: Projeto[] = [];

      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          ...doc.data(),
        } as Projeto);
      });

      setProjetos(list);
    }

    loadProjects();
  }, []);

  return (
    <div className="flex flex-col items-start w-full min-h-screen pr-4 gap-4">
      <p className="font-medium text-xl">Meus projetos</p>

      <div className="flex bg-[#F6F6F6] text-[#8C8C8C] items-center gap-1 py-2 px-4 rounded-full w-full">
        <IoSearchSharp />
        <input type="text" placeholder="Pesquisar" className="bg-transparent outline-none w-full" />
      </div>

      <div
        className="
            grid 
            grid-cols-2        
            lg:grid-cols-3     
            xl:grid-cols-4  
            2xl:grid-cols-5
            gap-2
            w-full
        "
        >
        {projetos.map((proj) => (
        <Link href={`/all-projects/${proj.id}`} key={proj.id} className="w-full">
        <div className="cursor-pointer transition-all">
            <TemplateCard
            nome={proj.nome}
            curso={proj.curso}
            semestre={proj.semestre}
            descricao={proj.descricao}
            professores={proj.professores}
            />
        </div>
        </Link>
    ))}
      </div>
      <div className="h-1"></div>
    </div>
  );
}
