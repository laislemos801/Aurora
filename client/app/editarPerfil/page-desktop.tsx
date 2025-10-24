"use client";
import { useState } from "react";

const ICONS = {
  widgets: "/icons/widgets.svg",
  bell: "/icons/bell.svg",
  user: "/icons/user.svg",
};

export default function EditarPerfilDesktop() {
  const [habilidades, setHabilidades] = useState(["Frontend", "React", "UX Design"]);
  const [novaHabilidade, setNovaHabilidade] = useState("");

  const adicionarHabilidade = () => {
    if (novaHabilidade.trim() !== "") {
      setHabilidades([...habilidades, novaHabilidade]);
      setNovaHabilidade("");
    }
  };

  const cancelarEdicao = () => {
    window.location.href = "/perfil";
  };

  const salvarAlteracoes = () => {
    alert("Alterações salvas com sucesso!");
    window.location.href = "/perfil";
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F3FB] px-8 py-10">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <img src={ICONS.widgets} alt="logo" className="w-6 h-6" />
          <span className="text-[24px] font-semibold text-[#6B217E]">AURORA</span>
        </div>
        <img src={ICONS.bell} alt="Notificações" className="w-6 h-6 opacity-80" />
      </header>

      <main className="max-w-[900px] mx-auto bg-white rounded-[28px] ring-1 ring-black/5 shadow-md p-8">
        <h2 className="text-[24px] font-semibold text-[#6B217E] mb-8 text-center">Editar Perfil</h2>

        <div className="grid grid-cols-2 gap-5 mb-8">
          {[
            { label: "Nome", value: "Prof. Sílvia Andrade" },
            { label: "E-mail", value: "silvia@puc-campinas.edu.br" },
            { label: "Telefone", value: "(19) 99876-3210" },
            { label: "Instituição", value: "PUC Campinas" },
            { label: "Cargo", value: "Professora de Projeto Integrador" },
          ].map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-[#6B217E] mb-1">{field.label}</label>
              <input
                type="text"
                defaultValue={field.value}
                className="w-full border rounded-lg px-4 py-2 text-sm text-[#383838] focus:ring-2 focus:ring-[#9B4ACB]"
              />
            </div>
          ))}
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-[#6B217E] mb-1">Biografia</label>
          <textarea
            rows={4}
            defaultValue="“Aprender é reinventar o mundo.”"
            className="w-full border rounded-lg px-4 py-2 text-sm text-[#383838] focus:ring-2 focus:ring-[#9B4ACB]"
          />
        </div>

        {/* HABILIDADES */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-[#383838] mb-3">Habilidades</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {habilidades.map((h, i) => (
              <span
                key={i}
                className="bg-white ring-1 ring-[#E5D6F0] px-4 py-1.5 rounded-full text-sm text-[#6B217E] font-medium shadow-sm"
              >
                {h}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Adicionar habilidade"
              value={novaHabilidade}
              onChange={(e) => setNovaHabilidade(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2 text-sm text-[#383838] focus:ring-2 focus:ring-[#9B4ACB]"
            />
            <button
              onClick={adicionarHabilidade}
              className="px-4 py-2 bg-[#6B217E] text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              +
            </button>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="flex justify-center gap-6">
          <button
            onClick={cancelarEdicao}
            className="px-8 py-2 rounded-full text-[#383838] font-medium ring-1 ring-gray-300 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={salvarAlteracoes}
            className="px-8 py-2 rounded-full text-white font-medium"
            style={{ background: "linear-gradient(90deg, #6B217E, #9B4ACB)" }}
          >
            Salvar
          </button>
        </div>
      </main>
    </div>
  );
}