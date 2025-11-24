import Image from "next/image"
import caixa from "@/public/caixa.png"
import bg from "@/public/bg-groind.png"
import { GoArrowUpRight } from "react-icons/go"

interface Prof{
    nome:string
}

export default function NullProjects({nome}:Prof){


    return(
        <div className="w-full h-6/12 bg-[#C288B3] flex relative rounded-4xl items-center gap-4">
           <div> <Image src={caixa} alt={"caixa"} width={1920} height={1080} className="w-12/12 h-auto"/>
            
            </div><div className="text-white flex flex-col gap-4 items-start">
                <p className="text-xl">Olá, professor(a) {nome}</p>
                <p className="text-4xl">Você <span className="text-[#3B3B3B] italic">não tem projetos </span><br /> em <span className="text-[#E6C2D1]">andamento!</span></p>
                <button className="flex items-center gap-2 text-white bg-[#3B3B3B] rounded-4xl px-4 py-1">Cadastre um projeto  <GoArrowUpRight size={20} /></button>
            </div>

            <Image src={bg} alt={"bg"} width={1920} height={1080} className="flex absolute h-full"/>
        </div>
    )
}