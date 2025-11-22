"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FiPlus } from "react-icons/fi";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  setDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { db, auth } from "@/firebase/clientApp";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

interface Comment {
  uidAutor: string;
  nomeAutor: string;
  conteudo: string;
  data: string;
}

interface CommentWithAvatar extends Comment {
  avatar: string;
}

export default function CommentsCard() {
  const [comments, setComments] = useState<CommentWithAvatar[]>([]);
  const [newComment, setNewComment] = useState("");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarCache, setAvatarCache] = useState<Record<string, string>>({});

  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const turmaId = searchParams.get("turmaId");
  const grupoId = searchParams.get("grupoId");

  useEffect(() => {
    const fetchComments = async () => {
      if (!projectId || !turmaId || !grupoId) return;

      try {
        const grupoRef = doc(
          db,
          "Projetos",
          projectId,
          "Turmas",
          turmaId,
          "Grupos",
          grupoId
        );
        const grupoSnap = await getDoc(grupoRef);

        if (grupoSnap.exists()) {
          const data = grupoSnap.data();
          const comentarios = (data.comentarios || []) as Comment[];

          // Carrega avatares dos autores
          const updatedComments = await Promise.all(
            comentarios.map(async (c) => {
              const avatar = await getUserAvatar(c.uidAutor);
              return { ...c, avatar };
            })
          );

          setComments(updatedComments);
        } else {
          // cria o grupo caso nao exista ainda
          await setDoc(grupoRef, { comentarios: [] }, { merge: true });
          toast("Nenhum comentário encontrado. Comece adicionando um!");
        }
      } catch (error) {
        console.error("Erro ao buscar comentários:", error);
        toast.error("Erro ao carregar comentários.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [projectId, turmaId, grupoId]);

  // === FUNÇÃO PARA PEGAR FOTO DO USUÁRIO COM CACHE ===
  const getUserAvatar = async (uid: string) => {
    if (avatarCache[uid]) return avatarCache[uid];

    try {
      const profRef = doc(db, "Professores", uid);
      const profSnap = await getDoc(profRef);

      if (profSnap.exists()) {
        const profilePicture = profSnap.data().profilePicture || "/avatar.png";
        setAvatarCache((prev) => ({ ...prev, [uid]: profilePicture }));
        return profilePicture;
      }
    } catch (error) {
      console.error("Erro ao buscar avatar:", error);
    }
    return "/avatar.png";
  };

  // === ADICIONAR NOVO COMENTÁRIO ===
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const user = auth.currentUser;
    if (!user) {
      toast.error("Usuário não autenticado.");
      return;
    }

    try {
      const profRef = doc(db, "Professores", user.uid);
      const profSnap = await getDoc(profRef);
      const userData = profSnap.exists() ? profSnap.data() : {};

      const novoComentario: Comment = {
        uidAutor: user.uid,
        nomeAutor: user.displayName || userData.nome || "Usuário",
        conteudo: newComment.trim(),
        data: dayjs().format("DD/MM/YY HH:mm"),
      };

      const grupoRef = doc(
        db,
        "Projetos",
        projectId!,
        "Turmas",
        turmaId!,
        "Grupos",
        grupoId!
      );

      await updateDoc(grupoRef, {
        comentarios: arrayUnion(novoComentario),
      });

      const avatar =
        userData.profilePicture || user.photoURL || "/avatar.png";

      setComments((prev) => [
        { ...novoComentario, avatar },
        ...prev,
      ]);

      setNewComment("");
      setAdding(false);
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      toast.error("Erro ao salvar comentário.");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F6F6F6] rounded-lg w-full flex justify-center items-center py-10 shadow-md">
        <p className="text-gray-500 text-sm">Carregando comentários...</p>
      </div>
    );
  }

  return (
  <div className="bg-[#F6F6F6] rounded-lg w-full flex flex-col items-start gap-1 pb-3 pr-2 pl-4 py-4 shadow-md h-full">
    {/* Header */}
    <div className="flex justify-between items-center w-full mb-2">
      <h2 className="text-[14px] font-medium text-[#000000] 2xl:text-[18px]">
        Comentários
      </h2>
    </div>

    {/* Lista de comentários */}
    <div className="flex flex-col w-full gap-4 max-h-100 overflow-y-auto pr-4 scrollbar-custom lg:max-h-[221px] xl:max-h-[246px] 2xl:max-h-[257px]">

      {comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full py-2 text-center gap-3 lg:py-6 xl:py-8 2xl:py-12">
          <img
            src="/no-comments.png" 
            alt="Sem comentários"
            className="w-20 h-20 opacity-80 lg:w-28 lg:h-28"
          />
          <p className="text-gray-500 text-[12px]">
            Ainda não há comentários. Seja o <span className="font-semibold text-[#90416B]">primeiro</span> a comentar!
          </p>
        </div>
      ) : (
        comments.map((c, idx) => {
          const isCurrentUser = c.uidAutor === auth.currentUser?.uid;

          return (
            <div key={idx} className="flex flex-col w-full items-start">
              <div
                className="flex items-start gap-3 p-2 rounded-lg w-full bg-white"
              >
                <img
                  src={c.avatar}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />

                <div className="flex flex-col">
                  <span className="text-[12px] font-medium text-[#000000] xl:text-[13px]">
                    {isCurrentUser ? "Você" : c.nomeAutor}
                  </span>

                  <p className="text-[12px] text-[#3B3B3B] mt-1 xl:text-[13px]">
                    {c.conteudo}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] text-[#3B3B3B] self-end mt-1 font-medium ${
                  isCurrentUser ? "mr-1" : "ml-1"
                }`}
              >
                {c.data}
              </span>
            </div>
          );
        })
      )}
    </div>

    {/* Novo comentário */}
    <div className="w-full pr-4 mt-auto">
      {adding ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva um comentário..."
            className="flex-1 bg-gray-50 rounded-xl border border-gray-200 text-sm px-3 py-2
                       focus:ring-2 focus:ring-[#B86B9F]/40 focus:outline-none"
          />
          <button
            onClick={handleAddComment}
            className="bg-[#B86B9F] text-white px-4 py-2 rounded-xl text-sm font-medium 
                       hover:bg-[#9c5a89] transition-all"
          >
            Enviar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="bg-white w-full flex items-center gap-2 text-[#B86B9F] text-[13px] rounded-md mt-2 p-2 hover:underline xl:text-[14px]"
        >
          <FiPlus size={16} />
          Novo comentário
        </button>
      )}
    </div>
  </div>
);

}
