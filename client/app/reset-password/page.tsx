'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Lexend_Exa } from 'next/font/google';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { auth } from '@/firebase/clientApp';
import { sendPasswordResetEmail } from 'firebase/auth';

const lexendExa = Lexend_Exa({
  weight: '400',
  subsets: ['latin'],
});

export default function ResetPassword() {
  const [step, setStep] = useState<'email' | 'sent'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mapError = (code: string) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'E-mail inválido. Verifique e tente novamente.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente em alguns minutos.';
      case 'auth/network-request-failed':
        return 'Falha de rede. Verifique sua conexão.';
      default:
        return 'Não foi possível enviar o e-mail. Tente novamente.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const alvo = email.trim();
    if (!alvo) {
      setError('Informe seu e-mail.');
      return;
    }

    setLoading(true);
    try {
      // Define uma URL de redirecionamento específica apenas para reset de senha
      const actionCodeSettings =
        typeof window !== 'undefined'
          ? {
              url: 'http://localhost:3000/reset-password/insert',
              handleCodeInApp: true,
            }
          : undefined;

      await sendPasswordResetEmail(auth, alvo, actionCodeSettings);

      // Sempre exibe "E-mail enviado"
      setStep('sent');
    } catch (e: any) {
      console.error(e);
      setError(mapError(e?.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover px-4 sm:px-6 md:px-8"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      {/* CARD */}
      <div
        className="
          relative
          flex flex-col items-center text-center
          w-full max-w-[650px] h-auto sm:h-[720px]
          border border-white/30 rounded-[35px]
          backdrop-blur-md bg-white/25 shadow-lg
          py-10 sm:py-12 px-6 sm:px-10
          pb-20
        "
      >
        {/* LOGO */}
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

        {/* FORM */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                disabled={loading}
                className="
                  mt-5 sm:mt-6 h-11 sm:h-12 bg-[#C288B3] text-white font-medium rounded-md
                  hover:bg-[#b676a2] transition-all text-[15px] sm:text-[17px]
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                {loading ? 'Enviando…' : 'Enviar'}
              </Button>

              {error && (
                <p className="mt-3 text-red-500 text-[13px]">{error}</p>
              )}
            </form>
          </>
        )}

        {/* VISUAL DE SUCESSO */}
        {step === 'sent' && (
          <>
            <h2 className="text-[38px] text-[#614281] font-semibold mt-4">
              E-mail enviado!
            </h2>
            <p className="text-[18px] text-[#614281]/90 mt-4 leading-6 px-6 sm:px-12">
              Verifique sua <span className="italic font-semibold">caixa de mensagens</span> ou <span className="italic font-semibold">spam</span>, 
              para redefinir sua senha.
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
      </div>

      {/* IMAGEM DE FUNDO */}
      <Image
        src="/people.png"
        alt="Personagens Aurora"
        width={1200}
        height={300}
        className="
          pointer-events-none select-none
          absolute bottom-0 left-1/2 -translate-x-1/2
          w-8/12 sm:w-6/12 md:w-4/12 lg:w-3/12
          max-w-[520px]
          z-0
        "
      />
    </div>
  );
}
