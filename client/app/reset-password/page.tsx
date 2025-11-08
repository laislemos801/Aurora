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
          relative flex flex-col justify-center items-center text-center
          w-80 h-[550px] sm:w-120 sm:h-[600px] md:w-120 md:h-[650px] md:py-12 lg:w-160 xl:h-[680px] 2xl:mr-10
          border border-white/30 rounded-[35px]
          backdrop-blur-md bg-white/25 shadow-lg
        "
      >
        {/* LOGO */}
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
            <h2 className="text-xl md:text-2xl xl:text-4xl text-[#614281] font-semibold mt-4 leading-tight">
              Redefinição de senha
            </h2>
            <p className="text-xs sm:text-sm md:text-md text-[#353535]/90 mt-1 leading-5 px-4 sm:px-8">
              Digite seu e-mail para redefinir a senha.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col mt-6 sm:mt-10 w-64 sm:w-3/5 gap-2"
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
                  mt-2 sm:mt-4 h-11 sm:h-12 bg-[#C288B3] text-white font-medium rounded-md
                  hover:bg-[#b676a2] transition-all text-[15px] sm:text-[17px]
                  disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
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

        {/* VISUAL DE SUCESSO emailsend */}
        {step === 'sent' && (
          <>
            <Image
              src="/emailsend.svg"
              alt="Ícone Cadeado"
              width={85}
              height={85}
              className="mt-6 sm:mt-5 sm:w-[110px] sm:h-[110px]"
            />
            <h2 className="text-2xl md:text-4xl xl:text-4xl text-[#614281] font-semibold mt-4">
              E-mail enviado!
            </h2>
            <p className="text-sm sm:text-sm md:text-md lg:text-xl text-[#353535]/90 text-center mt-4 leading-6 px-6 sm:px-12">
              Verifique sua <span className="italic font-semibold">caixa de mensagens</span> ou <span className="italic font-semibold">spam</span>, 
              para redefinir sua senha.
            </p>
            <div className="mt-6 sm:mt-10">
              <Button
                className="w-[240px] sm:w-[280px] h-11 sm:h-12 bg-[#C288B3] cursor-pointer text-white font-medium rounded-md hover:bg-[#b676a2] transition-all"
                onClick={() => (window.location.href = '/login')}
              >
                Voltar para o Login
              </Button>
            </div>
          </>
        )}
      </div>

      {/* IMAGEM PEOPLE */}
      <div className="fixed bottom-0 w-full flex justify-center pointer-events-none z-0">
        <Image
          src="/people.png"
          alt="Personagens Aurora"
          width={1920}
          height={1080}
          className="
            w-10/12 sm:w-2/12 md:w-4/12 lg:w-4/12 xl:w-3/10
            h-auto
            object-contain
            drop-shadow-lg
          "
        />
      </div>
    </div>
  );
}
