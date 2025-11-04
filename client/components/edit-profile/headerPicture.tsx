"use client";

import { useState } from "react";
import Image from "next/image";
import BannerSvg from "./banner";
import avatar from "@/public/avatar.png";
import { MdEdit } from "react-icons/md";

export default function HeaderPicture() {
    const [profilePic, setProfilePic] = useState<string | null>(null);

    const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        const imageUrl = URL.createObjectURL(file);
        setProfilePic(imageUrl);
        }
    };

    return (
        <div className="relative -mt-1 w-full">
        {/* Banner fixo no topo */}
        <div className="w-full h-48 rounded-b-none rounded-tl-2xl sm:rounded-tl-4xl md:rounded-tl-8xl overflow-hidden">
            <BannerSvg />
        </div>

        {/* Foto de perfil */}
        <div className="absolute left-10 -bottom-12">
            <div className="relative w-28 h-28 sm:w-28 sm:h-28 md:w-46 md:h-46 rounded-full overflow-hidden shadow-lg">
                {profilePic ? (
                    <Image
                    src={profilePic}
                    alt="Foto de perfil"
                    fill
                    className="object-cover"
                    unoptimized
                    />
                ) : (
                    <Image
                    src={avatar}
                    alt="Foto de perfil padrão"
                    fill
                    className="object-cover"
                    />
                )}
            </div>

            {/* Ícone para trocar foto (fora do círculo) */}
            <label
                htmlFor="profilePicInput"
               className="absolute -bottom-2 left-20 sm:left-20 md:left-32 bg-[#7B6294] p-2 rounded-full shadow cursor-pointer hover:bg-[#674984] transition">
                <MdEdit size={14} className="text-[#FCF3FA]" />
            </label>

            <input
                type="file"
                id="profilePicInput"
                accept="image/*"
                onChange={handleProfileChange}
                className="hidden"
            />
            

        </div>
        
    </div>
  );
}
