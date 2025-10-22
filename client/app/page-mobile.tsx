"use client";

const ICONS = {
  widgets: "/icons/widgets.svg",
  plus: "/icons/plus.svg",
  bell: "/icons/bell.svg",
  group: "/icons/group-323.svg",
  search: "/icons/search.svg",
};

const projetos = [
  { id: "01", nome: "Projeto integrador 1", curso: "Engenharia de Software" },
  { id: "02", nome: "Projeto integrador 2", curso: "Engenharia de Software" },
  { id: "03", nome: "Projeto integrador 3", curso: "Sistemas de Informação" },
  { id: "04", nome: "Projeto integrador 4", curso: "Sistemas de Informação" },
  { id: "05", nome: "Projeto integrador 5", curso: "Cibersegurança" },
  { id: "06", nome: "Projeto integrador 6", curso: "Engenharia de Software" },
  { id: "07", nome: "Projeto integrador 7", curso: "Jogos Digitais" },
  { id: "08", nome: "Projeto integrador 8", curso: "Análise e Desenvolvimento" },
  { id: "09", nome: "Projeto integrador 9", curso: "Jogos Digitais" },
  { id: "10", nome: "Projeto integrador 10", curso: "Sistemas de Informação" },
  { id: "11", nome: "Projeto integrador 11", curso: "Engenharia de Software" },
  { id: "12", nome: "Projeto integrador 12", curso: "Cibersegurança" },
];

export default function PageMobile() {
  return (
    <div className="min-h-screen w-full bg-[#F8F3FB] px-4 pt-6 pb-10">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <img src={ICONS.widgets} alt="logo" className="w-6 h-6" />
          <span className="text-[22px] font-semibold text-[#6B217E]">AURORA</span>
        </div>
        <div className="flex gap-2">
          <div className="w-9 h-9 bg-[#7B3AED] rounded-[10px] flex items-center justify-center">
            <img src={ICONS.plus} alt="novo" className="w-4 h-4" />
          </div>
          <div className="w-9 h-9 bg-[#EAE3F7] rounded-[10px] flex items-center justify-center">
            <img src={ICONS.bell} alt="notificações" className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="rounded-[28px] bg-white ring-1 ring-black/5 p-5">
        <h2 className="text-[22px] font-semibold text-[#383838] mb-4">Meus projetos</h2>

        <div className="relative mb-6">
          <img src={ICONS.search} alt="Buscar" className="absolute left-3 top-3 w-4 h-4 opacity-60" />
          <input
            placeholder="Search"
            className="w-full rounded-full bg-white/70 ring-1 ring-black/10 py-2.5 pl-10 pr-4 placeholder:text-slate-400 focus:outline-none focus:ring-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {projetos.map((p) => (
            <article key={p.id} className="p-4 rounded-[20px] bg-[#FAF9FB] ring-1 ring-gray-200">
              <div className="text-2xl font-extrabold text-[#383838]">{p.id}</div>
              <div className="mt-1 font-semibold text-[#6B217E]">{p.nome}</div>
              <div className="text-sm italic text-[#383838]">{p.curso}</div>
              <p className="text-xs mt-2 text-[#383838]">
                Contrary to popular belief, Lorem Ipsum is not simply random text.
              </p>
              <div className="mt-4">
                <span className="block text-sm font-semibold text-[#383838] mb-1">Professores</span>
                <img src={ICONS.group} alt="Professores" className="h-8 w-auto" />
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}