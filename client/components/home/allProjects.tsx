import Image from "next/image";
import allProject from "@/public/woman-projects.png";
import { GoArrowUpRight } from "react-icons/go";
import { useRouter } from "next/navigation";

interface AllProjectsProps {
  quantidade: number;
}

export default function AllProjects({quantidade}:AllProjectsProps) {

  const router = useRouter()

  return (
    <div className="w-full h-full flex items-center md:gap-3">
      <Image
        src={allProject}
        alt={""}
        width={1920}
        height={1080}
        className="w-7/12 md:w-6/16"
      />
      <div className="flex w-full flex-col md:gap-3 items-start ">
        <p className="text-white">Olá, professora Silvia!</p>
        <p className="text-2xl md:text-4xl text-white">
          Você tem{" "}
          <span className="text-[#3B3B3B] font-semibold italic">
            {quantidade} projetos{" "}
          </span>
          <br className="md:flex hidden"/> em <span className="text-[#E6C2D1]">andamento!</span>
        </p>
        <button onClick={()=>router.push("/all-projects")} className="text-white bg-[#3B3B3B] py-1 px-5 rounded-full flex items-center gap-2 text-sm md:text-xl mt-3 cursor-pointer">
          Ver todos
          <GoArrowUpRight size={30} />
        </button>
      </div>
    </div>
  );
}
