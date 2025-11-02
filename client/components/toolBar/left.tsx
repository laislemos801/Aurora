"use client";

import Image from "next/image";
import { PiHouseBold } from "react-icons/pi";
import { FaRegNoteSticky } from "react-icons/fa6";
import icon from "@/public/for_you.svg";
import logo from "@/public/logo.png";
import { MdExitToApp } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function ToolBarLeft() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#FCF3FA] w-full min-h-screen flex flex-col justify-between items-center pb-8">
      
      <div className="hidden sm:block sm:w-23 -mt-1 xl:w-26">
        <Image src={logo} alt={"logo"} width={1920} height={1080} />
      </div>
 
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
            alt={"icone"}
            width={1920}
            height={1080}
            className="w-[26px]"
          />
        </div>
      </div>

      <button className="hidden sm:block rotate-180">
        <MdExitToApp size={25} className="text-[#C288B3]" />
      </button>
    </div>
  );
}
