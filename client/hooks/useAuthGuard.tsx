"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";

interface UserData {
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
}

/**
 * Hook que protege páginas verificando se o usuário está logado.
 * Busca também o campo "profilePicture" do Firestore.
 */
export function useAuthGuard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Busca dados adicionais do Firestore
          const userRef = doc(db, "Professores", currentUser.uid);
          const userSnap = await getDoc(userRef);

          const firestoreData = userSnap.exists()
            ? userSnap.data()
            : {};

          setUser({
            uid: currentUser.uid,
            name: currentUser.displayName || firestoreData.nome || "Professor(a)",
            email: currentUser.email || "",
            photoURL:
              firestoreData.profilePicture ||
              currentUser.photoURL ||
              null,
          });
        } catch (error) {
          console.error("Erro ao buscar dados do Firestore:", error);
        }
      } else {
        router.push("/login");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    console.log("Estado atual:", { user, loading });
  }, [user, loading]);

  return { user, loading };
}
