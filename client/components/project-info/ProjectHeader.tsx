

import Image from "next/image";
import backArrow from "@/public/group-back-button.svg";
import Avatar from "../../public/account_circle.png";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useState } from "react";
import ModalInviteProfessor from "../ui/modalinviteprofessor";

interface ProfessorData { 
  profilePicture?: string; 
  nome: string; 
  email: string; 
  uid?: string; 
}

interface Props {
  nome: string;
  curso?: string;
  semestre?: number;
  ano?: number;
  professores?: ProfessorData[];
  onBack?: () => void;
  onDelete?: () => void;
  projetoUid?: string;
  setProfessores?: (value: ProfessorData[]) => void;
}

export function ProjectHeader({ nome, curso, semestre, ano, professores = [], onBack, onDelete,  projetoUid,
  setProfessores, }: Props) {

  const [showModal, setShowModal] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
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

        <p className="ml-2 text-sm sm:text-lg font-medium text-[#3B3B3B] flex-1">
          {nome} - {curso}
        </p>
        

        {/* Botão excluir */}
        <div className="flex gap-2 pr-4 pl-3 py-1.5 justify-start sm:mt-0">
          <button
            onClick={() => setShowModal(true)}
            className="
              flex items-center gap-1 sm:gap-2
              bg-[#B65254] hover:bg-[#863435] text-white
              px-2 py-1.5 sm:px-2 sm:py-2
              text-xs sm:text-sm
              rounded-lg cursor-pointer transition
            "
          >
            <RiDeleteBin6Line size={12} className="sm:size-4" />
            
            <span className="">Excluir projeto</span>
          </button>
        </div>


        {/* === BOTÃO PROFESSORES === */}
        <button
          onClick={() => setIsInviteOpen(true)}
          className="cursor-pointer flex -space-x-2 pr-4 bg-[#FCF3FA] rounded-l-[15px] rounded-r-none hover:bg-[#f7e4f1] transition"
          title="Gerenciar professores"
        >
          {professores.slice(0, 8).map((prof, i) => (
            <div key={i} className={i >= 3 ? "hidden sm:block" : ""}>
              <Image
                src={getProfileImage(prof.profilePicture)}
                alt={prof.nome}
                width={100}
                height={100}
                className="rounded-full object-cover w-7 h-7 shadow-sm sm:w-8 sm:h-8 md:w-9 md:h-9"
              />
            </div>
          ))}
        </button>
      </div>

      {semestre && ano && (
        <p className="ml-10 mt-[-4px] text-[12px] font-medium text-[#3B3B3B]">
          {semestre}° semestre - {ano}
        </p>
      )}

       {/* Modal de confirmação */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white flex flex-col items-center justify-center rounded-2xl p-6 w-80 sm:w-full max-w-md shadow-lg text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Excluir projeto?
            </h2>
            <p className="text-sm text-center text-gray-600 mb-6">
              Tem certeza que deseja excluir este projeto e todos os dados associados?
            </p>
            <p className="text-sm font-semibold text-center text-[#B65254] mb-6" >
              Essa ação não poderá ser desfeita.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  onDelete?.(); 
                }}
                className="px-4 py-2 rounded-lg bg-[#B65254] hover:bg-[#863435] text-white transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
      {setProfessores && (
        <ModalInviteProfessor
          isInviteOpen={isInviteOpen}
          setIsInviteOpen={setIsInviteOpen}
          professores={professores}
          setProfessores={setProfessores}
          projetoUid={projetoUid}
        />
      )}
    </div>
  );
}
