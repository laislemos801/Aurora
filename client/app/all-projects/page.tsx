"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import TemplateCard from "@/components/all-projects/card";
import { IoSearchSharp } from "react-icons/io5";

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
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.warn("Nenhum usuário logado encontrado.");
        setProjetos([]);
        setLoading(false);
        return;
      }

      console.log("Usuário logado:", user.uid);

      try {
        const projetosRef = collection(db, "Projetos");
        const q = query(projetosRef, where("professores", "array-contains", user.uid));
        const querySnapshot = await getDocs(q);

        const list: Projeto[] = [];
        querySnapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            ...doc.data(),
          } as Projeto);
        });

        setProjetos(list);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Carregando projetos...</p>;
  }

  return (
    <div className="flex flex-col items-start w-full min-h-screen pr-4 gap-4 sm:pl-4 sm:pt-4 md:pr-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:w-full lg:mb-4">
        <p className="font-medium text-xl mb-3 sm:mb-0">Meus projetos</p>

        <div className="flex bg-[#F6F6F6] text-[#8C8C8C] items-center gap-2 py-1.5 px-4 rounded-full text-[13px] w-60 md:w-80 2xl:w-100">
          <IoSearchSharp />
          <input
            type="text"
            placeholder="Pesquisar"
            className="bg-transparent outline-none w-full"
          />
        </div>
      </div>

      <div
        className="
          grid 
          grid-cols-2        
          md:grid-cols-3     
          lg:grid-cols-4  
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-x-2
          gap-y-2
          sm:gap-x-3
          sm:gap-y-4
          sm:gap-y-6
          w-full
        "
      >
        {projetos.length > 0 ? (
          projetos.map((proj) => (
            <div key={proj.id} className="w-full">
              <TemplateCard
                nome={proj.nome}
                curso={proj.curso}
                semestre={proj.semestre}
                descricao={proj.descricao}
                professores={proj.professores}
                projetoUid={proj.id}
              />
            </div>
          ))
        ) : (
          <p>Você ainda não criou ou foi convidado para nenhum projeto.</p>
        )}
      </div>

      <div className="h-1"></div>
    </div>
  );
}
