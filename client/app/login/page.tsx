"use client";

import Image from "next/image";
import { Lexend_Exa } from "next/font/google";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const lexendExa = Lexend_Exa({
  weight: "400",
  subsets: ["latin"],
});

export default function ResetPassword() {

  const handleSubmit = (e: React.FormEvent) => {

  };

  return (
    <div
      className="h-full w-full flex items-center justify-center bg-no-repeat bg-center bg-cover px-4 sm:px-6 md:px-8"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div
        className="
          flex flex-col items-center text-center
          w-full max-w-[650px] h-auto sm:h-[720px]
          border border-white/30 rounded-[35px]
          backdrop-blur-md bg-white/25 shadow-lg
          py-10 sm:py-12 px-6 sm:px-10
        "
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <Image
            src="/logo.png"
            alt="Logo Aurora"
            width={90}
            height={90}
            className="drop-shadow-md sm:w-[110px] sm:h-[110px]"
          />
        </div>

        <h1
          className={`${lexendExa.className} text-[#90416B] text-[28px] sm:text-[36px] font-semibold mt-6 tracking-[0.3em]`}
        >
          AURORA
        </h1>

        <>
          <p className="text-5xl  text-[#7B6294] mt-6 ">Bem vindo</p>
          <p className="text-3xl text-[#7B6294]">de volta!</p>
          <p className="text-xl text-white mt-3">
            Faça <span className="text-[#90416B] font-bold italic">login</span>{" "}
            e comece <br /> ampliando seu horizonte.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col mt-10 sm:mt-12 w-[90%] sm:w-3/5 gap-2"
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
            <p className="text-xs">
              Esqueceu sua senha? <span className="text-[#90416B] italic font-bold ">Lembrar-me</span>
            </p></div>

            <Button
              type="submit"
              className="
                  mt-5 sm:mt-6 h-11 sm:h-12 bg-[#C288B3] text-white font-medium rounded-md
                  hover:bg-[#b676a2] transition-all text-[15px] sm:text-[17px]
                "
            >
              Login
            </Button>
          </form>
        </>
      </div>
      <Image
        src="/people.png"
        alt="Personagens Aurora"
        width={1920}
        height={1080}
        className=" w-4/12 absolute bottom-0"
      />
    </div>
  );
}
