import { MdOutlineDiversity3 } from "react-icons/md";
import { MdLocalLibrary } from "react-icons/md";
import { MdScreenShare } from "react-icons/md";
import Calendar from "./calendar";

interface StatisticsProps {
  totalProjetos: number;
  totalTurmas: number;
  totalAlunos: number;
}

export default function Statistics({
  totalProjetos,
  totalTurmas,
  totalAlunos,
}: StatisticsProps) {
  return (
    <div className="w-full h-full flex">
      <div className="w-full">
        <p className="text-3xl pb-6">Estatísticas</p>
        <div className="flex gap-3 md:gap-8">
          <div className="flex flex-col items-center bg-[#FCF3FA] rounded-4xl shadow-md w-5/12 md:w-3/15 p-8">
            <MdOutlineDiversity3 size={57} className="text-[#C288B3]" />
            <p className="text-center text-2xl">
              {totalTurmas} <br />
              Turmas
            </p>
            <p className="text-[#C288B3] text-center">Em <br  className="md:hidden flex"/> andamento</p>
          </div>
<div className="flex flex-col md:flex-row gap-3 md:gap-8 w-full">
          <div className="flex flex-col items-center bg-[#F6F2FF] rounded-4xl shadow-md md:w-3/12 p-8">
            <MdLocalLibrary size={57} className="text-[#A694C9]" />
            <p className="text-center text-sm md:text-2xl">
              {totalAlunos} <br className="md:flex hidden"/>
              Alunos
            </p>
            <p className="text-[#A694C9]">Ativos</p>
          </div>

          <div className="flex gap-8 justify-center items-center bg-[#FFF1E4] rounded-4xl shadow-md w-12/12 md:w-5/14 p-8">
            <MdScreenShare size={57} className="text-[#FFBD83]" />
            <div className="">
              <p className="text-center text-sm md:text-2xl">
                {totalProjetos} <br className="md:flex hidden"/>
                Projetos
              </p>
              <p className="text-[#FFBD83] text-xs md:text-xl ">Em andamento</p>
            </div>
          </div>
          </div>
        </div>
      </div>

      <div className="md:flex hidden">
        <Calendar />
      </div>
    </div>
  );
}
