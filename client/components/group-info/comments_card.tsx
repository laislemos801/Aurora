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

  // === BUSCAR COMENTÁRIOS DO GRUPO ===
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
        <h2 className="text-md font-medium text-gray-800 2xl:text-[18px]">
          Comentários
        </h2>
      </div>

      {/* Lista de comentários */}
      <div className="flex flex-col w-full gap-4 max-h-40 overflow-y-auto pr-4 scrollbar-custom lg:max-h-[221px] xl:max-h-[246px] 2xl:max-h-[257px]">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        ) : (
          comments
            .slice()
            .reverse()
            .map((c, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-start gap-3 bg-white rounded-lg p-2">
                  <img
                    src={c.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex flex-col w-full">
                    <span className="text-[12px] font-medium text-gray-700 xl:text-[13px]">
                      {c.nomeAutor}
                    </span>
                    <p className="text-[12px] text-[#3B3B3B] mt-1 xl:text-[13px]">
                      {c.conteudo}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 self-end mt-1 mr-1">
                  {c.data}
                </span>
              </div>
            ))
        )}
      </div>

      {/* Novo comentário */}
      <div className="w-full pr-4 mt-auto">
        {adding ? (
          <div className="flex items-center gap-2 mt-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva seu comentário..."
              className="flex-1 bg-white rounded-lg border border-gray-200 text-[13px] p-2 focus:outline-none focus:ring-1 focus:ring-[#B86B9F]"
            />
            <button
              onClick={handleAddComment}
              className="bg-[#C288B3] text-white font-medium px-3 py-1 rounded-md text-sm hover:bg-[#6a5583]"
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
