"use client";

import { MdEdit } from "react-icons/md";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-hot-toast";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function PersonalInfo() {
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [user, setUser] = useState(auth.currentUser);

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword ] = useState(false);


    // Dados do usuário do Firestore
    const [userData, setUserData] = useState({
        nome: "",
        email: "",
        telefone: "",
        nascimento: "",
        profilePicture: "",
    });

    const [passwordData, setPasswordData] = useState({
        novaSenha: "",
        confirmarSenha: "",
    });

    // Detecta o usuário logado
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        if (u) fetchUserData(u.uid);
        });
        return () => unsubscribe();
    }, []);

    // Pega dados do Firestore
    const fetchUserData = async (uid: string) => {
        try {
        const userRef = doc(db, "Professores", uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
            setUserData(snap.data() as any);
        } else {
            console.error("Usuário não existe");
        }
        } catch (err) {
            console.error("Erro ao buscar usuário:", err);
        }
    };

    // Salva dados editados
    const handleSave = async () => {
        if (!user) return;
        try {
        const userRef = doc(db, "Professores", user.uid);
        await updateDoc(userRef, {
            nome: userData.nome,
            email: userData.email,
            telefone: userData.telefone,
            nascimento: userData.nascimento,
        });
        setIsEditing(false);
        toast.success("Dados pessoais atualizados com sucesso!");
        } catch (err) {
        console.error("Erro ao atualizar dados:", err);
        toast.error("Erro ao atualizar os dados.");   
        }
    };

    // Salva senha (apenas simula, se usar Firebase Auth real, precisa updatePassword)
    const handleSavePassword = () => {
        if (!passwordData.novaSenha || !passwordData.confirmarSenha) {
        toast.error("Preencha todos os campos de senha.");
        return;
        }
        if (passwordData.novaSenha !== passwordData.confirmarSenha) {
        toast.error("As senhas não coincidem!");
        return;
        }

        console.log("Senha alterada com sucesso:", passwordData.novaSenha);
        toast.success("Senha atualizada com sucesso!");
        setPasswordData({ novaSenha: "", confirmarSenha: "" });
        setIsEditingPassword(false);
    };

  return (
    <div className="w-full flex flex-col justify-start items-start sm:px-12 md:px-16 mt-8 p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#000000]">
        {userData.nome}
      </h1>

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Informações pessoais */}
        <div className="gap-6">
          <div className="flex items-start mt-1">
            <h2 className="text-lg text-gray-500 font-medium">
              Informações pessoais
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="ml-2 p-1 bg-[#7B6294] hover:bg-[#674984] transition rounded-full cursor-pointer text-white"
            >
              <MdEdit size={16} />
            </button>
          </div>

          <p className="text-sm text-[#C9AFC8]">Dados de cadastro</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-8 sm:gap-8">
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-medium text-[#2E1F36]">Nome</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.nome}
                    onChange={(e) =>
                      setUserData({ ...userData, nome: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-1 py-1 w-full"
                  />
                ) : (
                  <p className="text-gray-700">{userData.nome}</p>
                )}
              </div>

              <div>
                <p className="font-medium text-[#2E1F36]">E-mail</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-1 py-1 w-full"
                  />
                ) : (
                  <p className="text-gray-700">{userData.email}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <p className="font-medium text-[#2E1F36]">Telefone</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.telefone}
                    onChange={(e) =>
                      setUserData({ ...userData, telefone: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-1 py-1 w-full"
                  />
                ) : (
                  <p className="text-gray-700">{userData.telefone}</p>
                )}
              </div>

              <div>
                <p className="font-medium text-[#2E1F36]">Data de nascimento</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.nascimento}
                    onChange={(e) =>
                      setUserData({ ...userData, nascimento: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-1 py-1 w-full"
                  />
                ) : (
                  <p className="text-gray-700">{userData.nascimento}</p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              className="mt-6 bg-[#7B6294] hover:bg-[#674984] text-white px-4 py-2 rounded-lg cursor-pointer transition"
            >
              Salvar
            </button>
          )}
        </div>

        {/* Separador */}
        <div className="hidden sm:block w-px bg-gray-300 mx-4" />

        {/* Senha */}
        <div className="gap-6">
          <div className="flex items-start mt-1">
            <h2 className="text-lg text-gray-500 font-medium">Login e senha</h2>
            <button
              onClick={() => setIsEditingPassword(!isEditingPassword)}
              className="ml-2 p-1 bg-[#7B6294] hover:bg-[#674984] transition rounded-full cursor-pointer text-white"
            >
              <MdEdit size={16} />
            </button>
          </div>

          <p className="text-sm text-[#C9AFC8]">Mudar senha</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-8 sm:gap-8">
            <div className="flex flex-col gap-6">
                <div>
                    <p className="font-medium text-[#2E1F36]">Nova Senha</p>
                    {isEditingPassword ? (
                        <div className="relative w-full flex items-center">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Senha"
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-2 text-[#7B6294]"
                            >
                                {showNewPassword ? (
                                <MdVisibility size={20} />
                                ) : (
                                <MdVisibilityOff size={20} />
                                )}
                            </button>
                        </div>

                    ) : (
                    <p className="text-gray-700">********</p>
                    )}
                </div>

              <div>
                <p className="font-medium text-[#2E1F36]">Confirmar Senha</p>
                {isEditingPassword ? (
                    <div className="relative w-full flex items-center">
                        <input
                            type={showConfirmPassword  ? "text" : "password"}
                            placeholder="Senha"
                            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword )}
                            className="absolute right-2 text-[#7B6294]"
                        >
                            {showConfirmPassword  ? (
                            <MdVisibility size={20} />
                            ) : (
                            <MdVisibilityOff size={20} />
                            )}
                        </button>
                    </div>
                ) : (
                  <p className="text-gray-700">********</p>
                )}
              </div>
            </div>
          </div>

          {isEditingPassword && (
            <button
              onClick={handleSavePassword}
              className="mt-6 bg-[#7B6294] hover:bg-[#674984] text-white px-4 py-2 rounded-lg cursor-pointer transition"
            >
              Salvar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
