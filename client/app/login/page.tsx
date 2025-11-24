"use client";

import Image from "next/image";
import { Lexend_Exa } from "next/font/google";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/navigation";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const lexendExa = Lexend_Exa({
  weight: "400",
  subsets: ["latin"],
});

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const mapError = (code: string) => {
    switch (code) {
      case "auth/invalid-email":
        return "E-mail inválido.";
      case "auth/user-not-found":
        return "Usuário não encontrado.";
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Senha incorreta.";
      case "auth/too-many-requests":
        return "Muitas tentativas. Tente novamente mais tarde.";
      case "auth/network-request-failed":
        return "Falha de conexão. Verifique sua internet.";
      default:
        return "Erro ao fazer login. Tente novamente.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Preencha todos os campos.");
      return;
    }

    // ✅ Validação adicional de formato de e-mail
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Digite um e-mail válido.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        toast.error("Verifique seu e-mail antes de fazer login.");
        await auth.signOut();
        return;
      }

      toast.success("Login realizado com sucesso!");
      router.push("/");
    } catch (error: any) {
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        setPassword("");
        toast.error("Senha inválida. Tente novamente.");
        return;
      }

      if (error.code === "auth/user-not-found") {
        toast.error("Usuário não encontrado.");
        return;
      }

      toast.error(mapError(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: "url('/bg_login.png')" }}
    >
      <div
        className="
          relative flex flex-col justify-center items-center text-center
          w-96 h-[680px] sm:w-120 sm:h-[700px] md:w-120 md:h-[740px] lg:w-140 xl:h-[780px] 2xl:mr-10
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
            className="drop-shadow-md w-12 h-12 mt-6"
          />
        </div>

        <h1
          className={`${lexendExa.className} text-[#90416B] text-xl md:text-[26px] xl:text-[30px] font-semibold mt-2 mb-4 tracking-[0.3em]`}
        >
          AURORA
        </h1>

        {/* CONTEÚDO */}
        <p className="text-xl md:text-2xl xl:text-3xl text-[#3B3B3B] mt-6 font-semibold">
          Bem-vindo de volta!
        </p>
        <p className="text-sm sm:text-sm md:text-lg text-[#3B3B3B] mt-3 font-medium">
          Faça <span className="text-[#7B6294] font-bold italic">login</span> e comece <br /> ampliando seu horizonte.
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col mt-10 sm:mt-10 w-64 sm:w-96 gap-2"
        >
          {/* E-MAIL */}
          <div>
            <Label
              htmlFor="email"
              className="text-[13px] sm:text-[15px] text-left text-[#3B3B3B] ml-1"
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
          </div>

          {/* SENHA */}
          <div className="relative">
            <Label
              htmlFor="password"
              className="text-[13px] sm:text-[15px] text-left text-[#3B3B3B] ml-1"
            >
              Senha
            </Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="
                border-[#3B3B3B] border-2 text-[#3B3B3B] rounded-md
                text-[13px] sm:text-[15px] h-11 sm:h-12 w-full
                placeholder-[#3B3B3B]
                focus:outline-none shadow-none focus:ring-0 pr-10
              "
            />
            {/* Botão com ícone para alternar visibilidade */}
            <button
              type="button"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShowPassword((s) => !s)}
              className="cursor-pointer absolute right-3 top-8 sm:top-9 w-6 h-6 flex items-center justify-center text-[#3B3B3B] hover:text-[#90416B]"
            >
              {showPassword ? (
                <IoEyeOffOutline size={20} />
              ) : (
                <IoEyeOutline size={20} />
              )}
            </button>
          </div>


          <div className="w-full flex justify-end">
            <p className="text-xs sm:text-sm">
              Esqueceu sua senha?{" "}
              <span
                onClick={() => router.push("/reset-password")}
                className="text-[#7B6294] italic font-bold cursor-pointer hover:underline"
              >
                Lembrar-me
              </span>
            </p>
          </div>

          {/* BOTÃO LOGIN */}
          <Button
            type="submit"
            disabled={loading}
            className="
              mt-5 sm:mt-6 h-11 sm:h-12 bg-[#90416B] hover:bg-[#782F56] text-white font-medium rounded-md
               transition-all text-[15px] sm:text-[17px]
              cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? "Entrando..." : "Login"}
          </Button>
        </form>

        <p className="text-xs sm:text-sm md:text-md lg:text-md text-[#353535]/90 text-center mt-4 mb-6 leading-6 px-6 sm:px-12">
          Não tem uma conta?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-[#7B6294] italic font-bold cursor-pointer hover:underline"
          >
            Cadastre-se
          </span>
        </p>
      </div>
    </div>
  );
}
