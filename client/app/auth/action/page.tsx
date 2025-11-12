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

        {/* ÍCONE */}
        <Image
          src={mode === 'verifyEmail' || success ? '/success.png' : '/lock2.svg'}
          alt="Ícone"
          width={85}
          height={85}
          className="mt-6 sm:mt-5 sm:w-[110px] sm:h-[110px]"
        />

        {/* CONTEÚDO */}
        {loading ? (
          <p className="text-white mt-8 text-sm">Processando...</p>
        ) : error && !mode?.includes('resetPassword') ? (
          <>
            <h2 className="text-[26px] sm:text-[34px] text-[#614281] font-semibold mt-6">
              Oops…
            </h2>
            <p className="text-[#800C1F]  text-[14px] mt-2 px-6">{error}</p>
            <Button
              className="mt-6 h-11 sm:h-12 bg-[#C288B3] hover:bg-[#b676a2] cursor-pointer"
              onClick={() => router.push('/login')}
            >
              Voltar para o login
            </Button>
          </>
        ) : mode === 'verifyEmail' || success ? (
          <>
            <h2 className="text-xl md:text-2xl xl:text-2xl text-[#614281] font-semibold mt-4 leading-tight">
              {mode === 'verifyEmail'
                ? 'E-mail verificado!'
                : 'Senha redefinida com sucesso!'}
            </h2>
            <p className="text-xs sm:text-sm md:text-md text-[#353535]/90  mt-2 leading-6 px-6">
              {mode === 'verifyEmail'
                ? 'Sua conta foi confirmada com sucesso.'
                : 'Você já pode fazer login com sua nova senha.'}
            </p>

            <div className="mt-10">
              <Button
                className="w-[240px] sm:w-[280px] h-11 sm:h-12 cursor-pointer bg-[#C288B3] text-white font-medium rounded-md hover:bg-[#b676a2] transition-all"
                onClick={() => router.push('/login')}
              >
                Voltar para o login
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl xl:text-4xl text-[#614281] font-semibold mt-4 leading-tight">
              Redefina sua senha
            </h2>
            {emailFromCode && (
              <p className="text-xs sm:text-sm md:text-md text-[#353535]/90 mt-1">
                Conta: <span className="font-semibold">{emailFromCode}</span>
              </p>
            )}

            <div className="flex flex-col mt-6 sm:mt-10 w-64 sm:w-3/5 gap-1">
              <Label
                htmlFor="pass1"
                className="text-[13px] sm:text-[15px] text-left text-[#7B6294] ml-1 mb-1"
              >
                Nova senha
              </Label>
              <Input
                id="pass1"
                type="password"
                placeholder="Nova senha"
                value={pass1}
                onChange={(e) => setPass1(e.target.value)}
                className="border-[#7B6294] border-2 text-[#7B6294] rounded-md h-11 sm:h-12"
              />

              <Label
                htmlFor="pass2"
                className="mt-4 text-[13px] sm:text-[15px] text-left text-[#7B6294] ml-1 mb-1"
              >
                Confirme a nova senha
              </Label>
              <Input
                id="pass2"
                type="password"
                placeholder="Confirme a nova senha"
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
                className="border-[#7B6294] border-2 text-[#7B6294] rounded-md h-11 sm:h-12"
              />

              <Button
                onClick={handleConfirmReset}
                disabled={submitting}
                className="mt-6 h-11 sm:h-12 cursor-pointer bg-[#C288B3] text-white font-medium rounded-md hover:bg-[#b676a2] transition-all"
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
