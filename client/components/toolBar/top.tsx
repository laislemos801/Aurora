"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import aurora from "@/public/AURORA.svg";
import widget from "@/public/widgets.svg";
import { MdOutlineCircleNotifications } from "react-icons/md";
import { MdExitToApp } from "react-icons/md";
import ModalAddProject from "../ui/modaladdproject";
import { PiHouseBold } from "react-icons/pi";
import { FaRegNoteSticky } from "react-icons/fa6";
import icon from "@/public/for_you.svg";
import 'primeicons/primeicons.css';
import { usePathname, useRouter } from "next/navigation";
import { doc} from "firebase/firestore";
import { auth, db  } from "@/firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";

interface Aluno {
  nome: string;
  ra: number;
}

interface Turma {
  nome: string;
  alunos: Aluno[];
}

export default function ToolBarTop() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [turmas, setTurmas] = useState<Turma[]>([]);

  const [userData, setUserData] = useState<{ nome: string; profilePicture: string }>({
    nome: "",
    profilePicture: "",
  });

  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { path: "/", icon: <PiHouseBold size={23} /> },
    { path: "/projects-info", icon: <FaRegNoteSticky size={20} /> },
    {
      path: "/edit-profile",
      icon: <Image src={icon} alt="icone" width={26} height={26} />,
    },
  ];

    // Montagem do componente
  useEffect(() => {
    setMounted(true);

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const userRef = doc(db, "Professores", user.uid);

      // Escuta mudanças em tempo real
      const unsubscribeSnapshot = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data()
          setUserData({
            nome: data.nome || "Professor",
            profilePicture: data.profilePicture || "",
          });
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
      <div className="bg-[#FCF3FA] w-full h-14 flex items-center justify-between pr-3 mt-3 relative xl:h-20">
        {/* Grupo esquerdo: widget + aurora */}
        <div className="flex items-center gap-5 ml-3 xl:mt-3">
          {/* Widget mobile */}
          <button className="sm:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Image src={widget} alt="widget" width={28} height={28} />
          </button>

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
          <button
            onClick={() => setIsOpen(true)}
            className="text-white bg-[#7B6294] rounded-md p-1.5 h-7 hover:bg-[#6a5583] transition flex items-center justify-center"
          >
            <span className="hidden sm:inline text-sm p-4 xl:px-5">Novo projeto</span>
            <span className="sm:hidden text-3xl font-light">+</span>
          </button>

          <button>
            <MdOutlineCircleNotifications
              size={34}
              className="text-[#C288B3]"
            />
          </button>

          <div className="hidden sm:block w-[1.5px] h-9 bg-[#C288B3] mx-2 opacity-70 xl:w-[2px]" />

          <div
            className="hidden sm:flex items-center gap-3 pr-3 xl:pr-6 cursor-pointer rounded-full hover:bg-[#f0cde693]"
            onClick={() => router.push("/edit-profile")}>
            <div className="relative w-7 h-7 sm:w-7 sm:h-7 md:w-10 md:h-10 rounded-full overflow-hidden">
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

            <p className="font-medium text-[#90416B] text-lg sm:text-xl xl:text-xl">
              {userData.nome || "Carregando..."}
            </p>
          </div>
        </div>
      </div>

      {/* Modal Add Project */}
      <ModalAddProject
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isAddClassOpen={isAddClassOpen}
        setIsAddClassOpen={setIsAddClassOpen}
        turmas={turmas}
        setTurmas={setTurmas}
      />

      {/* Sidebar mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex bg-[rgba(128,128,128,0.4)] sm:hidden"
        onClick={() => setIsSidebarOpen(false)}>
          <div className="bg-[#FCF3FA] w-18 h-full p-4 flex flex-col justify-start items-center shadow-lg">
            {/* Botão fechar */}
            <button
              className="mb-30 text-[#90416B] hover:text-[#7B6294] transition text-xl mt-2"
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="pi pi-chevron-circle-left"></i>
            </button>

            {/* Ícones mobile */}
            <div className="flex flex-col items-center mt-4 gap-6">
              {navItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-center w-10 h-10 cursor-pointer transition
                    ${pathname === item.path ? "bg-[#90416B] text-white rounded-full" : "bg-transparent text-[#C288B3] rounded-full"}`}
                  onClick={() => {
                    router.push(item.path);
                    setIsSidebarOpen(false);
                  }}
                >
                  <span className="text-xl">{item.icon}</span>
                </div>
              ))}
            </div>

            <button
              className="mt-auto text-[#C288B3] hover:text-[#90416B] transition text-2xl"
              onClick={() => {
                // logica logout
                setIsSidebarOpen(false);
              }}
            >
              <MdExitToApp size={25} />
            </button>

          </div>
        </div>
      )}
    </>
  );
}
