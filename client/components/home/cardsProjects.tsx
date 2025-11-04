export default function CardsPorjects() {
  const projetos = [
    {
      id: 6,
      titulo: "Projeto integrador 6",
      curso: "Engenharia de software",
      descricao:
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical",
      professores: 3,
      botao: "Ver mais",
    },
    {
      id: 2,
      titulo: "Projeto integrador 2",
      curso: "Engenharia de software",
      descricao:
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical",
      professores: 3,
      botao: "Ver mais",
    },
    {
      id: 4,
      titulo: "Projeto integrador 4",
      curso: "Sistemas de informação",
      descricao:
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical",
      professores: 3,
      botao: "Ver mais",
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="flex gap-8 w-full h-full">
        {projetos.map((content, index) => (
          <div
            key={index}
            className="bg-[#F6F6F6] rounded-4xl h-80 p-8 w-90 flex flex-col justify-between"
          >
            <div className="flex flex-col">
              <p className="text-4xl font-semibold mb-2">0{content.id}</p>
              <p className="text-[#90416B] text-xl">{content.titulo}</p>

              <p className="italic text-[#3B3B3B] mb-2 font-semibold">
                {content.curso}
              </p>
              <p className="text-sm w-full">{content.descricao}</p>
            </div>

            <div className="flex items-center w-full justify-between">
              <p>Professores</p>
              <button className="bg-[#3B3B3B] text-white px-4 rounded-full py-1">
                Ver mais
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
