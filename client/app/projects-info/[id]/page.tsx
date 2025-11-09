'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { addDoc, doc, getDoc, collection, getDocs, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/clientApp';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";

import { ProjectHeader } from '@/components/project-info/ProjectHeader';
import { TurmasSelector } from '@/components/project-info/TurmasSelector';
import { AddTurmaModal } from '@/components/project-info/AddTurmaModal';
import { AlunosList } from "@/components/project-info/AlunosList";
import { GruposList } from "@/components/project-info/GruposList";


interface Turma {
  id: string;
  nome: string;
  alunos: Aluno[];
  createdAt?: string;
}

interface Aluno {
  nome: string;
  ra: number;
}

interface ProfessorData {
  profilePicture?: string;
  nome: string;
  email?: string;
  uid?: string;
}

interface Grupo {
  id: string;
  nome: string;
  alunos: Aluno[];
}

// Função para extrair alunos de arquivo CSV ou XLSX
export async function extrairAlunosDoArquivo(file: File): Promise<Aluno[]> {
  const fileName = file.name.toLowerCase();
  let data: any[] = [];

  if (fileName.endsWith(".csv")) {
    const text = await file.text();
    const workbook = XLSX.read(text, { type: "string" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(worksheet);
  } else {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(worksheet);
  }

  const alunos = data
    .map((row: any, index: number) => {
      const nome = row.Student || row.Nome || row.Aluno || row["Nome do Aluno"];
      const ra = row.RA || row.Id;

      if (!nome) return null;

      // Se não tiver RA ou for inválido, gera um único
      const safeRa = ra && !isNaN(Number(ra)) ? Number(ra) : Date.now() + index;

      return { nome: String(nome).trim(), ra: safeRa };
    })
    .filter((a): a is Aluno => !!a && a.nome.toUpperCase() !== "POINTS POSSIBLE");

  if (!alunos.length) toast.error("Nenhum aluno encontrado no arquivo.");
  return alunos;
}


export default function ProjectInfoPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [turmaSelecionadaId, setTurmaSelecionadaId] = useState<string | null>(null);
  const turmaSelecionada = turmas.find(t => t.id === turmaSelecionadaId) || null;

  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [nomeTurma, setNomeTurma] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [turmaEditandoIndex, setTurmaEditandoIndex] = useState<number | null>(null);

  const [professoresData, setProfessoresData] = useState<ProfessorData[]>([]);

  // Autenticação do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Buscar projeto
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const snap = await getDoc(doc(db, 'Projetos', projectId));
        if (!snap.exists()) return setError("Projeto não encontrado");
        setProject({ id: snap.id, ...snap.data() });
      } catch {
        setError("Erro ao carregar projeto");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  // Buscar turmas
  useEffect(() => {
    const fetchTurmas = async () => {
      const snap = await getDocs(collection(db, "Projetos", projectId, "Turmas"));
      setTurmas(snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })));
    };
    fetchTurmas();
  }, [projectId]);

  // Buscar professores
  useEffect(() => {
    if (!project?.professores?.length) return;

    const carregarProfessores = async () => {
      try {
        const promises = project.professores.map(async (profUid: string) => {
          const profSnap = await getDoc(doc(db, "Professores", profUid));
          if (!profSnap.exists()) return { uid: profUid, nome: "Sem nome", profilePicture: "", email: "" };
          const data = profSnap.data();
          return {
            uid: profSnap.id,
            nome: data.nome || "Sem nome",
            profilePicture: data.profilePicture || "",
            email: data.email || "",
          };
        });
        const result = await Promise.all(promises);
        setProfessoresData(result);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar professores do projeto");
      }
    };
    carregarProfessores();
  }, [project?.professores]);

  // Buscar grupos da turma selecionada
  useEffect(() => {
    if (!turmaSelecionadaId) return;
    const fetchGrupos = async () => {
      const snap = await getDocs(collection(db, "Projetos", projectId, "Turmas", turmaSelecionadaId, "Grupos"));
      setGrupos(
        snap.docs.map(docSnap => {
          const data = docSnap.data() as Omit<Grupo, 'id'>;
          return { id: docSnap.id, ...data };
        })
      );
    };
    fetchGrupos();
  }, [turmaSelecionadaId, projectId]);

  // Salvar nova turma
  const handleSalvarTurma = async () => {
    if (!nomeTurma) return toast.error("Digite o nome da turma!");
    if (!uploadedFile) return toast.error("Adicione um arquivo!");
    let alunos: Aluno[] = [];

    try {
      alunos = await extrairAlunosDoArquivo(uploadedFile);
    } catch {
      return toast.error("Erro ao ler o arquivo");
    }

    const novaTurma = { nome: nomeTurma, alunos, createdAt: new Date().toISOString() };

    if (turmaEditandoIndex !== null) {
      const copy = [...turmas];
      copy[turmaEditandoIndex] = { ...copy[turmaEditandoIndex], ...novaTurma };
      setTurmas(copy);
      setTurmaEditandoIndex(null);
    } else {
      try {
        const docRef = await addDoc(collection(db, "Projetos", projectId, "Turmas"), novaTurma);
        setTurmas(prev => [...prev, { id: docRef.id, ...novaTurma }]);
        toast.success("Turma salva!");
      } catch {
        return toast.error("Erro ao salvar no banco");
      }
    }

    setNomeTurma("");
    setUploadedFile(null);
    setIsAddClassOpen(false);
  };

  // Adicionar aluno
  const handleAddAluno = async (nome: string, ra: number) => {
    if (!turmaSelecionada) return;

    try {
      const turmaRef = doc(db, "Projetos", projectId, "Turmas", turmaSelecionada.id);
      await updateDoc(turmaRef, { alunos: arrayUnion({ nome, ra }) });
      setTurmas(prev => prev.map(t => t.id === turmaSelecionada.id ? { ...t, alunos: [...t.alunos, { nome, ra }] } : t));
      toast.success("Aluno adicionado!");
    } catch {
      toast.error("Erro ao adicionar aluno");
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  // Excluir uma turma e todos os seus grupos
  const handleDeleteTurma = async (turmaId: string) => {

    try {
      // Buscar todos os grupos da turma
      const gruposSnap = await getDocs(
        collection(db, "Projetos", projectId, "Turmas", turmaId, "Grupos")
      );

      // Excluir cada grupo
      const deletePromises = gruposSnap.docs.map((grupoDoc) =>
        deleteDoc(
          doc(db, "Projetos", projectId, "Turmas", turmaId, "Grupos", grupoDoc.id)
        )
      );
      await Promise.all(deletePromises);

      // Excluir a turma
      await deleteDoc(doc(db, "Projetos", projectId, "Turmas", turmaId));

      // Atualizar estado local
      setTurmas((prev) => prev.filter((t) => t.id !== turmaId));
      setTurmaSelecionadaId(null);

      toast.success("Turma excluída com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir turma:", err);
      toast.error("Erro ao excluir a turma.");
    }
  };


  const handleDeleteProject = async () => {
    if (!projectId) return;

    try {
      // Buscar todas as turmas do projeto
      const turmasSnap = await getDocs(collection(db, "Projetos", projectId, "Turmas"));

      for (const turmaDoc of turmasSnap.docs) {
        const turmaId = turmaDoc.id;

        // Buscar todos os grupos dentro da turma
        const gruposSnap = await getDocs(collection(db, "Projetos", projectId, "Turmas", turmaId, "Grupos"));

        // Apagar todos os grupos dessa turma
        for (const grupoDoc of gruposSnap.docs) {
          await deleteDoc(doc(db, "Projetos", projectId, "Turmas", turmaId, "Grupos", grupoDoc.id));
        }

        // Apagar a turma após remover seus grupos
        await deleteDoc(doc(db, "Projetos", projectId, "Turmas", turmaId));
      }

      // Apagar o documento principal do projeto
      await deleteDoc(doc(db, "Projetos", projectId));

      toast.success("Projeto excluído com sucesso!");
      router.push("/all-projects");
    } catch (err) {
      console.error("Erro ao excluir projeto:", err);
      toast.error("Erro ao excluir o projeto.");
    }
  };

  const handleExcluirAluno = async (alunoRa: number) => {
    if (!turmaSelecionadaId) {
      toast.error("Nenhuma turma selecionada");
      return;
    }

    try {
      const turmaRef = doc(db, "Projetos", projectId, "Turmas", turmaSelecionadaId);
      const turmaAtual = turmas.find(t => t.id === turmaSelecionadaId);
      if (!turmaAtual) return;

      const novaLista = turmaAtual.alunos.filter(a => a.ra !== alunoRa);

      await updateDoc(turmaRef, { alunos: novaLista });

      setTurmas(prev =>
        prev.map(t =>
          t.id === turmaSelecionadaId ? { ...t, alunos: novaLista } : t
        )
      );

      toast.success("Aluno excluído!");
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      toast.error("Erro ao excluir aluno");
    }
  };



  return (
  <div className="flex flex-col w-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-2 sm:pl-4 lg:pl-6">
    <ProjectHeader
      nome={project?.nome}
      curso={project?.curso}
      semestre={project?.semestre}
      ano={project?.ano}
      professores={professoresData}
      onDelete={handleDeleteProject}
      projetoUid={projectId}
      setProfessores={setProfessoresData}
      onBack={() => router.push("/all-projects")}
    />


    <div className="flex-1 w-full pl-3 pt-5">
      <div className="flex flex-col bg-[#FCF3FA] shadow-md rounded-l-[15px] md:rounded-l-[25px] rounded-r-none 
      w-full p-3 pr-6 h-full">
        <p className="self-start text-[13px] font-medium text-[#3B3B3B] mb-2 md:text-[14px] md:pl-4 md:mt-2 pl-2">Turmas</p>

        <TurmasSelector
          turmas={turmas}
          turmaSelecionada={turmaSelecionadaId}
          onSelect={setTurmaSelecionadaId}
          onAdd={() => setIsAddClassOpen(true)}
        />

        {turmaSelecionada ? (
          <div className="flex flex-col lg:flex-row gap-2 w-full md:pr-4">
            <div className="flex-1 lg:basis-2/5 xl:basis-3/8 2xl:basis-2/8">
              <AlunosList
                alunos={turmaSelecionada.alunos ?? []}
                onAdd={handleAddAluno}
                onDelete={handleExcluirAluno} 
                grupos={grupos}
                turmaId={turmaSelecionada.id}
                projectId={projectId}
              />
            </div>

            <div className="flex-1 lg:basis-3/5 xl:basis-5/8 2xl:basis-6/8">
              <GruposList
                projectId={projectId}
                turmaId={turmaSelecionada.id}
                onDeleteTurma={() => handleDeleteTurma(turmaSelecionada.id)}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center flex-1 bg-white text-gray-500 text-[12px] 
          gap-4 rounded-xl p-4 mt-4 ml-2 md:ml-4">
            <img src="/semTurma.svg" alt="Nenhuma turma selecionada" className="w-56 h-56 object-contain" />
            <p className="text-center text-sm">
              <span className="font-semibold text-[#90416B]">Crie</span> ou <span className="font-semibold text-[#90416B]">selecione</span> uma turma para começar!
            </p>
          </div>
        )}
      </div>
    </div>

    {isAddClassOpen && (
      <AddTurmaModal
        nomeTurma={nomeTurma}
        setNomeTurma={setNomeTurma}
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
        onClose={() => setIsAddClassOpen(false)}
        onSave={handleSalvarTurma}
      />
    )}
  </div>
);

}
