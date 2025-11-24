import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

export function useGrupos(projectId: string, turmaId: string | null) {
  const [grupos, setGrupos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!turmaId) return;

    async function fetchGrupos() {
      const snap = await getDocs(
        collection(db, "Projetos", projectId, "Turmas", turmaId!, "Grupos")
      );
      setGrupos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }

    fetchGrupos();
  }, [projectId, turmaId]);

  return { grupos, loading, setGrupos };
}
