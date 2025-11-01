"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import aurora from "@/public/AURORA.png";
import avatar from "@/public/avatar.png";
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
      <div className="bg-[#FCF3FA] w-full h-full flex items-center justify-between pr-8 relative">
        {/* Logo */}
        <div>
          <Image
            src={aurora}
            alt="aurora"
            width={1920}
            height={1080}
            className="w-12/12 mt-6"
          />
        </div>

        {/* Botões e usuário */}
        <div className="flex items-center w-auto gap-6">
          <button
            onClick={() => setIsOpen(true)}
            className="text-white bg-[#7B6294] rounded-md p-2 px-7 hover:bg-[#6a5583] transition"
          >
            Novo projeto
          </button>

          <button>
            <MdOutlineCircleNotifications
              size={37}
              className="text-[#C288B3] mr-4"
            />
          </button>

          <div className="w-[2px] h-8 bg-[#C288B3] mx-2 opacity-70" />

          <div className="flex items-center gap-3">
            <Image
              src={avatar}
              alt="avatar"
              width={1920}
              height={1080}
              className="w-5/12"
            />
            <p className="w-full font-medium text-[#90416B]">Prof. Silva</p>
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
