'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Lexend_Exa } from 'next/font/google';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { auth } from '@/firebase/clientApp';
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";

const lexendExa = Lexend_Exa({
  weight: '400',
  subsets: ['latin'],
});

export default function ResetPassword() {
  const [step, setStep] = useState<'email' | 'sent'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
      toast.error('Informe seu e-mail.');
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
      toast.success('E-mail de redefinição enviado com sucesso!');

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
      className="relative min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: "url('/bg_login.png')" }}
    >
      {/* CARD */}
      <div
        className="
          relative flex flex-col justify-start items-center text-center
          w-96 h-[700px] sm:w-130 sm:h-[700px] md:w-130 md:h-[740px] py-12 lg:w-140 xl:h-[780px] 2xl:mr-10
          border border-white/30 rounded-[35px]
          backdrop-blur-md bg-white/40 shadow-lg
        "
      >
        {/* LOGO */}
        <div className="flex flex-col justify-start items-center">
          <Image
            src="/logo aurora em svg.svg"
            alt="Logo Aurora"
            width={30}
            height={30}
            className="drop-shadow-md w-12 h-12 mt-8"
          />
        </div>

        <h1
          className={`${lexendExa.className} text-[#90416B] text-xl md:text-[26px] xl:text-[30px] font-semibold mt-2 mb-6 tracking-[0.3em]`}
        >
          AURORA
        </h1>

        {/* FORM */}
        {step === 'email' && (
          <>
            <Image
              src="/lock.svg"
              alt="Ícone Cadeado"
              width={85}
              height={85}
              className="mt-6 sm:mt-5 sm:w-[110px] sm:h-[110px]"
            />
            <h2 className="text-xl md:text-2xl xl:text-3xl text-[#3B3B3B] font-semibold mt-6 leading-tight">
              Redefinição de senha
            </h2>
            <p className="text-xs sm:text-sm md:text-md text-[#3B3B3B] font-medium mt-1 leading-5 px-4 sm:px-8">
              Digite seu e-mail para redefinir a senha.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col mt-6 sm:mt-12 w-64 sm:w-96 gap-2"
            >
              <Label
                htmlFor="email"
                className="text-[13px] sm:text-[15px] text-left text-[#3B3B3B] ml-1 mb-1"
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
                  border-[#3B3B3B] border-2 text-[#3B3B3B] rounded-md
                  text-[13px] sm:text-[15px] h-11 sm:h-12 w-full
                  placeholder-[#3B3B3B]
                  focus:outline-none shadow-none focus:ring-0
                "
              />

              <Button
                type="submit"
                disabled={loading}
                className="
                  mt-2 sm:mt-4 h-11 sm:h-12 bg-[#90416B] hover:bg-[#782F56] text-white font-medium rounded-md
                  transition-all text-[15px] sm:text-[17px]
                  disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
                "
              >
                {loading ? 'Enviando…' : 'Enviar'}
              </Button>
              <p
                onClick={() => router.push("/login")}
                className="
                  text-xs sm:text-sm md:text-md lg:text-md hover:underline font-semibold
                  text-[#7B6294]/90 text-center mt-2 mb-4 leading-6 px-6 sm:px-12
                  cursor-pointer hover:text-[#7B6294] transition-colors duration-200
                "
              >
                Voltar para o Login
              </p>

              {error && (
                <p className="mt-3 text-red-500 text-[13px]">{error}</p>
              )}
            </form>
          </>
        )}

        {/* VISUAL DE SUCESSO emailsend */}
        {step === 'sent' && (
          <>
            <Image
              src="/emailsend.svg"
              alt="Ícone Cadeado"
              width={70}
              height={70}
              className="mt-12 sm:mt-12 "
            />
            <h2 className="text-2xl md:text-4xl xl:text-4xl text-[#3B3B3B] font-semibold mt-4">
              E-mail enviado!
            </h2>
            <p className="text-sm sm:text-sm md:text-sm lg:text-md text-[#353535]/90 text-center mt-4 leading-6 px-6 sm:px-12">
              Verifique sua <span className="italic font-semibold text-[#7B6294]">caixa de mensagens</span> ou <span className="text-[#7B6294] italic font-semibold">spam</span>, 
              para redefinir sua senha.
            </p>
            <div className="mt-6 sm:mt-10">
              <Button
                className="w-64 sm:w-96 h-11 sm:h-12 cursor-pointer text-white font-medium rounded-md bg-[#90416B] hover:bg-[#782F56] transition-all"
                onClick={() => (window.location.href = '/login')}
              >
                Voltar para o Login
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
