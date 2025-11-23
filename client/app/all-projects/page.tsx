"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
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
  ano?: number;
}

export default function AllProjectsCards() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loadingpage, setLoading] = useState(true);

  const { user, loading } = useAuthGuard();

  // -------------------------------
  // ESTADOS DOS FILTROS
  // -------------------------------
  const [pesquisa, setPesquisa] = useState("");
  const [filtroCurso, setFiltroCurso] = useState("Todos");
  const [filtroSemestre, setFiltroSemestre] = useState("Todos");
  const [filtroAno, setFiltroAno] = useState("Todos");

  // Lista de cursos completos
  const cursos = [
    "Administração",
    "Administração – Comércio Exterior",
    "Administração – Finanças Corporativas e Mercado de Capitais",
    "Administração – Marketing e Inovação",
    "Arquitetura e Urbanismo",
    "Ciências Contábeis",
    "Ciências Econômicas",
    "Ciências Sociais (Bacharelado)",
    "Ciências Sociais (Licenciatura)",
    "Direito",
    "Educação Física (Bacharelado)",
    "Educação Física (Licenciatura)",
    "Engenharia Ambiental e Sanitária",
    "Engenharia Civil",
    "Engenharia de Computação",
    "Engenharia de Controle e Automação",
    "Engenharia de Produção",
    "Engenharia de Software",
    "Engenharia Elétrica",
    "Engenharia Mecânica",
    "Engenharia Química",
    "Engenharia Biomédica",
    "Matemática",
    "Química",
    "Sistemas de Informação",
    "Gestão da Tecnologia da Informação",
    "Jogos Digitais",
    "Ciência de Dados e Inteligência Artificial",
    "Geografia (Bacharelado)",
    "Geografia (Licenciatura)",
    "Ciência da Informação",
    "Comunicação",
    "Jornalismo",
    "Relações Públicas",
    "Publicidade e Propaganda",
    "Letras: Português/Inglês (Bacharelado)",
    "Letras: Português/Inglês (Licenciatura)",
    "Filosofia (Bacharelado)",
    "Filosofia (Licenciatura)",
    "Serviço Social",
    "Turismo"
  ];


  // Semestres 1 → 12
  const semestres = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  useEffect(() => {
    if (!user) return;

    const projetosRef = collection(db, "Projetos");
    const q = query(projetosRef, where("professores", "array-contains", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Projeto[];

      setProjetos(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // -------------------------------
  // APLICAÇÃO DOS FILTROS + PESQUISA
  // -------------------------------

  const projetosFiltrados = useMemo(() => {
    return projetos
      .filter((p) =>
        p.nome.toLowerCase().includes(pesquisa.toLowerCase())
      )
      .filter((p) =>
        filtroCurso === "Todos" ? true : p.curso === filtroCurso
      )
      .filter((p) =>
        filtroSemestre === "Todos" ? true : p.semestre === Number(filtroSemestre)
      )
      .filter((p) =>
        filtroAno === "Todos" ? true : p.ano === Number(filtroAno)
      );
  }, [projetos, pesquisa, filtroCurso, filtroSemestre, filtroAno]);

  if (loading || loadingpage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4EAF4]">
        <p className="text-[#7A4C77] text-lg">Carregando informações...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start w-full min-h-0 flex-1 pr-4 gap-4 sm:pl-4 sm:pt-4 md:pr-8 overflow-y-auto">
      
      {/* TOPO */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:w-full lg:mb-4 flex-shrink-0 gap-3">
        <p className="font-medium text-xl">Meus projetos</p>

        {/* PESQUISA */}
        <div className="flex bg-[#F6F6F6] text-[#8C8C8C] items-center gap-2 py-1.5 px-4 rounded-full text-[13px] w-60 md:w-80">
          <IoSearchSharp />
          <input
            type="text"
            placeholder="Pesquisar projeto"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="bg-transparent outline-none w-full"
          />
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex flex-wrap gap-3 mb-2 w-full">

        {/* Filtro Curso */}
        <select
          value={filtroCurso}
          onChange={(e) => setFiltroCurso(e.target.value)}
          className="px-3 py-1 text-sm bg-[#F6F6F6] rounded-md border border-gray-300"
        >
          <option value="Todos">Todos os cursos</option>

          {[...new Set(projetos.map((p) => p.curso))].map(
            (curso) =>
              curso && (
                <option key={curso} value={curso}>
                  {curso}
                </option>
              )
          )}
        </select>


        {/* Filtro Semestre */}
        <select
          value={filtroSemestre}
          onChange={(e) => setFiltroSemestre(e.target.value)}
          className="px-3 py-1 text-sm bg-[#F6F6F6] rounded-md border border-gray-300"
        >
          <option value="Todos">Todos os semestres</option>

          {[...new Set(projetos.map((p) => p.semestre))].map(
            (sem) =>
              sem && (
                <option key={sem} value={sem}>
                  {sem}º semestre
                </option>
              )
          )}
        </select>

        {/* Filtro Ano */}
        <select
          value={filtroAno}
          onChange={(e) => setFiltroAno(e.target.value)}
          className="px-3 py-1 text-sm bg-[#F6F6F6] rounded-md border border-gray-300"
        >
          <option value="Todos">Todos os anos</option>
          {/* Gera anos com base nos projetos */}
          {[...new Set(projetos.map((p) => p.ano))].map(
            (ano) =>
              ano && (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              )
          )}
        </select>
      </div>

      {/* GRID DE PROJETOS */}
      <div
        className="
          grid 
          grid-cols-2        
          md:grid-cols-3     
          lg:grid-cols-4  
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-x-2 gap-y-4 sm:gap-x-3 sm:gap-y-6
          w-full
        "
      >
        {projetosFiltrados.length > 0 ? (
          projetosFiltrados.map((proj) => (
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
          <p className="text-sm">Nenhum projeto encontrado com os filtros selecionados.</p>
        )}
      </div>

      <div className="h-1"></div>
    </div>
  );
}
