"use client";

import Image from "next/image";
import { PiHouseBold } from "react-icons/pi";
import { FaRegNoteSticky } from "react-icons/fa6";
import icon from "@/public/for_you.svg";
import logo from "@/public/logo aurora em svg.svg";
import { MdExitToApp } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";

export default function ToolBarLeft() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="bg-[#FCF3FA] w-full flex flex-col justify-between items-center py-6 h-full overflow-hidden">
      {/* LOGO CENTRALIZADO */}
      <div className="hidden sm:flex justify-center items-center w-full mb-2">
        <Image
          src={logo}
          alt="Logo Aurora"
          width={40}
          height={40}
          className="w-12 sm:w-12 md:w-12 lg:w-12 xl:mt-4 xl:w-14"
        />
      </div>

      {/* ÍCONES */}
      <div className="hidden sm:flex flex-col gap-12 items-center text-[#C288B3]">
        <div
          className={`${
            pathname === "/" && "bg-[#90416B] text-white p-1.5 rounded-full 2xl:p-2"
          } cursor-pointer`}
          onClick={() => router.push("/")}
        >
          <PiHouseBold size={23} />
        </div>

        <div
          className={`${
            pathname === "/projects-info" &&
            "bg-[#90416B] text-white p-1.5 rounded-full 2xl:p-2"
          } cursor-pointer`}
          onClick={() => router.push("/projects-info")}
        >
          <FaRegNoteSticky size={22} />
        </div>

        <div
          className={`${
            pathname === "/edit-profile" &&
            "bg-[#90416B] text-white p-1.5 rounded-full 2xl:p-2"
          } cursor-pointer`}
          onClick={() => router.push("/edit-profile")}
        >
          <Image
            src={icon}
            alt="icone"
            width={1920}
            height={1080}
            className="w-[26px]"
          />
        </div>
      </div>

       {/* BOTÃO SAIR */}
      <button
        onClick={() => router.push("/login")}
        className="hidden sm:block rotate-180 cursor-pointer text-[#C288B3] hover:text-white p-1.5 rounded-full hover:bg-[#90416B] transition-colors duration-200">
        <MdExitToApp size={30} />
      </button>
    </div>
  );
}
