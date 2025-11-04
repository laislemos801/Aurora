"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import BannerSvg from "./banner";
import account_circle from "@/public/account_circle.png";
import { MdEdit } from "react-icons/md";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "@/firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";

export default function HeaderPicture() {
 const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      console.log("Usuário logado:", u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "Professores", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.profilePicture) setProfilePic(data.profilePicture);
        }
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      }
    };

    fetchProfile();
  }, [user]);

  const handleProfileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Limite de tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Arquivo muito grande! Máximo 5MB.");
      return;
    }

    setLoading(true);

    try {
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Aqui você pode mostrar progresso se quiser
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progresso: ${progress}%`);
        },
        (error) => {
          console.error("Erro no upload:", error);
          alert("Erro ao enviar a imagem.");
        },
        async () => {
          // Upload concluído
          const downloadURL = await getDownloadURL(storageRef);

          // Atualiza Firestore
          const userRef = doc(db, "Professores", user.uid);
          await updateDoc(userRef, { profilePicture: downloadURL });

          setProfilePic(downloadURL);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Erro ao atualizar foto:", error);
      setLoading(false);
      alert("Não foi possível atualizar a foto. Tente novamente.");
    }
  };

  return (
    <div className="relative -mt-1 w-full">
      <div className="w-full h-48 rounded-b-none rounded-tl-2xl sm:rounded-tl-4xl md:rounded-tl-4xl overflow-hidden">
        <BannerSvg />
      </div>

      <div className="absolute left-10 -bottom-12">
        <div className="relative w-28 h-28 sm:w-28 sm:h-28 md:w-46 md:h-46 rounded-full overflow-hidden shadow-lg">
        {profilePic === null ? (
            // Enquanto não carregou, não renderiza nada ou um loader
            <div className="w-28 h-28 rounded-full  animate-pulse" />
            ) : (
            <Image
                src={profilePic !== "" ? profilePic : account_circle}
                alt="Foto de perfil"
                width={400}
                height={400}
                className="object-cover"
                unoptimized
            />
            )}

          {loading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm">
              Enviando...
            </div>
          )}
        </div>

        <label
          htmlFor="profilePicInput"
          className="absolute -bottom-2 left-20 sm:left-20 md:left-32 bg-[#7B6294] p-2 rounded-full shadow cursor-pointer hover:bg-[#674984] transition"
        >
          <MdEdit size={14} className="text-[#FCF3FA]" />
        </label>

        <input
          type="file"
          id="profilePicInput"
          accept="image/*"
          onChange={handleProfileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
