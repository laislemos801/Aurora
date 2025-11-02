import { FirebaseError } from "firebase/app";
import { db, storage } from "./clientApp";
import { collection, addDoc, updateDoc, doc, serverTimestamp, arrayUnion, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Professor {
  nome: string;
  email: string;
  uid: string;
}

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
  professores: Professor[];
}) {
  try {
    console.log("Iniciando criação do projeto:", { nome, descricao, semestre, ano });

    // Cria documento principal
    const projetoRef = await addDoc(collection(db, "Projetos"), {
      nome,
      descricao,
      semestre: Number(semestre),
      ano: Number(ano),
      professores,
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
): Promise<{ sucesso: boolean; professor?: Professor; erro?: string }> {
  try {
    console.log(`Buscando professor pelo email: ${email}`);
    const projetoRef = doc(db, "Projetos", projetoUid);

    const q = query(collection(db, "professores"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("Professor não encontrado!");
      return { sucesso: false, erro: "Professor não encontrado!" };
    }

    const docData = querySnapshot.docs[0];
    const professorData: Professor = {
      uid: docData.id,
      ...(docData.data() as Omit<Professor, "uid">),
    };

    console.log("Professor encontrado:", professorData);

    await updateDoc(projetoRef, {
      professores: arrayUnion(professorData),
    });

    console.log("Professor adicionado ao projeto:", projetoUid);
    return { sucesso: true, professor: professorData };
  } catch (erro: unknown) {
    let mensagemErro = "Erro desconhecido";

    if (erro instanceof FirebaseError) mensagemErro = erro.message;
    else if (erro instanceof Error) mensagemErro = erro.message;

    console.error("Erro ao adicionar professor:", mensagemErro);
    return { sucesso: false, erro: mensagemErro };
  }
}
