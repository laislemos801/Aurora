"use client";

import { MdEdit } from "react-icons/md";
import { useState } from "react";

export default function PersonalInfo() {
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false)

    // Dados ficticios
    const [userData, setUserData] = useState({
        nome: "Silvia Soares",
        email: "silvia@puccampinas.edu.br",
        telefone: "(19) 9999-9999",
        nascimento: "00/00/0000",
    });

     // Estados para mudança de senha
    const [passwordData, setPasswordData] = useState({
        novaSenha: "",
        confirmarSenha: "",
    });

    // Função para salvar dados pessoais
    const handleSave = () => {
        setIsEditing(false);
        console.log("Dados pessoais atualizados:", userData);
    };

    // Função para salvar nova senha
    const handleSavePassword = () => {
        if (!passwordData.novaSenha || !passwordData.confirmarSenha) {
        alert("Preencha todos os campos de senha.");
        return;
        }
        if (passwordData.novaSenha !== passwordData.confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
        }

        console.log("Senha alterada com sucesso:", passwordData.novaSenha);
        alert("Senha atualizada com sucesso!");
        setPasswordData({ novaSenha: "", confirmarSenha: "" });
        setIsEditingPassword(false);
    };

    return (
        <div className="w-full flex flex-col justify-start items-start sm:px-12 md:px-16 mt-8 p-6">
            {/* Nome principal */}
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#000000]">
                {userData.nome}
            </h1>
            <div className="flex flex-col md:flex-row gap-6 mt-6">
                <div className="gap-6">
                    {/* Subtítulo + ícone de edição */}
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

                    {/* Texto em destaque suave */}
                    <p className="text-sm text-[#C9AFC8]">Dados de cadastro</p>

                    {/* Campos de informações */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-8 sm:gap-8">
                        <div className="flex flex-col gap-6">
                            {/* Nome */}
                                <div className="text-sm sm:text-md md:text-md lg:text-lg">
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

                            {/* E-mail */}
                            <div className="text-sm sm:text-md md:text-md lg:text-lg">
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
                            {/* Telefone */}
                            <div className="text-sm sm:text-md md:text-md lg:text-lg">
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

                            {/* Data de nascimento */}
                            <div className="text-sm sm:text-md md:text-md lg:text-lg">
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
                                <p className="text-gray-700 border-b border-dotted border-gray-400 w-fit">
                                    {userData.nascimento}
                                </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botão de salvar */}
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
                <div className="gap-6">
                    {/* Subtítulo + ícone de edição */}
                    <div className="flex items-start mt-1">
                        <h2 className="text-lg text-gray-500 font-medium">
                            Login e senha 
                        </h2>
                        <button
                            onClick={() => setIsEditingPassword(!isEditingPassword)}
                            className="ml-2 p-1 bg-[#7B6294] hover:bg-[#674984] transition rounded-full cursor-pointer text-white"
                            >
                            <MdEdit size={16} />
                        </button>
                    </div>

                    {/* Texto em destaque suave */}
                    <p className="text-sm text-[#C9AFC8]">Mudar senha</p>

                    {/* Campos de informações */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-8 sm:gap-8">
                        <div className="flex flex-col gap-6">
                            {/* Nome */}
                                <div className="text-sm sm:text-md md:text-md lg:text-lg">
                                    <p className="font-medium text-[#2E1F36]">Nova Senha</p>
                                    {isEditingPassword ? (
                                    <input
                                        type="password"
                                        value={passwordData.novaSenha}
                                            onChange={(e) =>
                                                setPasswordData({
                                                ...passwordData,
                                                novaSenha: e.target.value,
                                                })
                                        }
                                        className="border border-gray-300 rounded-lg px-1 py-1 w-full"
                                    />
                                    ) : (
                                    <p className="text-gray-700">{userData.nome}</p>
                                    )}
                                </div>

                            {/* E-mail */}
                            <div className="text-sm sm:text-md md:text-md lg:text-lg">
                                <p className="font-medium text-[#2E1F36]">Confirmar senha</p>
                                {isEditingPassword ? (
                                <input
                                    type="password"
                                    value={passwordData.confirmarSenha}
                                    onChange={(e) =>
                                        setPasswordData({
                                        ...passwordData,
                                        confirmarSenha: e.target.value,
                                        })
                                    }
                                    className="border border-gray-300 rounded-lg px-1 py-1 w-full"
                                />
                                ) : (
                                <p className="text-gray-700">{userData.email}</p>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Botão de salvar */}
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
