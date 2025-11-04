'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import { Lexend_Exa } from 'next/font/google';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/firebase/clientApp'; // 🔹 certifique-se de exportar "db" no clientApp.ts

const lexend = Lexend_Exa({ subsets: ['latin'], weight: '400' });

export default function ProjectInfoPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔸 Autenticação Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser({ uid: u.uid, name: u.displayName || 'Professor(a)' });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 🔸 Carregar dados do projeto
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      setLoading(true);
      try {
        const ref = doc(db, 'Projetos', projectId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProject({ id: snap.id, ...snap.data() });
        } else {
          setError('Projeto não encontrado.');
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar o projeto.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  // 🔸 Loading visual
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4EAF4]">
        <p className="text-[#7A4C77] text-lg">Carregando informações...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4EAF4]">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="relative h-full w-full bg-[#F4EAF4] flex">
      {/* ============= SIDEBAR ============= */}
      <aside
        className="
          hidden md:flex fixed left-0 top-0 h-full w-[80px]
          flex-col items-center justify-between border-r border-[#E6DCE8]/60
          bg-[#F4EAF4] z-20 py-5
        "
      >
        <div className="relative w-[64px] h-[64px] rounded-full overflow-hidden -mt-[12px]">
          <Image
            src="/logo.png"
            alt="Aurora"
            fill
            className="object-contain object-center scale-[1.5]"
            priority
          />
        </div>
      </aside>

      {/* ============= CONTEÚDO PRINCIPAL ============= */}
      <div className="flex-1 md:ml-[80px] flex flex-col">
        {/* HEADER */}
        <header className="bg-[#F4EAF4] px-8 flex items-center justify-between h-[82px]">
          <span className={`${lexend.className} text-[#7A4C77] tracking-[0.25em] text-[26px]`}>
            AURORA
          </span>

          {user && (
            <div className="flex items-center gap-3">
              <div className="relative h-[42px] w-[42px] rounded-full overflow-hidden border border-[#E3D5E5]">
                <Image
                  src="/avatar.png"
                  alt={user.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-[16px] text-[#6E5C76] font-medium">
                {user.name}
              </span>
            </div>
          )}
        </header>

        {/* ============= CONTEÚDO ============= */}
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
            {/* Cabeçalho do projeto */}
            <div className="flex items-center justify-between mb-7">
              <h1 className="text-[22px] font-semibold text-[#3A2B3F]">
                {project.nome || 'Projeto sem nome'}
              </h1>
              <span className="text-[#3C3340] text-[16px] font-medium">
                {project.semestre}º semestre - {project.ano}
              </span>
            </div>

            <section className="rounded-[16px] bg-[#F7F0FB] border border-[#EFE4F0] p-6">
              <p className="text-[#4B3E50] text-[16px] leading-6">
                <strong>Descrição:</strong> {project.descricao}
              </p>

              <p className="mt-4 text-[#4B3E50] text-[15px]">
                <strong>Professor responsável:</strong>{' '}
                {user?.uid === project.professores?.[0]
                  ? user.name
                  : 'Outro professor'}
              </p>

              <div className="mt-6">
                <Button className="rounded-[10px] bg-[#C288B3] hover:bg-[#B276A2] text-white text-[14px] px-6 h-[42px]">
                  + Adicionar turma
                </Button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
