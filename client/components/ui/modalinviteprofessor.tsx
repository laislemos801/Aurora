"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { IoMdClose } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { toast } from "react-hot-toast";

interface Professor {
  nome: string;
  email: string;
  uid: string;
  profilePicture?: string;
}

interface ModalInviteProfessorProps {
  isInviteOpen: boolean;
  setIsInviteOpen: (value: boolean) => void;
  professores: Professor[];
  setProfessores: (value: Professor[]) => void;
  projetoUid?: string;
   onProfessorAdicionado: () => void;
}

export default function ModalInviteProfessor({
  isInviteOpen,
  setIsInviteOpen,
  professores,
  setProfessores,
}: ModalInviteProfessorProps) {
  const [emailProfessor, setEmailProfessor] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleAdicionarProfessor = async () => {
    if (!emailProfessor) return toast.error("Digite o email!");

    if (professores.some((p) => p.email === emailProfessor)) {
      return toast.error("Professor já adicionado!");
    }

    const q = query(
      collection(db, "Professores"),
      where("email", "==", emailProfessor)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return toast.error("Professor não encontrado!");

    const docData = querySnapshot.docs[0];
    const data = docData.data();

    const novoProfessor: Professor = {
      uid: docData.id,
      nome: data.nome,
      email: data.email,
      profilePicture: data.profilePicture || "", 
    };

    setProfessores([...professores, novoProfessor]);
    setEmailProfessor("");
    toast.success("Professor adicionado com sucesso!");
  };

  const handleRemoverProfessor = (index: number) => {
    const novos = [...professores];
    novos.splice(index, 1);
    setProfessores(novos);
  };

  return (
    <>
      {isInviteOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl p-4 w-98 md:w-full max-w-lg animate-fadeIn relative">
            <button
              onClick={() => setIsInviteOpen(false)}
              className="absolute top-2 right-4 text-[#3B3B3B] rounded-full p-2 hover:bg-gray-200 transition cursor-pointer"
            >
              <IoMdClose size={24} />
            </button>

            <h2 className="text-2xl font-normal mb-2 mt-4 text-[#C288B3] text-center">
              Convide outros docentes
            </h2>
            <p className="text-sm pr-4 pl-4 font-normal mb-4 mt-2 text-[#8F8F8F] text-center">
              Eles poderão visualizar, editar e compartilhar informações nos seus cards!
            </p>

            {/* Input + botão */}
            <div className="relative pt-2 pb-2 w-full">
              <Input
                type="email"
                placeholder="Adicione pessoas via e-mail!"
                value={emailProfessor}
                onChange={(e) => setEmailProfessor(e.target.value)}
                className="border-[#C288B3] border-2 rounded-xl text-[#A1A1A1] w-full h-full p-4 text-sm md:text-base"
              />

              <button
                onClick={handleAdicionarProfessor}
                disabled={carregando}
                className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer bg-[#C288B3] text-[#FCF3FA] font-medium text-sm px-3 py-2 mr-2 rounded-lg hover:bg-[#90416B] transition"
              >
                {carregando ? "Adicionando..." : "Convide"}
              </button>
            </div>

            {/* Lista de professores */}
            {professores.length > 0 && (
              <div className="flex flex-col max-h-full w-full mt-4 divide-y divide-gray-200">
                {professores.map((p, i) => {
                  const nomeSimples = p.nome || p.email.split("@")[0];
                  return (
                    <div
                      key={i}
                      className="w-full flex items-center justify-between p-3 gap-3"
                    >
                      <div className="flex items-center gap-3 w-full">
                        
                        {p.profilePicture ? (
                          <Image
                            src={p.profilePicture}
                            alt={p.nome || "Professor"}
                            width={35}
                            height={35}
                            className="rounded-full object-cover border border-[#C288B3]"
                          />
                        ) : (
                          <FaUserCircle size={35} className="text-[#C288B3]" />
                        )}

                        <div className="flex flex-col min-w-0">
                          <p className="text-[#333333] font-medium text-sm truncate">
                            {nomeSimples}
                          </p>
                          <p className="text-[#333333] text-xs truncate">
                            {p.email}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoverProfessor(i)}
                        className="text-[#B65254] hover:bg-[#E6C2D1] cursor-pointer rounded-full p-2 transition"
                      >
                        <IoTrashOutline size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
