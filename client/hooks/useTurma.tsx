import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

export function useTurma(projectId: string, turmaId: string) {
  const [turma, setTurma] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !turmaId) return;

    async function load() {
      const ref = doc(db, "Projetos", projectId, "Turmas", turmaId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setTurma({ id: snap.id, ...snap.data() });
      } else {
        setTurma(null);
      }

      setLoading(false);
    }

    load();
  }, [projectId, turmaId]);

  return { turma, loading };
}
