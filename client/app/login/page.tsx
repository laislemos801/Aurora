"use client";

import Image from "next/image";
import { Lexend_Exa } from "next/font/google";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';

const lexendExa = Lexend_Exa({
  weight: "400",
  subsets: ["latin"],
});

export default function ResetPassword() {

  const handleSubmit = (e: React.FormEvent) => {

  };

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: "url('/bg_login.png')" }}>
      <div
        className="
          relative flex flex-col justify-center items-center text-center
          w-80 h-[550px] sm:w-120 sm:h-[600px] md:w-120 md:h-[650px] md:py-12 lg:w-160 xl:h-[680px] 2xl:mr-10
          border border-white/30 rounded-[35px]
          backdrop-blur-md bg-white/25 shadow-lg
        "
      >
        <div className="absolute -top-8 sm:-top-8 left-1/2 -translate-x-1/2">
          <Image
            src="/logo aurora em svg.svg"
            alt="Logo Aurora"
            width={80}
            height={80}
            className="drop-shadow-md w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20"
          />
        </div>

        <h1
          className={`${lexendExa.className} text-[#90416B] text-xl md:text-[26px] xl:text-[30px] font-semibold mt-2 tracking-[0.3em]`}
        >
          AURORA
        </h1>

        <>
          <p className="text-2xl md:text-4xl xl:text-6xl text-[#7B6294] mt-6 font-medium">Bem vindo</p>
          <p className="text-xl md:text-3xl xl:text-4xl text-[#7B6294] font-medium">de volta!</p>
          <p className="text-sm sm:text-sm md:text-lg text-white mt-3">
            Faça <span className="text-[#90416B] font-bold italic">login</span>{" "}
            e comece <br /> ampliando seu horizonte.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col mt-10 sm:mt-10 w-64 sm:w-3/5 gap-2"
          >
            <div>
              <Label
                htmlFor="email"
                className="text-[13px] sm:text-[15px] text-left text-[#7B6294] ml-1"
              >
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="E-mail"
                className="
                  border-[#7B6294] border-2 text-[#7B6294] rounded-md
                  text-[13px] sm:text-[15px] h-11 sm:h-12 w-full
                  placeholder-[#7B6294]
                  focus:outline-none shadow-none focus:ring-0
                "
              />
            </div>
            <div>
              <Label
                htmlFor="email"
                className="text-[13px] sm:text-[15px] text-left text-[#7B6294] ml-1 "
              >
                Senha
              </Label>
              <Input
                id="passaword"
                type="passaword"
                required
                placeholder="Senha"
                className="
                  border-[#7B6294] border-2 text-[#7B6294] rounded-md
                  text-[13px] sm:text-[15px] h-11 sm:h-12 w-full
                  placeholder-[#7B6294]
                  focus:outline-none shadow-none focus:ring-0
                "
              />
            </div>
            <div className="w-full flex justify-end">
            <p className="text-xs sm:text-sm">
              Esqueceu sua senha? <span className="text-[#90416B] italic font-bold ">Lembrar-me</span>
            </p></div>

            <Button
              type="submit"
              className="
                  mt-5 sm:mt-6 h-11 sm:h-12 bg-[#C288B3] text-white font-medium rounded-md
                  hover:bg-[#b676a2] transition-all text-[15px] sm:text-[17px] cursor-pointer
                "
            >
              Login
            </Button>
          </form>
        </>
      </div>
      {/* IMAGEM PEOPLE */}
      <div className="fixed bottom-0 w-full flex justify-center pointer-events-none z-0">
        <Image
          src="/people.png"
          alt="Personagens Aurora"
          width={1920}
          height={1080}
          className="
            w-10/12 sm:w-8/12 md:w-6/12 lg:w-4/12 xl:w-3/12
            h-auto
            object-contain
            drop-shadow-lg
          "
        />
      </div>


    </div>
  );
}
