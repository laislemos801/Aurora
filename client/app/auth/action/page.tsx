'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lexend_Exa } from 'next/font/google';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { auth } from '@/firebase/clientApp';
import {
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; 

const lexendExa = Lexend_Exa({
  weight: '400',
  subsets: ['latin'],
});

type Mode = 'verifyEmail' | 'resetPassword' | null;

export default function AuthActionHandler() {
  const router = useRouter();
  const params = useSearchParams();

  const mode = useMemo<Mode>(() => {
    const m = params.get('mode');
    return (m as Mode) ?? null;
  }, [params]);

  const oobCode = params.get('oobCode');

  // Estados gerais
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);


  // Estados de redefinição de senha
  const [emailFromCode, setEmailFromCode] = useState<string>('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError('');
      setMsg('');
      setSuccess(false);

      if (!mode || !oobCode) {
        toast.error('Link inválido. Solicite novamente.');
        setLoading(false);
        return;
      }

      try {
        if (mode === 'verifyEmail') {
          await applyActionCode(auth, oobCode);
          toast.success('E-mail verificado com sucesso!');
          setSuccess(true);
        } else if (mode === 'resetPassword') {
          const email = await verifyPasswordResetCode(auth, oobCode);
          setEmailFromCode(email);
        }
      } catch (e) {
        console.error(e);
        toast.error(
          mode === 'verifyEmail'
            ? 'Este link de verificação expirou ou é inválido.'
            : 'Este link de redefinição expirou ou é inválido.'
        );
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [mode, oobCode]);

  const handleConfirmReset = async () => {
    setMsg('');
    setError('');

    // Validações locais (mantém no formulário)
    if (pass1.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (pass1 !== pass2) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!oobCode) {
      setError('Código ausente. Solicite novamente.');
      return;
    }

    setSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, pass1);
      toast.success('Senha redefinida com sucesso! Você já pode fazer login.');
      setSuccess(true);
    } catch (e: any) {
      console.error(e);
      toast.error('Erro ao redefinir senha. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: "url('/bg_login.png')" }}
    >
      {/* CARD CENTRAL */}
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
            className="drop-shadow-md w-12 h-12 "
          />
        </div>

        <h1
          className={`${lexendExa.className} text-[#90416B] text-xl md:text-[26px] xl:text-[30px] font-semibold mt-2 tracking-[0.3em]`}
        >
          AURORA
        </h1>

        {/* ÍCONE */}
        <Image
          src={mode === 'verifyEmail' || success ? '/emailsend.svg' : '/lock2.svg'}
          alt="Ícone"
          width={70}
          height={70}
          className="mt-16 sm:mt-16"
        />

        {/* CONTEÚDO */}
        {loading ? (
          <p className="text-white mt-8 text-sm">Processando...</p>
        ) : error && !mode?.includes('resetPassword') ? (
          <>
            <h2 className="text-[26px] sm:text-[34px] text-[#3B3B3B] font-semibold mt-6">
              Oops…
            </h2>
            <p className="text-[#800C1F]  text-[14px] mt-2 px-6">{error}</p>
            <Button
              className="mt-8 h-11 sm:h-12 w-64 sm:w-96 bg-[#90416B] hover:bg-[#782F56] cursor-pointer"
              onClick={() => router.push('/login')}
            >
              Voltar para o login
            </Button>
          </>
        ) : mode === 'verifyEmail' || success ? (
          <>
            <h2 className="text-xl md:text-2xl xl:text-2xl text-[#353535] font-semibold mt-12 leading-tight">
              {mode === 'verifyEmail'
                ? 'E-mail verificado!'
                : 'Senha redefinida com sucesso!'}
            </h2>
            <p className="text-xs sm:text-sm md:text-md text-[#353535] leading-6 px-6">
              {mode === 'verifyEmail'
                ? 'Sua conta foi confirmada com sucesso.'
                : 'Você já pode fazer login com sua nova senha.'}
            </p>

            <div className="mt-10">
              <Button
                className="w-64 sm:w-96 h-11 sm:h-12 cursor-pointer bg-[#90416B] hover:bg-[#782F56] text-white font-medium rounded-md transition-all"
                onClick={() => router.push('/login')}
              >
                Voltar para o login
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl xl:text-3xl text-[#3B3B3B] font-semibold mt-4 leading-tight">
              Redefina sua senha
            </h2>
            {emailFromCode && (
              <p className="text-xs sm:text-sm md:text-md text-[#353535]/90 mt-1">
                Conta: <span className="font-semibold">{emailFromCode}</span>
              </p>
            )}

            <div className="flex flex-col mt-6 sm:mt-10 w-64 sm:w-3/5 gap-1">
              {/* Campo: Nova senha */}
              <Label
                htmlFor="pass1"
                className="text-[13px] sm:text-[15px] text-left text-[#3B3B3B] ml-1 mb-1"
              >
                Nova senha
              </Label>
              <div className="relative">
                <Input
                  id="pass1"
                  type={showPass1 ? "text" : "password"}
                  placeholder="Nova senha"
                  value={pass1}
                  onChange={(e) => setPass1(e.target.value)}
                  className="border-[#3B3B3B] border-2 text-[#3B3B3B] rounded-md h-11 sm:h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass1(!showPass1)}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#3B3B3B] hover:text-[#90416B] transition"
                >
                  {showPass1 ? (
                    <IoEyeOffOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </button>
              </div>

              {/* Campo: Confirmar senha */}
              <Label
                htmlFor="pass2"
                className="mt-4 text-[13px] sm:text-[15px] text-left text-[#3B3B3B] ml-1 mb-1"
              >
                Confirme a nova senha
              </Label>
              <div className="relative">
                <Input
                  id="pass2"
                  type={showPass2 ? "text" : "password"}
                  placeholder="Confirme a nova senha"
                  value={pass2}
                  onChange={(e) => setPass2(e.target.value)}
                  className="border-[#3B3B3B] border-2 text-[#3B3B3B] rounded-md h-11 sm:h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass2(!showPass2)}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#3B3B3B] hover:text-[#90416B] transition"
                >
                  {showPass2 ? (
                    <IoEyeOffOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </button>
              </div>

              {/* Mensagem abaixo do input */}
              <p className="text-xs text-start pt-1 text-[#8C8C8C]">
                Sua senha deve conter 8 ou mais caracteres.
              </p>
              <Button
                onClick={handleConfirmReset}
                disabled={submitting}
                className="mt-6 h-11 sm:h-12 cursor-pointer bg-[#90416B] hover:bg-[#782F56] text-white font-medium rounded-md transition-all"
              >
                {submitting ? 'Redefinindo…' : 'Redefinir senha'}
              </Button>

              {/* Mensagens inline */}
              {msg && (
                <p className="mt-3 mb-4 text-[#539E43] text-[13px]">{msg}</p>
              )}
              {error && (
                <p className="mt-3 mb-4 text-[#800C1F] text-[13px]">{error}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
