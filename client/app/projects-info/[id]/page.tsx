'use client';

import Image from 'next/image';
import { Lexend_Exa } from 'next/font/google';
import { Button } from '@/components/ui/button';

const lexend = Lexend_Exa({ subsets: ['latin'], weight: '400' });

export default function ProjectInfoPage() {
  const user = { name: 'Prof. Sílvia', avatar: '/avatar.png' };
  const semester = '2º semestre - 2025';
  const students = [
    'Adriana Lopes',
    'Afonso Martins',
    'Alessandra Ribeiro',
    'Amanda Nogueira',
    'Beatriz Moura',
    'Bernardo Farias',
  ];
  const groups = [
    'Grupo 01 - Tema',
    'Grupo 02 - Tema',
    'Grupo 03 - Tema',
    'Grupo 04 - Tema',
    'Grupo 05 - Tema',
  ];

  return (
    <div className="relative min-h-screen bg-[#F4EAF4] overflow-x-hidden flex">
      {/* ==================== SIDEBAR ==================== */}
      <aside
        className="
          hidden md:flex fixed left-0 top-0 min-h-screen w-[80px]
          flex-col items-center justify-between border-r border-[#E6DCE8]/60
          bg-[#F4EAF4] z-20 py-5
        "
      >
        {/* Logo no topo da toolbar */}
        <div className="relative w-[64px] h-[64px] rounded-full overflow-hidden -mt-[12px]">
          <Image
            src="/logo_original.png"
            alt="Aurora"
            fill
            className="object-contain object-center scale-[1.5]"
            priority
          />
        </div>

        {/* Ícones do meio */}
        <div className="flex flex-col items-center gap-6 mt-5">
          {/* Home */}
          <button className="h-[42px] w-[42px] rounded-full bg-[#7A4C77] flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#FFFFFF" className="w-[20px] h-[20px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4.5l9 5.25v9.75a.75.75 0 01-.75.75H3.75A.75.75 0 013 19.5V9.75z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
            </svg>
          </button>

          {/* Documentos */}
          <button className="p-2 hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#B085AA" className="w-[26px] h-[26px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7.5L21 8.5V21a1 1 0 01-1 1H7a1 1 0 01-1-1V3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 3v6h6" />
            </svg>
          </button>

          {/* Usuário */}
          <button className="p-2 hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#B085AA" className="w-[26px] h-[26px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0 2c-3.33 0-6 1.34-6 3v3h12v-3c0-1.66-2.67-3-6-3z" />
            </svg>
          </button>
        </div>

        {/* Logout */}
        <button aria-label="Sair" className="p-2 rounded-full hover:scale-110 transition-transform mb-2" title="Sair">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               strokeWidth={2} stroke="#7A4C77" className="w-[26px] h-[26px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
        </button>
      </aside>

      {/* ==================== CONTEÚDO PRINCIPAL ==================== */}
      <div className="flex-1 md:ml-[80px] flex flex-col">
        {/* HEADER */}
        <header className="bg-[#F4EAF4] px-8 flex items-center justify-between h-[82px]">
          <span className={`${lexend.className} text-[#7A4C77] tracking-[0.25em] text-[26px] leading-none`}>
            AURORA
          </span>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Button className="rounded-[10px] bg-[#7F6694] hover:bg-[#6F5A84] text-white text-[16px] px-6 h-[42px]">
                Novo projeto
              </Button>
              <button className="h-[42px] w-[42px] rounded-full border border-[#D8C3DB] bg-[#F9F4FA] flex items-center justify-center hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     strokeWidth={2} stroke="#7A4C77" className="w-[20px] h-[20px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-4.995M13 21a2 2 0 01-4 0" />
                </svg>
              </button>
            </div>
            <div className="w-[1px] h-[42px] bg-[#E3D5E5]" />
            <div className="flex items-center gap-3">
              <div className="relative h-[42px] w-[42px] rounded-full overflow-hidden border border-[#E3D5E5]">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-[16px] text-[#6E5C76] font-medium">{user.name}</span>
            </div>
          </div>
        </header>

        {/* ==================== CONTEÚDO ==================== */}
        <main className="relative mt-3 px-6 md:px-8 pb-8">
          <div
            className="
              ml-auto w-full md:w-[85%]
              rounded-tl-[26px] bg-white/90 border border-white
              shadow-[0_8px_24px_rgba(122,76,119,0.10)]
              backdrop-blur-sm
              p-6 md:p-8
              min-h-[calc(100vh-160px)]
              overflow-y-auto
            "
          >
            {/* Linha de topo */}
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-3">
                <button
                  aria-label="Voltar"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7A4C77] shadow-sm text-[20px]"
                >
                  ‹
                </button>
                <h1 className="text-[20px] font-semibold text-[#3A2B3F]">
                  Projeto integrador 6
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[#3C3340] text-[16px] font-medium">{semester}</span>
                <div className="flex items-center">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`relative h-[38px] w-[38px] rounded-full border-2 border-white overflow-hidden ${
                        i < 3 ? '-mr-2' : ''
                      }`}
                    >
                      <Image
                        src={`/user${i}.png`}
                        alt={`User ${i}`}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Faixa lilás */}
            <section className="rounded-[16px] bg-[#F7F0FB] border border-[#EFE4F0] p-5 md:p-6">
              {/* Abas */}
              <div className="mb-5 flex flex-wrap items-center gap-3 justify-start">
                <button className="rounded-[10px] bg-[#7F6694] px-4 py-2 text-[14px] text-white shadow-sm">
                  Turma 1
                </button>
                <button className="rounded-[10px] bg-[#3C3340] text-white/90 px-4 py-2 text-[14px]">
                  Turma 2
                </button>
                <button className="rounded-[10px] bg-[#3C3340] text-white/90 px-4 py-2 text-[14px]">
                  + Adicionar
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Lista de alunos */}
                <div className="col-span-5">
                  <div className="rounded-[16px] border border-[#EFE4F0] bg-white p-4">
                    <div className="mb-3">
                      <div className="rounded-[10px] bg-[#F6F1F7] px-3 py-1.5 text-[14px] text-[#8B7A93]">
                        🔍 Search
                      </div>
                    </div>

                    <ul className="divide-y divide-[#EFE4F0] text-[#3A2B3F]">
                      {students.map((name) => (
                        <li
                          key={name}
                          className="flex items-center justify-between py-2.5 px-3 text-[15px] hover:bg-[#F8F4FA] rounded-[10px]"
                        >
                          <span>{name}</span>
                          <span className="text-[#9C8AA4] text-[18px]">⋮</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4">
                      <Button className="w-full h-9 rounded-[10px] bg-[#C288B3] text-white hover:bg-[#B276A2] text-[14px]">
                        + Adicionar aluno
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Grupos */}
                <div className="col-span-7">
                  <div className="rounded-[16px] bg-white border border-[#EFE4F0] p-4 md:p-6 flex flex-col gap-4">
                    {groups.map((g) => (
                      <div
                        key={g}
                        className="flex items-center justify-between rounded-[12px] border border-[#E8D8EB] bg-[#F7EDF7] px-4 py-3"
                      >
                        <span className="text-[#57445E] text-[15px]">{g}</span>
                        <button className="rounded-[10px] bg-[#3C3340] px-3 py-1.5 text-[13px] text-white">
                          Gerenciar
                        </button>
                      </div>
                    ))}
                    <div className="pt-2">
                      <Button className="rounded-[10px] bg-[#3C3340] px-4 py-2 text-[13px] text-white">
                        + Novo grupo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
