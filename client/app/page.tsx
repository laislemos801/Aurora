"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import AllProjects from "@/components/home/allProjects";
import CardsPorjects from "@/components/home/cardsProjects";
import Statistics from "@/components/home/statistics";
import { IoSearchSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import NullProjects from "@/components/home/nullProjects";

interface Projeto {
  id: string;
  nome: string;
  curso: string;
  semestre: number;
  descricao: string;
  professores: string[];
}

export default function Home() {
  const { user, loading } = useAuthGuard();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loadingPage, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [estatisticas, setEstatisticas] = useState({
    totalProjetos: 0,
    totalTurmas: 0,
    totalAlunos: 0,
  });

  useEffect(() => {
    const fetchProjetos = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const projetosRef = collection(db, "Projetos");
        const q = query(projetosRef, where("professores", "array-contains", user.uid));
        const querySnapshot = await getDocs(q);

        const projetosList: Projeto[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Projeto[];

        setProjetos(projetosList);

        // Contadores
        let totalTurmas = 0;
        let totalAlunos = 0;

        for (const projetoDoc of querySnapshot.docs) {
          const turmasRef = collection(db, "Projetos", projetoDoc.id, "Turmas");
          const turmasSnapshot = await getDocs(turmasRef);

          totalTurmas += turmasSnapshot.size;

          for (const turmaDoc of turmasSnapshot.docs) {
            const turmaData = turmaDoc.data();
            if (Array.isArray(turmaData.alunos)) {
              totalAlunos += turmaData.alunos.length;
            }
          }
        }

        setEstatisticas({
          totalProjetos: projetosList.length,
          totalTurmas,
          totalAlunos,
        });
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!loading && user) fetchProjetos();
  }, [user, loading]);

  if (loadingPage) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Carregando dados...
      </div>
    );
  }

  if (!user) return null;

  const projetosFiltrados = projetos.filter((projeto) =>
    projeto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full overflow-auto md:overflow-hidden  px-1 md:px-8">
      <div className=" w-full justify-between px-8 mb-4 hidden md:flex">
        <p className="text-3xl">Meus projetos</p>
        <div className="flex bg-[#F6F6F6] text-[#8C8C8C] items-center gap-2 py-3 px-4 rounded-full w-3/12">
          <IoSearchSharp />
          <input
            type="text"
            placeholder="Pesquisar"
            className="bg-transparent outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {estatisticas.totalProjetos ? <div className="w-full h-3/12 md:h-6/12 flex relative justify-end bg-[#C288B3] md:bg-transparent rounded-4xl">
        <div className="flex absolute left-0 md:top-[25%] md:w-4/12">
          <AllProjects quantidade={estatisticas.totalProjetos}/>
        </div>
        <div className="md:w-[97%] h-full bg-[#C288B3] rounded-4xl flex">
          <div className="h-full w-4/12 realtive" />
          <div
            className="h-full md:w-300 flex items-center pl-8 overflow-y-auto px-8"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="hidden md:flex">
              <CardsPorjects projetos={projetosFiltrados} />
            </div>
          </div>
        </div>
      </div>:
      <NullProjects nome={user.name}/>}
        <div className=" w-full justify-between pt-6 px-2 mb-4 flex flex-col md:hidden">
        <p className="text-3xl">Meus projetos</p>
        <div className="flex bg-[#F6F6F6] text-[#8C8C8C] items-center gap-2 py-3 px-4 rounded-full md:w-3/12">
          <IoSearchSharp />
          <input
            type="text"
            placeholder="Pesquisar"
            className="bg-transparent outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>
       <div className="flex md:hidden">
              <CardsPorjects projetos={projetosFiltrados} />
            </div>

      <div className="w-full h-6/12 pt-6 md:p-8">
        <Statistics
          totalProjetos={estatisticas.totalProjetos}
          totalTurmas={estatisticas.totalTurmas}
          totalAlunos={estatisticas.totalAlunos}
        />
      </div>
    </div>
  );
}
