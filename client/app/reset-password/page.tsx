'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Lexend_Exa } from 'next/font/google';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const lexendExa = Lexend_Exa({
  weight: '400',
  subsets: ['latin'],
});

export default function ResetPassword() {
  const [step, setStep] = useState<'email' | 'sent'>('email'); // controla o que aparece

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // aqui você pode integrar com Firebase/Auth
    setTimeout(() => setStep('sent'), 600); // simulação de sucesso
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover px-4 sm:px-6 md:px-8"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div
        className="
          relative flex flex-col items-center text-center
          w-full max-w-[650px] h-auto sm:h-[720px]
          border border-white/30 rounded-[35px]
          backdrop-blur-md bg-white/25 shadow-lg
          py-10 sm:py-12 px-6 sm:px-10
        "
      >
        {/* LOGO CIRCULAR */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <Image
            src="/logo_original.png"
            alt="Logo Aurora"
            width={90}
            height={90}
            quality={100}
            className="drop-shadow-md sm:w-[110px] sm:h-[110px]"
          />
        </div>

        {/* TÍTULO AURORA */}
        <h1
          className={`${lexendExa.className} text-[#90416B] text-[28px] sm:text-[36px] font-semibold mt-10 sm:mt-12 tracking-[0.3em]`}
        >
          AURORA
        </h1>

        <Image
          src="/closed_lock.png"
          alt="Ícone Cadeado"
          width={85}
          height={85}
          className="mt-6 sm:mt-5 sm:w-[110px] sm:h-[110px]"
        />

        {/* ============================================ */}
        {/* PASSO 1 — DIGITAR E-MAIL */}
        {/* ============================================ */}
        {step === 'email' && (
          <>
            <h2 className="text-[26px] sm:text-[38px] text-[#614281] font-semibold mt-4 leading-tight">
              Redefinição de senha
            </h2>
            <p className="text-[14px] sm:text-[18px] text-[#614281]/90 mt-1 leading-5 px-4 sm:px-8">
              Digite seu e-mail para redefinir a senha.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col mt-10 sm:mt-12 w-[90%] sm:w-3/5"
            >
              <Label
                htmlFor="email"
                className="text-[13px] sm:text-[15px] text-left text-[#7B6294] ml-1 mb-1"
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

              <Button
                type="submit"
                className="
                  mt-5 sm:mt-6 h-11 sm:h-12 bg-[#C288B3] text-white font-medium rounded-md
                  hover:bg-[#b676a2] transition-all text-[15px] sm:text-[17px]
                "
              >
                Enviar
              </Button>
            </form>
          </>
        )}

        {/* ============================================ */}
        {/* PASSO 2 — E-MAIL ENVIADO */}
        {/* ============================================ */}
        {step === 'sent' && (
          <>
            <h2 className="text-[26px] sm:text-[38px] text-[#614281] font-semibold mt-4 leading-tight">
              E-mail enviado!
            </h2>

            <p className="text-[14px] sm:text-[18px] text-[#614281]/90 mt-4 leading-6 px-6 sm:px-12">
              Verifique sua{' '}
              <span className="italic font-semibold">caixa de mensagens</span>{' '}
              ou <span className="italic font-semibold">spam</span> para redefinir sua senha.
            </p>

            <div className="mt-10 sm:mt-16">
              <Button
                className="w-[240px] sm:w-[280px] h-11 sm:h-12 bg-[#C288B3] text-white font-medium rounded-md hover:bg-[#b676a2] transition-all text-[15px] sm:text-[17px]"
                onClick={() => (window.location.href = '/login')}
              >
                Voltar para o Login
              </Button>
            </div>
          </>
        )}

        {/* PERSONAGENS */}
        <div className="relative mt-10 sm:mt-auto w-full flex justify-center">
          <Image
            src="/people.png"
            alt="Personagens Aurora"
            width={300}
            height={100}
            quality={100}
            className="object-contain sm:w-[500px] sm:h-[130px]"
          />
        </div>
      </div>
    </div>
  );
}
