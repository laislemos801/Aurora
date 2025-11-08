'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/clientApp';
import { onAuthStateChanged } from 'firebase/auth';
import Image from "next/image";
import backArrow from "@/public/group-back-button.svg";

export default function ProjectInfoPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({ uid: u.uid, name: u.displayName || 'Professor(a)' });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        const ref = doc(db, 'Projetos', projectId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          setProject(data);
        } else {
          setError('Projeto não encontrado.');
        }
      } catch (err) {
        console.error('Erro ao buscar projeto:', err);
        setError('Erro ao carregar o projeto.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (!project) return <p>Nenhum projeto encontrado.</p>;

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-1">
      {/* Header */}
      <div className="flex flex-col self-start">
        {/* Linha com botão e nome do projeto */}
        <div className="flex items-center">
          <button className="flex-shrink-0">
            <Image src={backArrow} alt="Voltar" width={32} height={32} />
          </button>

          <p className="ml-2 text-lg font-medium text-[#3B3B3B]">
            {project?.nome || 'Projeto sem nome'}
          </p>
        </div>

        {/* Linha com semestre e ano */}
        <p className="ml-10 text-[12px] font-medium text-[#3B3B3B]">
          {project?.semestre && project?.ano
            ? `${project.semestre}° semestre - ${project.ano}`
            : ''}
        </p>
      </div>
    </div>
  );
}
