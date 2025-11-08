import { db } from "./clientApp";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

/**
 * Adiciona um professor (pelo UID) ao array "professores" de um projeto.
 */
export async function adicionarProfessorAoProjeto(
  projetoUid: string,
  professorUid: string
): Promise<{ sucesso: boolean; erro?: string }> {
  try {
    const projetoRef = doc(db, "Projetos", projetoUid);

    await updateDoc(projetoRef, {
      professores: arrayUnion(professorUid),
    });

    console.log(`✅ Professor ${professorUid} adicionado ao projeto ${projetoUid}`);
    return { sucesso: true };
  } catch (erro: unknown) {
    let mensagemErro = "Erro desconhecido";
    if (erro instanceof FirebaseError) mensagemErro = erro.message;
    else if (erro instanceof Error) mensagemErro = erro.message;

    console.error("Erro ao adicionar professor ao projeto:", mensagemErro);
    return { sucesso: false, erro: mensagemErro };
  }
}
