"use client";

const ICONS = {
  widgets: "/icons/widgets.svg",
  bell: "/icons/bell.svg",
  user: "/icons/user.svg",
  group: "/icons/group-323.svg",
  search: "/icons/search.svg",
  logo: "/logo_original.png",
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

export default function PageDesktop() {
  return (
    <div className="min-h-screen w-full flex bg-[var(--background)]">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 bottom-0 w-[80px] bg-[#F8F3FB] flex flex-col items-center justify-between py-8">
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
          <img src={ICONS.logo} alt="Aurora" className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col items-center gap-8 justify-center flex-1">
          <img src="/icons/home.svg" alt="Home" className="w-6 h-6 opacity-70 hover:opacity-100 transition" />
          <img src="/icons/ellipse.svg" alt="Ellipse" className="w-6 h-6 opacity-70 hover:opacity-100 transition" />
          <img src="/icons/for-you.svg" alt="For you" className="w-6 h-6 opacity-70 hover:opacity-100 transition" />
        </div>

        <div>
          <img src="/icons/back.svg" alt="Voltar" className="w-6 h-6 opacity-70 hover:opacity-100 transition" />
        </div>
      </aside>

      {/* CONTEÚDO */}
      <div className="flex-1 md:ml-[80px]">
        {/* HEADER */}
        <header className="px-6 pt-6 flex justify-between items-center max-w-[1220px] mx-auto">
          <div className="flex items-center gap-2">
            <img src={ICONS.widgets} alt="Widgets" className="w-6 h-6" />
            <span className="text-[20px] font-semibold text-[#6B217E]">AURORA</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              className="text-white px-5 py-2 rounded-full font-medium"
              style={{ background: "linear-gradient(90deg, #6B217E, #9B4ACB)" }}
            >
              Novo projeto
            </button>
            <img src={ICONS.bell} alt="Notificações" className="w-5 h-5 opacity-80" />
            <div className="flex items-center gap-2">
              <img src={ICONS.user} alt="Usuário" className="w-7 h-7 rounded-full" />
              <span className="text-sm font-medium text-[#383838]">Prof. Sílvia</span>
            </div>
          </div>
        </header>

        {/* PAINEL */}
        <main className="px-4 sm:px-6 py-6">
          <div className="mx-auto max-w-[1220px] rounded-[28px] bg-[var(--card)] ring-1 ring-black/5 p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[22px] font-semibold text-[#383838]">Todos os projetos</h2>
              <div className="relative w-80">
                <img src={ICONS.search} alt="Buscar" className="absolute left-3 top-3 w-4 h-4 opacity-60" />
                <input
                  placeholder="Search"
                  className="w-full rounded-full bg-white/70 ring-1 ring-black/10 py-2.5 pl-10 pr-4 placeholder:text-slate-400 focus:outline-none focus:ring-2"
                />
              </div>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projetos.map((p) => (
                <article key={p.id} className="p-5 rounded-[20px] bg-white ring-1 ring-gray-200 shadow-sm">
                  <div className="text-2xl font-extrabold text-[#383838]">{p.id}</div>
                  <div className="mt-1 font-semibold text-[#6B217E]">{p.nome}</div>
                  <div className="text-sm italic text-[#383838]">{p.curso}</div>
                  <p className="text-xs mt-3 text-[#383838]">
                    Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
                    classical literature.
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <span className="block text-sm font-semibold text-[#383838] mb-1">Professores</span>
                      <img src={ICONS.group} alt="Professores" className="h-8 w-auto" />
                    </div>
                    <button className="bg-[#1E1E1E] text-white px-4 py-1.5 rounded-full text-sm font-medium">
                      Ver mais
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}