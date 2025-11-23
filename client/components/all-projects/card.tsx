"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import Avatar from "../../public/account_circle.png";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ModalInviteProfessor from "../ui/modalInviteProfAllProjects";

interface TemplateCardProps {
  nome: string;
  semestre: number;
  curso: string;
  descricao: string;
  professores: string[];
  projetoUid?: string; 
}

interface ProfessorData {
  profilePicture?: string;
  nome: string;
  email?: string;
  uid?: string;
}

export default function TemplateCard({
  nome,
  curso,
  semestre,
  descricao,
  professores,
  projetoUid,
}: TemplateCardProps) {
  const router = useRouter();
  const semestreFormatado = String(semestre).padStart(2, "0");

  const [professoresData, setProfessoresData] = useState<ProfessorData[]>([]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [professoresModal, setProfessoresModal] = useState<ProfessorData[]>([]);

  useEffect(() => {
    async function carregarProfessores() {
      try {
        const promises = professores.map(async (profUid) => {
          const profRef = doc(db, "Professores", profUid);
          const profSnap = await getDoc(profRef);

          if (profSnap.exists()) {
            const data = profSnap.data();
            return {
              uid: profSnap.id,
              profilePicture: data.profilePicture,
              nome: data.nome,
              email: data.email,
            };
          }

          return { nome: "Sem nome" };
        });

        const result = await Promise.all(promises);
        setProfessoresData(result);
      } catch (err) {
        console.error("Erro ao carregar professores:", err);
        toast.error("Erro ao carregar professores do projeto");
      }
    }

    carregarProfessores();
  }, [professores]);

  const getProfileImage = (path?: string) => {
    if (!path || path === "") return Avatar;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return path;
    return Avatar;
  };

  const handleVerMais = () => {
    if (!projetoUid) return;
    router.push(`/projects-info/${projetoUid}`);
  };

  return (
    <>
      <div className="bg-[#F6F6F6] rounded-xl p-3 w-full flex flex-col h-52 transition text-left md:h-54 xl:p-4 xl:h-56 2xl:h-58">

        <p className="text-3xl font-medium">PI {semestreFormatado}</p>

        <p className="text-[12px] font-medium text-[#90416B] md:text-[13px] 2xl:text-[14px]">{nome}</p>
        <p className="text-[10px] italic text-[#3B3B3B] font-medium md:text-[11px]">{curso}</p>

        <div className="flex-1 mt-3 2xl:mt-4">
          <p className="text-[8px] line-clamp-3 text-[#333] font-medium italic sm:text-[9px] xl:text-[11px]">
            {descricao}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium italic text-[#1E1E1E]">Professores</p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex -space-x-2">
              {professoresData.slice(0, 8).map((prof, i) => (
                <div key={i} title={prof.nome} className={i >= 2 ? "hidden sm:block" : ""}>
                  <Image
                    src={getProfileImage(prof.profilePicture)}
                    alt={prof.nome}
                    width={24}
                    height={24}
                    className="rounded-full object-cover w-6 h-6 shadow-sm"
                  />
                </div>
              ))}

              <button
                onClick={() => setIsInviteOpen(true)}
                className="w-6 h-6 flex items-center justify-center cursor-pointer rounded-full bg-[#C288B3] text-md shadow-sm hover:scale-105 transition"
              >
                +
              </button>
            </div>

            <button
              onClick={handleVerMais}
              className="px-3 py-1 bg-[#7B6294] hover:bg-[#674984] cursor-pointer text-white text-[10px] italic rounded-full hover:opacity-90 transition md:px-4"
            >
              Ver mais
            </button>
          </div>
        </div>

      </div>

      <ModalInviteProfessor
        isInviteOpen={isInviteOpen}
        setIsInviteOpen={setIsInviteOpen}
        professores={professoresModal as any}
        setProfessores={setProfessoresModal as any}
        projetoUid={projetoUid ?? ""}
        onProfessorAdicionado={() => {
          if (projetoUid) {
            getDoc(doc(db, "Projetos", projetoUid)).then((snap) => {
              if (snap.exists()) {
                const data = snap.data();
                if (data.professores) {
                  const profUids = data.professores;
                  const promises = profUids.map(async (uid: string) => {
                    const profSnap = await getDoc(doc(db, "Professores", uid));
                    return profSnap.exists()
                      ? { uid: profSnap.id, ...profSnap.data() }
                      : { uid, nome: "Desconhecido" };
                  });
                  Promise.all(promises).then(setProfessoresData);
                }
              }
            });
          }
        }}
      />
    </>
  );
}
