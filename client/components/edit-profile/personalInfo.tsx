"use client";

import { MdEdit } from "react-icons/md";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, getDoc, arrayRemove } from "firebase/firestore";
import { auth, db } from "@/firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-hot-toast";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

export default function PersonalInfo() {
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [user, setUser] = useState(auth.currentUser);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [showDeletePassword, setShowDeletePassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword ] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);

    // Dados do usuário do Firestore
    const [userData, setUserData] = useState({
        nome: "",
        email: "",
        telefone: "",
        nascimento: "",
        profilePicture: "",
    });

    const [passwordData, setPasswordData] = useState({
      senhaAntiga: "",
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

    // Salva nova senha 
    const handleSavePassword = async () => {
      if (!user) return;

      const { senhaAntiga, novaSenha, confirmarSenha } = passwordData;

      if (!senhaAntiga || !novaSenha || !confirmarSenha) {
        toast.error("Preencha todos os campos de senha.");
        return;
      }

      if (novaSenha !== confirmarSenha) {
        toast.error("As senhas nova e de confirmação não coincidem!");
        return;
      }

      try {
        // Reautenticação com senha antiga
        const credential = EmailAuthProvider.credential(user.email!, senhaAntiga);
        await reauthenticateWithCredential(user, credential);

        // Atualiza senha
        await updatePassword(user, novaSenha);

        toast.success("Senha atualizada com sucesso!");
        setPasswordData({ senhaAntiga: "", novaSenha: "", confirmarSenha: "" });
        setIsEditingPassword(false);
      } 
      catch (err: any) {
        console.error("Erro ao alterar senha:", err);

        if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
          toast.error("Senha atual incorreta. Digite novamente.");
        } else if (err.code === "auth/requires-recent-login") {
          toast.error("Por segurança, faça login novamente e tente alterar a senha.");
        } else {
          toast.error("Erro ao atualizar a senha. Tente novamente.");
        }
      }
    };


    // Função para remover o UID do professor de todos os projetos
    const removeProfessorFromProjects = async (uid: string) => {
      try {
        const projetosRef = collection(db, "Projetos");
        const q = query(projetosRef, where("professores", "array-contains", uid));
        const querySnapshot = await getDocs(q);

        for (const projetoDoc of querySnapshot.docs) {
          const projetoRef = doc(db, "Projetos", projetoDoc.id);
          await updateDoc(projetoRef, {
            professores: arrayRemove(uid)
          });
          console.log(`UID removido do projeto ${projetoDoc.id}`);
        }
      } catch (err) {
        console.error("Erro ao remover UID dos projetos:", err);
      }
    };

    // Dentro da função de exclusão da conta
    const handleDeleteAccount = async (senha: string) => {
      if (!user) return;
      if (!senha) return toast.error("Senha necessária para excluir a conta.");

      try {
        const credential = EmailAuthProvider.credential(user.email!, senha);
        await reauthenticateWithCredential(user, credential);

        // Remove o UID do professor de todos os projetos
        await removeProfessorFromProjects(user.uid);

        // Deleta o documento do professor no Firestore
        const userRef = doc(db, "Professores", user.uid);
        await deleteDoc(userRef);

        // Deleta a conta do Firebase Auth
        await user.delete();

        toast.success("Conta excluída com sucesso!");
        setShowModalDelete(false);
      } catch (err: any) {
        console.error("Erro ao excluir conta:", err);
        if (err.code === "auth/requires-recent-login") {
          toast.error("Por segurança, faça login novamente antes de excluir a conta.");
        } else if (err.code === "auth/wrong-password") {
          toast.error("Senha incorreta. Não foi possível excluir a conta.");
        } else {
          toast.error("Erro ao excluir a conta. Tente novamente.");
        }
      }
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
              {/* Senha antiga */}
              <div>
                <p className="font-medium text-[#2E1F36]">Senha atual</p>
                {isEditingPassword ? (
                  <div className="relative w-full flex items-center">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Senha atual"
                      value={passwordData.senhaAntiga || ""}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, senhaAntiga: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-2 text-[#7B6294]"
                    >
                      {showOldPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                    </button>

                  </div>
                ) : (
                  <p className="text-gray-700">********</p>
                )}
              </div>

              {/* Nova senha */}
              <div>
                <p className="font-medium text-[#2E1F36]">Nova Senha</p>
                {isEditingPassword ? (
                  <div className="relative w-full flex items-center">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Nova senha"
                      value={passwordData.novaSenha}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, novaSenha: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 text-[#7B6294]"
                    >
                      {showNewPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700">********</p>
                )}
              </div>

              {/* Confirmar senha */}
              <div>
                <p className="font-medium text-[#2E1F36]">Confirmar Senha</p>
                {isEditingPassword ? (
                  <div className="relative w-full flex items-center">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirmar senha"
                      value={passwordData.confirmarSenha}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmarSenha: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 text-[#7B6294]"
                    >
                      {showConfirmPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
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

        {/* Botão de excluir conta */}
        <div className="w-full flex justify-start mt-8">
          <button
            onClick={() => setShowModalDelete(true)}
            className="flex items-center gap-2 bg-[#B65254] hover:bg-[#863435] text-white px-4 py-2 rounded-lg cursor-pointer transition"
          >
            <RiDeleteBin6Line size={18} />
            Excluir Conta
          </button>
        </div>

        {/* Modal de exclusão com senha */}
        {showModalDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white flex flex-col items-center justify-center rounded-lg p-6 w-96">
              <h2 className="text-lg font-semibold mb-4">Confirmar exclusão</h2>
              <p className="mb-4 text-center">
                Digite sua senha para excluir sua conta. Esta ação é irreversível.
              </p>

              <div className="relative w-full">
                <input
                  type={showDeletePassword ? "text" : "password"}
                  placeholder="Senha"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-2 top-5 transform -translate-y-1/2 text-[#7B6294]"
                >
                  {showDeletePassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                </button>
              </div>

              <div className="flex justify-end gap-4 w-full">
                <button
                  onClick={() => setShowModalDelete(false)}
                  className="px-4 py-2 rounded-lg border cursor-pointer border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteAccount(deletePassword)}
                  className="px-4 py-2 rounded-lg cursor-pointer bg-[#B65254] hover:bg-[#863435] text-white transition"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}