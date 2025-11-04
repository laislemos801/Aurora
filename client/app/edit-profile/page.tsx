"use client";

import "primeicons/primeicons.css";
import HeaderPicture from "@/components/edit-profile/headerPicture";
import PersonalInfo from "@/components/edit-profile/personalInfo";
import Dashboard from "@/components/edit-profile/dashboards";


export default function EditProfile() {
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
