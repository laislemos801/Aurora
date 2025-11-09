"use client";

import "primeicons/primeicons.css";
import HeaderPicture from "@/components/edit-profile/headerPicture";
import PersonalInfo from "@/components/edit-profile/personalInfo";
import Dashboard from "@/components/edit-profile/dashboards";
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
    <div className="w-full min-h-screen flex flex-col">
      {/* Banner no topo, sem espaço extra */}
      <HeaderPicture />

      {/* conteúdo da tela abaixo */}
      <div className="flex flex-col rounded-t-2xl mt-6">
        <PersonalInfo/>
        <Dashboard/>
      </div>
    </div>
  );
}
