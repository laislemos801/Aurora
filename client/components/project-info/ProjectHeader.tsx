import Image from "next/image";
import backArrow from "@/public/group-back-button.svg";

interface Props {
  nome: string;
  semestre?: number;
  ano?: number;
  onBack?: () => void;
}

export function ProjectHeader({ nome, semestre, ano, onBack }: Props) {
  return (
    <div className="flex flex-col self-start">
      <div className="flex items-center">
        <button className="flex-shrink-0" onClick={onBack}>
          <Image src={backArrow} alt="Voltar" width={32} height={32} />
        </button>

        <p className="ml-2 text-lg font-medium text-[#3B3B3B]">
          {nome}
        </p>
      </div>

      {semestre && ano && (
        <p className="ml-10 text-[12px] font-medium text-[#3B3B3B]">
          {semestre}° semestre - {ano}
        </p>
      )}
    </div>
  );
}
