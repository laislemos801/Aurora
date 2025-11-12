import Image from "next/image";
import Plus from "@/public/plus.svg";

interface Props {
  turmas: { id: string; nome: string }[];
  turmaSelecionada: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export function TurmasSelector({ turmas, turmaSelecionada, onSelect, onAdd }: Props) {
  return (
    <div className="flex overflow-x-auto gap-2 pl-2 pb-1 scrollbar-hide md:pl-4">
      
      {/* BOTÃO ADICIONAR PRIMEIRO */}
      <button
        onClick={onAdd}
        className="flex gap-2 pr-3 pl-3 py-1.5 rounded-md bg-[#3B3B3B] text-[#FCF3FA] text-[12px] font-medium hover:opacity-80 transition shrink-0"
      >
        <Image src={Plus} alt="Adicionar" width={12} height={12} />
        Adicionar
      </button>

      {/* LISTA DE TURMAS */}
      {turmas.map((turma) => (
        <button
          key={turma.id}
          onClick={() => onSelect(turma.id)}
          className={`
            px-4 py-1.5 rounded-md text-[12px] font-medium transition shrink-0 cursor-pointer
            ${turmaSelecionada === turma.id
              ? "bg-[#7B6294] text-[#EDECEC]"
              : "bg-[#3B3B3B] text-[#EDECEC] hover:opacity-80"}
          `}
        >
          {turma.nome}
        </button>
      ))}
    </div>
  );
}
