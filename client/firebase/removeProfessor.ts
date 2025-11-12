import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

/**
 * Remove um professor do projeto no Firestore
 * @param projetoUid ID do projeto
 * @param professorUid ID do professor a ser removido
 */
export async function removerProfessorDoProjeto(projetoUid: string, professorUid: string) {
  try {
    const projetoRef = doc(db, "Projetos", projetoUid);
    await updateDoc(projetoRef, {
      professores: arrayRemove(professorUid),
    });
    console.log(`Professor ${professorUid} removido com sucesso do projeto ${projetoUid}.`);
  } catch (error) {
    console.error("Erro ao remover professor do projeto:", error);
    throw error;
  }
}
