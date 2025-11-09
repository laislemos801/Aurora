"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import TemplateCard from "@/components/all-projects/card";
import { IoSearchSharp } from "react-icons/io5";
import { useAuthGuard } from "@/hooks/useAuthGuard";

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
  const [loadingpage, setLoading] = useState(true);

  const { user, loading } = useAuthGuard();


  useEffect(() => {
      const fetchProjetos = async () => {
        if (!user) return;

        setLoading(true);
        try {
          const projetosRef = collection(db, "Projetos");
          const q = query(projetosRef, where("professores", "array-contains", user.uid));
          const querySnapshot = await getDocs(q);

          const list: Projeto[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Projeto[];

          setProjetos(list);
        } catch (error) {
          console.error("Erro ao buscar projetos:", error);
        } finally {
          setLoading(false);
        }
      };

      if (!loading && user) fetchProjetos();
    }, [user, loading]);

   if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#F4EAF4]">
          <p className="text-[#7A4C77] text-lg">Carregando informações...</p>
        </div>
      );
    }

  if (loadingpage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[#7A4C77] text-lg">Carregando projetos...</p>
      </div>
    );
  }

  return (
  <div
    className="
      flex flex-col items-start 
      w-full 
      min-h-0 
      flex-1
      pr-4 gap-4 
      sm:pl-4 sm:pt-4 md:pr-8 
      overflow-y-auto
    "
  >
    {/* Topo */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:w-full lg:mb-4 flex-shrink-0">
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

    {/* Grid de projetos */}
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
        flex-1
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

    {/* Pequeno espaçamento final */}
    <div className="h-2 flex-shrink-0"></div>
  </div>
);

}
