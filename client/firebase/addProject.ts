import { FirebaseError } from "firebase/app";
import { db, storage } from "./clientApp";
import { collection, addDoc, updateDoc, doc, serverTimestamp, arrayUnion, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Turma {
  nome: string;
  alunos: Aluno[];
}

interface Aluno {
  nome: string;
  ra: number;
}

export async function criarProjeto({
  nome,
  descricao,
  semestre,
  ano,
  turmas,
  professores,
}: {
  nome: string;
  descricao: string;
  semestre: string | number;
  ano: string | number;
  turmas: Turma[];
  professores: string[];
}) {
  try {
    console.log("Iniciando criação do projeto:", { nome, descricao, semestre, ano });

    // Cria documento principal
    const projetoRef = await addDoc(collection(db, "Projetos"), {
      nome,
      descricao,
      semestre: Number(semestre),
      ano: Number(ano),
      professores: professores || [],
      createdAt: serverTimestamp(),
    });

    console.log("Projeto criado com UID:", projetoRef.id);

    // Salva turmas direto na subcoleção
    for (const turma of turmas) {
      console.log("Processando turma:", turma.nome, "com alunos:", turma.alunos);

      await addDoc(collection(projetoRef, "Turmas"), {
        nome: turma.nome,
        alunos: turma.alunos,
        createdAt: serverTimestamp(),
      });
    }

    console.log("Todas as turmas adicionadas com sucesso!");
    return { sucesso: true, uid: projetoRef.id };
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    return { sucesso: false, erro: (error as Error).message };
  }
}


// Adicionar logs na função de adicionar professor
export async function adicionarProfessorAoProjeto(
  email: string,
  projetoUid: string
): Promise<{ sucesso: boolean; professorUid?: string; erro?: string }> {
  try {
    const projetoRef = doc(db, "Projetos", projetoUid);

    const q = query(collection(db, "Professores"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { sucesso: false, erro: "Professor não encontrado!" };
    }

    const docData = querySnapshot.docs[0];
    const professorUid = docData.id;

    await updateDoc(projetoRef, {
      professores: arrayUnion(professorUid),
    });

    return { sucesso: true, professorUid };
  } catch (erro: unknown) {
    let mensagemErro = "Erro desconhecido";
    if (erro instanceof FirebaseError) mensagemErro = erro.message;
    else if (erro instanceof Error) mensagemErro = erro.message;

    return { sucesso: false, erro: mensagemErro };
  }
}

