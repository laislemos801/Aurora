"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import aurora from "@/public/AURORA.png";
import { MdOutlineCircleNotifications } from "react-icons/md";
import avatar from "@/public/avatar.png";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IoMdClose } from "react-icons/io"; 
import { GoPlus } from "react-icons/go";


export default function ToolBarTop() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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
        <div className="flex items-center w-auto gap-8">
          {/* Botão Novo Projeto */}
          <button
            onClick={() => setIsOpen(true)}
            className="text-white bg-[#7B6294] rounded-md p-2 px-7 hover:bg-[#6a5583] transition"
          >
            Novo projeto
          </button>

          {/* Ícone de notificação */}
          <button>
            <MdOutlineCircleNotifications
              size={37}
              className="text-[#C288B3] mr-8"
            />
          </button>

          {/* Avatar e nome */}
          <div className="flex items-center gap-3">
            <Image
              src={avatar}
              alt="avatar"
              width={1920}
              height={1080}
              className="w-5/12"
            />
            <p className="w-full font-medium text-gray-700">Prof. Silva</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-[#F6F6F6] rounded-2xl shadow-xl p-6 sm:p-6 w-96 md:w-full max-w-lg sm:max-w-2xl animate-fadeIn relative">
            
            {/* Botão de fechar */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-[#3B3B3B] rounded-full p-2 hover:bg-gray-200 transition cursor-pointer"
            >
              <IoMdClose size={24} />
            </button>

            {/* Título */}
            <h2 className="text-xl sm:text-2xl font-normal mb-6 text-start text-[#C288B3]">
              Novo Projeto
            </h2>

            {/* Campos */}

            <div className="flex flex-col sm:gap-2">
            {/* Div nome, semestre e ano */}
              <div className="flex flex-row p-2 gap-4"> 
                <div className="flex flex-col w-2/5 sm:3/5">
                  <label className="text-[#353535] text-sm md:text-lg font-medium mb-1">Nome</label>
                  <Input
                    type="text"
                    placeholder="Nome"
                    className="border-[#C288B3] text-sm sm:text-sm md:text-lg lg:text-lg pt-6 pb-6 border-2 text-[#A1A1A1]"
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <label className="text-[#353535] text-sm md:text-lg font-medium mb-1">Semestre</label>
                  <Input
                    type="text"
                    placeholder="Semestre"
                    className="border-[#C288B3] text-sm sm:text-sm md:text-lg lg:text-lg pt-6 pb-6 border-2 text-[#A1A1A1]"
                  />
                </div>

                <div className="flex flex-col w-1/4">
                  <label className="text-[#353535] text-sm md:text-lg font-medium mb-1">Ano</label>
                  <Input
                    type="text"
                    placeholder="Ano"
                    className="border-[#C288B3] text-sm  sm:text-sm md:text-lg lg:text-lg pt-6 pb-6 border-2 text-[#A1A1A1]"
                  />
                </div>
              </div> {/* Div fechamento nome, semestre e ano */}

              <div className="flex flex-row w-full p-2 gap-4 justify-start items-end"> 
                <div className="flex flex-col w-full sm:w-full">

                  <label className="text-[#353535] font-medium mb-1 text-sm md:text-lg ">Descrição</label>
                  <div className="flex flex-row w-full sm:w-full gap-6">
                    <Textarea
                      placeholder="Descrição"
                      className="border-[#C288B3] border-2 text-sm sm:text-sm md:text-lg lg:text-lg text-[#A1A1A1] pb-6"
                      rows={4} // altura do textarea
                    />
                    {/* Botão de adicionar */}
                    <div className=" flex flex-col justify-start w-60 sm:w-full">
                      <button className="bg-[#C288B3] text-sm sm:text-sm md:text-lg lg:text-lg text-[#FCF3FA] font-medium p-2 w-full rounded-md hover:bg-[#90416B] transition flex items-center justify-start gap-2">
                        <GoPlus  size={20} />
                        Adicionar turma
                      </button>
                    </div>
                  </div>
                </div>

                
              </div>

              <div className="flex flex-col p-2">
                <label className="text-[#353535] font-medium mb-1 text-sm md:text-lg">Professor</label>
                <div className="flex flex-row gap-6 w-full sm:w-full">
                  <select
                    className="border-2 rounded-lg p-2 pt-4 pb-4 sm:w-5/5 w-64 text-sm sm:text-sm lg:text-lg border-[#C288B3] focus:outline-[#C288B3] text-[#A1A1A1]"
                    defaultValue="">
                    <option value="" disabled>
                      Selecione o professor
                    </option>
                    <option value="silva">Prof. Silva</option>
                    <option value="almeida">Prof. Almeida</option>
                    <option value="sousa">Prof. Sousa</option>
                  </select>

                  {/* Botão salvar */}
                
                  <div className="w-full flex justify-end items-end mt-6">
                    <button className="bg-[#C288B3] text-[#FCF3FA] font-semibold px-8 py-2 sm:px-16 sm:py-2 text-center rounded-lg hover:bg-[#90416B] transition">
                      Salvar
                    </button>
                  </div>
                </div>

              </div>
            </div>


            
          </div>
        </div>
      )}
    </>
  );
}
