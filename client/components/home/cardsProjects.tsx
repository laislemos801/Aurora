"use client";

import { useEffect, useState } from "react";
import ModalInviteProfessor from "../ui/modalinviteprofessor";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Avatar from "../../public/account_circle.png";
import { useRouter } from "next/navigation";

interface Projeto {
  id: string;
  nome: string;
  curso: string;
  semestre: number;
  descricao: string;
  professores: string[];
}

interface Professor {
  nome: string;
  email: string;
  uid: string; 
}

interface ProfessorData {
  uid?: string;
  nome: string;
  email?: string;
  profilePicture?: string;
}

interface CardsProjectsProps {
  projetos: Projeto[];
}

export default function CardsPorjects({ projetos }: CardsProjectsProps) {
  const router = useRouter();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [projetoUid, setProjetoUid] = useState<string | null>(null);
  const [professoresModal, setProfessoresModal] = useState<Professor[]>([]);
  const [professoresData, setProfessoresData] = useState<Record<string, ProfessorData[]>>({});

  useEffect(() => {
    async function carregarProfessores() {
      try {
        const resultado: Record<string, ProfessorData[]> = {};

        for (const projeto of projetos) {
          const promises = projeto.professores.map(async (profUid) => {
            const profRef = doc(db, "Professores", profUid);
            const profSnap = await getDoc(profRef);
            if (profSnap.exists()) {
              const data = profSnap.data();
              return {
                uid: profSnap.id,
                nome: data.nome,
                email: data.email,
                profilePicture: data.profilePicture,
              };
            }
            return { nome: "Sem nome" };
          });

          resultado[projeto.id] = await Promise.all(promises);
        }

        setProfessoresData(resultado);
      } catch (err) {
        console.error("Erro ao carregar professores:", err);
        toast.error("Erro ao carregar professores dos projetos");
      }
    }

    if (projetos.length > 0) carregarProfessores();
  }, [projetos]);

  const getProfileImage = (path?: string) => {
    if (!path || path === "") return Avatar;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return path;
    return Avatar;
  };

  return (
    <div className="w-auto h-full">
      <div className="flex gap-8 w-auto h-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-8 w-max">
          {projetos.map((content, index) => {
            const profs = professoresData[content.id] || [];

            return (
              <div
                key={index}
             className="bg-[#F6F6F6] rounded-4xl h-80 p-8 w-90 flex flex-col justify-between "
              >
                <div className="flex flex-col">
                  <p className="text-4xl font-semibold mb-2">0{content.semestre}</p>
                  <p className="text-[#90416B] text-xl">{content.nome}</p>
                  <p className="italic text-[#3B3B3B] mb-2 font-semibold">{content.curso}</p>
                  <p className="text-sm w-full">{content.descricao}</p>
                </div>

                <div className="flex items-end w-full justify-between">
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-sm font-medium">Professores</p>
                    <div className="flex -space-x-2">
                      {profs.slice(0, 3).map((prof, i) => (
                        <Image
                          key={i}
                          src={getProfileImage(prof.profilePicture)}
                          alt={prof.nome}
                          width={28}
                          height={28}
                          className="rounded-full object-cover w-7 h-7 shadow-sm"
                        />
                      ))}
                      <button
                        onClick={() => {
                          setProjetoUid(content.id);
                          setIsInviteOpen(true);
                        }}
                        className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full bg-[#C288B3] text-md shadow-sm hover:scale-105 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/projects-info/${content.id}`)}
                    className="bg-[#7B6294] hover:bg-[#674984] text-white px-4 rounded-full py-1 text-sm cursor-pointer"
                  >
                    Ver mais
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {projetoUid && (
        <ModalInviteProfessor
          isInviteOpen={isInviteOpen}
          setIsInviteOpen={setIsInviteOpen}
          professores={professoresModal}
          setProfessores={setProfessoresModal}
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
                    Promise.all(promises).then((list) =>
                      setProfessoresData((prev) => ({
                        ...prev,
                        [projetoUid]: list,
                      }))
                    );
                  }
                }
              });
            }
          }}
        />
      )}
    </div>
  );
}
