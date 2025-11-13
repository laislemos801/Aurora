"use client";

import "primeicons/primeicons.css";
import HeaderPicture from "@/components/edit-profile/headerPicture";
import PersonalInfo from "@/components/edit-profile/personalInfo";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function EditProfile() {
  const { user, loading } = useAuthGuard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4EAF4]">
        <p className="text-[#7A4C77] text-lg">Carregando informações...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      className="
        w-full 
        flex flex-col 
        flex-1 
        min-h-0 
        overflow-y-auto 
        overflow-x-hidden 
        sm:px-4 sm:pt-4 md:px-8 
        gap-6
      "
    >
      {/* Banner no topo */}
      <HeaderPicture />

      {/* Conteúdo da tela abaixo */}
      <div className="flex flex-col rounded-t-2xl gap-6">
        <PersonalInfo />
      </div>

      {/* espaçamento final */}
      <div className="h-4 flex-shrink-0"></div>
    </div>
  );
}
