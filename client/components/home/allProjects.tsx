import Image from "next/image";
import allProject from "@/public/woman-projects.png";
import { GoArrowUpRight } from "react-icons/go";

export default function AllProjects() {
  return (
    <div className="w-full h-full flex items-center gap-3">
      <Image
        src={allProject}
        alt={""}
        width={1920}
        height={1080}
        className="w-2/16"
      />
      <div className="flex flex-col gap-3 items-start">
        <p className="text-white">Olá, professora Silvia!</p>
        <p className="text-4xl text-white">
          Você tem{" "}
          <span className="text-[#3B3B3B] font-semibold italic">
            10 projetos{" "}
          </span>
          <br /> em <span className="text-[#E6C2D1]">andamento!</span>
        </p>
        <button className="text-white bg-[#3B3B3B] py-1 px-5 rounded-full flex items-center gap-2 text-xl mt-3">
          Ver todos
          <GoArrowUpRight size={30} />
        </button>
      </div>
    </div>
  );
}
