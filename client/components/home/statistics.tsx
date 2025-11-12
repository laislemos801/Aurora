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
        <div className="flex gap-8">
          <div className="flex flex-col items-center bg-[#FCF3FA] rounded-4xl shadow-md w-3/15 p-8">
            <MdOutlineDiversity3 size={57} className="text-[#C288B3]" />
            <p className="text-center text-2xl">
              {totalTurmas} <br />
              Turmas
            </p>
            <p className="text-[#C288B3]">Em andamento</p>
          </div>

          <div className="flex flex-col items-center bg-[#F6F2FF] rounded-4xl shadow-md w-3/12 p-8">
            <MdLocalLibrary size={57} className="text-[#A694C9]" />
            <p className="text-center text-2xl">
              {totalAlunos} <br />
              Alunos
            </p>
            <p className="text-[#A694C9]">Ativos</p>
          </div>

          <div className="flex gap-8 justify-center items-center bg-[#FFF1E4] rounded-4xl shadow-md w-5/14 p-8">
            <MdScreenShare size={57} className="text-[#FFBD83]" />
            <div>
              <p className="text-center text-2xl">
                {totalProjetos} <br />
                Projetos
              </p>
              <p className="text-[#FFBD83]">Em andamento</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Calendar />
      </div>
    </div>
  );
}
