"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import aurora from "@/public/AURORA.svg";
import { MdOutlineCircleNotifications } from "react-icons/md";
import { MdExitToApp } from "react-icons/md";
import ModalAddProject from "../ui/modaladdproject";
import { PiHouseBold } from "react-icons/pi";
import { FaRegNoteSticky } from "react-icons/fa6";
import "primeicons/primeicons.css";
import { usePathname, useRouter } from "next/navigation";
import {
  doc,
  updateDoc,
  onSnapshot,
  arrayRemove,
} from "firebase/firestore";
import { auth, db } from "@/firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";
import { Turma } from "@/types/turma";
import { GoPlus } from "react-icons/go";
import { MdOutlineNotes } from "react-icons/md";
import { MdOutlineAccountCircle } from "react-icons/md";

export default function ToolBarTop() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [commentNotiCount, setCommentNotiCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showNotiMenu, setShowNotiMenu] = useState(false);
  const [notiList, setNotiList] = useState<any[]>([]);

  const [userData, setUserData] = useState<{
    nome: string;
    profilePicture: string;
  }>({
    nome: "",
    profilePicture: "",
  });

  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { path: "/", icon: <PiHouseBold size={23} /> },
    { path: "/all-projects", icon: <FaRegNoteSticky size={20} /> },
    {
      path: "/edit-profile",
      icon: <MdOutlineAccountCircle size={22} />,
    },
  ];

  async function removerNotificacao(id: string) {
    if (!currentUser) return;

    const userRef = doc(db, "Professores", currentUser.uid);

    const noti = notiList.find((n) => n.id === id);
    if (!noti) return;

    await updateDoc(userRef, {
      "notificacoes.lista": arrayRemove(noti),
    });
  }

  useEffect(() => {
    setMounted(true);

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCurrentUser(null);
        return;
      }

      setCurrentUser(user);
      const userRef = doc(db, "Professores", user.uid);

      const unsubscribeSnapshot = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();

          setUserData({
            nome: data.nome || "Professor",
            profilePicture: data.profilePicture || "",
          });

          setCommentNotiCount(data.notificacoes?.comentarios || 0);
          setNotiList(data.notificacoes?.lista || []);
        }
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Toolbar */}
      <div className="bg-[#FCF3FA] w-full h-14 flex items-center justify-between pr-3 mt-2 relative xl:h-20">
        <div className="flex items-center gap-5 ml-1 sm:ml-3 xl:mt-2">
          <button
            className="sm:hidden cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MdOutlineNotes size={28} className="text-[#C288B3]" />
          </button>

          <Image
            src={aurora}
            alt="aurora"
            width={1920}
            height={1080}
            className="w-24 xl:ml-4 xl:w-28 mt-2"
          />
        </div>

        {/* Botões */}
        <div className="flex items-center w-auto gap-3 sm:mr-4 sm:gap-5 xl:mt-3 xl:gap-8">
          <button
            onClick={() => setIsOpen(true)}
            className="text-white bg-[#90416B] cursor-pointer rounded-md p-1.5 h-8 hover:bg-[#782F56] transition flex items-center justify-center"
          >
            <GoPlus size={24} color="#FFFFFF" className="sm:inline" />
            <span className="inline sm:hidden text-[12px] p-1 xl:px-5">
              Projeto
            </span>
            <span className="hidden sm:inline text-sm sm:text-md xl:text-[16px] p-2 xl:px-5">
              Novo projeto
            </span>
          </button>

          <div className="flex items-center gap-3">
            {/* NOTIFICAÇÕES */}
            <button className="relative">
              <MdOutlineCircleNotifications
                size={40}
                onClick={async () => {
                  setShowNotiMenu(!showNotiMenu);
                  if (!currentUser) return;

                  await updateDoc(doc(db, "Professores", currentUser.uid), {
                    "notificacoes.comentarios": 0,
                  });
                }}
                className="text-[#C288B3] relative w-8 h-8 sm:w-7 sm:h-7 md:w-10 md:h-10"
              />

              {commentNotiCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2 py-[1px] text-[10px]">
                  {commentNotiCount}
                </span>
              )}
            </button>

            {/* MENU DROPDOWN DE NOTIFICAÇÕES */}
            {showNotiMenu && (
              <div className="absolute right-14 top-16 bg-white shadow-xl p-3 rounded-lg w-80 z-50">
                <h3 className="font-semibold text-[#90416B] mb-2">
                  Notificações
                </h3>

                {notiList.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Nenhuma notificação nova.
                  </p>
                )}

                {notiList.map((noti) => (
                  <div
                    key={noti.id}
                    className="border-b py-2 text-sm flex flex-col"
                  >
                    <b>{noti.autor}</b> adicionou um comentário em {noti.grupoNome}
                    <p>{noti.turmaNome} — {noti.projetoNome}</p>

                    <div className="flex gap-3 mt-2">
                      <button
                        className="text-[#90416B] underline text-xs"
                        onClick={() =>
                          router.push(
                            `/group-info?page=group-info&projectId=${noti.projetoId}&turmaId=${noti.turmaId}&grupoId=${noti.grupoId}`
                          )
                        }
                      >
                        Acessar
                      </button>

                      <button
                        className="text-red-500 underline text-xs"
                        onClick={() => removerNotificacao(noti.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}

              </div>
            )}

            {/* PERFIL */}
            <div
              className="flex items-center gap-2 cursor-pointer rounded-full hover:bg-[#f0cde693]"
              onClick={() => router.push("/edit-profile")}
            >
              <div className="relative w-8 h-8 sm:w-7 sm:h-7 md:w-10 md:h-10 rounded-full overflow-hidden">
                {userData.profilePicture ? (
                  <Image
                    src={userData.profilePicture}
                    alt={userData.nome || "Perfil"}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full rounded-full"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full border-4 border-t-[#7B6294] border-gray-300 rounded-full animate-spin"></div>
                )}
              </div>

              <p className="hidden sm:block font-medium text-[#90416B] text-lg sm:text-xl xl:text-xl">
                {userData.nome || "Carregando..."}
              </p>
            </div>
          </div>
        </div>
      </div>

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
