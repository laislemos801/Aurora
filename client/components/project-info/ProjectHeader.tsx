import Image from "next/image";
import backArrow from "@/public/group-back-button.svg";
import Avatar from "../../public/account_circle.png";

interface ProfessorData { 
  profilePicture?: string; 
  nome: string; 
  email?: string; 
  uid?: string; 
}

interface Props {
  nome: string;
  semestre?: number;
  ano?: number;
  professores?: ProfessorData[];
  onBack?: () => void;
}

export function ProjectHeader({ nome, semestre, ano, professores = [], onBack }: Props) {
  const getProfileImage = (path?: string) => {
    if (!path || path === "") return Avatar;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return path;
    return Avatar;
  };

  return (
    <div className="flex flex-col self-start w-full">
      <div className="flex items-center w-full">
        <button className="flex-shrink-0" onClick={onBack}>
          <Image src={backArrow} alt="Voltar" width={32} height={32} />
        </button>

        <p className="ml-2 text-lg font-medium text-[#3B3B3B] flex-1">
          {nome}
        </p>

        <div className="flex -space-x-2 pr-4 bg-[#FCF3FA] rounded-l-[15px] rounded-r-none">
          {professores.slice(0, 8).map((prof, i) => (
            <div key={i} title={prof.nome} className={i >= 3 ? "hidden sm:block" : ""}>
              <Image
                src={getProfileImage(prof.profilePicture)}
                alt={prof.nome}
                width={100}
                height={100}
                className="rounded-full object-cover w-7 h-7 shadow-sm sm:w-8 sm:h-8 md:w-9 md:h-9"
              />
            </div>
          ))}
        </div>
      </div>

      {semestre && ano && (
        <p className="ml-10 mt-[-4px] text-[12px] font-medium text-[#3B3B3B]">
          {semestre}° semestre - {ano}
        </p>
      )}
    </div>
  );
}
