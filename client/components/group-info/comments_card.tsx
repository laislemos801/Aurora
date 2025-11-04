"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { FiPlus } from "react-icons/fi";

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  avatar: string;
}

export default function CommentsCard() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Prof. Ana Souza",
      text: "Uma integrante do grupo trancou o curso.",
      timestamp: "12/09/2025 08:50",
      avatar: "/avatar.png",
    },
    {
      id: "2",
      author: "Prof. João Lima",
      text: "Texto",
      timestamp: "12/09/2025 08:10",
      avatar: "/avatar.png",
    },
    {
      id: "3",
      author: "Prof. Carlos Mendes",
      text: "Texto",
      timestamp: "15/09/2025 08:20",
      avatar: "/avatar.png",
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [adding, setAdding] = useState(false);

  const currentUserName = "Prof. Atual";

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newEntry: Comment = {
      id: crypto.randomUUID(),
      author: currentUserName,
      text: newComment,
      timestamp: dayjs().format("DD/MM/YYYY HH:mm"),
      avatar: "/avatar.png",
    };

    setComments([newEntry, ...comments]);
    setNewComment("");
    setAdding(false);
  };

  return (
    <div className="bg-[#F6F6F6] rounded-lg w-full flex flex-col items-start gap-1 pb-3 p-4 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-2">
        <h2 className="text-md font-medium text-gray-800">Comentários</h2>
      </div>

      {/* Lista de comentários com scroll */}
      <div className="flex flex-col w-full gap-4 max-h-40 overflow-y-auto pr-2 scrollbar-custom">
        {comments.map((c) => (
          <div key={c.id} className="flex flex-col">
            <div className="flex items-start gap-3 bg-white rounded-lg p-2">
              <img
                src={c.avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex flex-col w-full">
                <span className="text-[12px] font-medium text-gray-700">
                  {c.author}
                </span>
                <p className="text-[12px] text-[#3B3B3B] mt-1">{c.text}</p>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 self-end mt-1 mr-1">
              {c.timestamp}
            </span>
          </div>
        ))}
      </div>

      {/* Novo comentário */}
      <div className="w-full pr-2">
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
              className="bg-[#C288B3] text-white font-medium px-3 py-1 rounded-md text-sm hover:bg-[#a35b8c]"
            >
              Enviar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="bg-white w-full flex items-center gap-2 text-[#B86B9F] text-sm rounded-md mt-3 p-2 hover:underline"
          >
            <FiPlus size={16} />
            Novo comentário
          </button>
        )}
      </div>
    </div>
  );
}
