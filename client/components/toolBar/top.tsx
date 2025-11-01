"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import aurora from "@/public/AURORA.svg";
import avatar from "@/public/avatar.png";
import widget from "@/public/widgets.svg";
import { MdOutlineCircleNotifications } from "react-icons/md";
import ModalAddProject from "../ui/modaladdproject"; // import do novo componente

interface Turma {
  nome: string;
  arquivo?: File | null;
}

export default function ToolBarTop() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [turmas, setTurmas] = useState<Turma[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
  <>
    {/* Toolbar */}
    <div className="bg-[#FCF3FA] w-full h-14 flex items-center justify-between pr-3 mt-3 relative xl:h-16">
      {/* Grupo esquerdo: widget + aurora */}
      <div className="flex items-center gap-5 ml-3 xl:mt-3">
        <Image
          src={widget}
          alt="widget"
          width={28}
          height={28}
          className="sm:hidden"
        />
        <Image
          src={aurora}
          alt="aurora"
          width={1920}
          height={1080}
          className="w-28 sm:w-20 xl:ml-4 xl:w-23 2xl:w-25"
        />
      </div>

        {/* Botões e usuário */}
        <div className="flex items-center w-auto gap-3 sm:gap-5 xl:mt-3 xl:gap-8">
          {/* Botão Novo Projeto */}
          <button
            onClick={() => setIsOpen(true)}
            className="text-white bg-[#7B6294] rounded-md p-1.5 h-7 hover:bg-[#6a5583] transition flex items-center justify-center
            "
            >
            {/* Texto só aparece em sm e maiores */}
            <span className="hidden sm:inline text-sm p-4 xl:px-5">Novo projeto</span>
            {/* + aparece sempre */}
            <span className="sm:hidden text-3xl font-light">+</span>
          </button>

          <button>
            <MdOutlineCircleNotifications
              size={34}
              className="text-[#C288B3]"
            />
          </button>

          <div className="hidden sm:block w-[1.5px] h-9 bg-[#C288B3] mx-2 opacity-70 xl:w-[2px]" />

          <div className="hidden sm:flex items-center gap-3 pr-3 xl:pr-6">
            <Image
              src={avatar}
              alt="avatar"
              width={28}
              height={28}
              className="rounded-full"
            />
            <p className="font-medium text-[#90416B] text-sm">Prof. Silvia</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalAddProject
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isAddClassOpen={isAddClassOpen}
        setIsAddClassOpen={setIsAddClassOpen}
        turmas={turmas}
        setTurmas={setTurmas}
      />
    </>
  );
}
