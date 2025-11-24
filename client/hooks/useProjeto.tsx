import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

export function useProjeto(projectId: string) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, "Projetos", projectId));
        if (!snap.exists()) setError("Projeto não encontrado");
        else setProject({ id: snap.id, ...snap.data() });
      } catch {
        setError("Erro ao carregar projeto");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [projectId]);

  return { project, loading, error };
}
