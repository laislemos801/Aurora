import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { Professor } from "@/types/professor"; 

export function useProfessores(professoresIds: string[] = []) {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!professoresIds || professoresIds.length === 0) {
      setProfessores([]);
      setLoading(false);
      return;
    }

    async function load() {
      const result: Professor[] = [];

      for (const uid of professoresIds) {
        const snap = await getDoc(doc(db, "Professores", uid));

        if (snap.exists()) {
          const data = snap.data() as Omit<Professor, "uid">;

          result.push({
            uid,
            nome: data.nome || "Sem nome",
            email: data.email || "",
            profilePicture: data.profilePicture || "",
          });
        }
      }

      setProfessores(result);
      setLoading(false);
    }

    load();
  }, [professoresIds]);

  return { professores, loading };
}
