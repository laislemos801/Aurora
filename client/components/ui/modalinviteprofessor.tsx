"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { IoMdClose } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { adicionarProfessorAoProjeto } from "@/firebase/addProject";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { toast } from "react-hot-toast";

interface Professor {
  nome: string;
  email: string;
  uid: string; 
}

interface ModalInviteProfessorProps {
  isInviteOpen: boolean;
  setIsInviteOpen: (value: boolean) => void;
  professores: Professor[];
  setProfessores: (value: Professor[]) => void;
  projetoUid?: string;
}

export default function ModalInviteProfessor({
  isInviteOpen,
  setIsInviteOpen,
  professores,
  setProfessores
}: ModalInviteProfessorProps) {
  
    const [emailProfessor, setEmailProfessor] = useState("");
    const [carregando, setCarregando] = useState(false);

   
  
    const handleAdicionarProfessor = async () => {
      if (!emailProfessor) return toast.error("Digite o email!");

      // Evita duplicata
      if (professores.some(p => p.email === emailProfessor)) {
        return toast.error("Professor já adicionado!");
      }

      const q = query(collection(db, "Professores"), where("email", "==", emailProfessor));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return toast.error("Professor não encontrado!");

      const docData = querySnapshot.docs[0];
      const novoProfessor: Professor = {
        uid: docData.id,
        nome: docData.data().nome,
        email: docData.data().email,
      };

      setProfessores([...professores, novoProfessor]); // guarda no estado do modal principal
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
          <div className="bg-white rounded-2xl shadow-xl p-4 w-98 md:w-full max-w-lg sm:max-w-lg animate-fadeIn relative">
            <button
              onClick={() => setIsInviteOpen(false)}
              className="absolute top-2 right-4 text-[#3B3B3B] rounded-full p-2 hover:bg-gray-200 transition cursor-pointer">
              <IoMdClose size={24} />
            </button>

            <h2 className="text-2xl font-normal mb-2 mt-4 text-[#C288B3] text-center">
              Convide outros docentes
            </h2>
            <p className="text-sm sm:text-sm pr-2 pl-2 sm:pr-2 sm:pl-2 md:pr-4 md:pl-4 font-normal mb-4 mt-2 text-[#8F8F8F] text-center">
              Eles poderão visualizar, editar e compartilhar informações nos seus cards!
            </p>

            <div className="relative pt-2 pb-2 w-full ">
              <Input
                type="email"
                placeholder="Adicione pessoas via e-mail!"
                value={emailProfessor}
                onChange={(e) => setEmailProfessor(e.target.value)}
                className="border-[#C288B3] border-2 rounded-xl sm:rounded-2xl text-[#A1A1A1] w-full h-full p-4 sm:pt-4 sm:pb-4 text-xs sm:text-md md:text-base"
              />

              <button
                onClick={handleAdicionarProfessor}
                disabled={carregando}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#C288B3] text-[#FCF3FA] font-medium text-sm sm:text-sm px-2 py-2 sm:px-2 md:px-4 lg:px-6 mr-2 rounded-lg hover:bg-[#90416B] transition flex items-center gap-2">
                 {carregando ? "Adicionando..." : "Convide"}  
              </button>
            </div>

            {/* Lista de professores adicionados */}
            {professores.length > 0 && (
            <div className="flex flex-col max-h-full w-full mt-4 divide-y divide-gray-200">
              {professores.map((p, i) => {
                const nomeSimples = p.email.split("@")[0];

                return (
                  <div key={i} className="w-full flex items-start sm:items-center justify-between p-2 gap-2"
                  >
                    {/* Avatar + Info */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <FaUserCircle size={30} className="text-[#C288B3]" />
                      <div className="flex flex-col min-w-0">
                        <p className="text-[#333333] font-medium text-xs sm:text-sm md:text-base truncate">
                          {nomeSimples}
                        </p>
                        <p className="text-[#333333] text-xs sm:text-xs md:text-sm truncate">
                          {p.email}
                        </p>
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex items-center justify-end sm:gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      

                      <button
                        onClick={() => handleRemoverProfessor(i)}
                        className="flex-shrink-0 text-[#90416B] hover:bg-[#C288B3] rounded-full p-2 transition"
                      >
                        <IoTrashOutline className="text-[14px] sm:text-[16px] md:text-[18px] text-[#D82042]" />
                      </button>
                    </div>
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
