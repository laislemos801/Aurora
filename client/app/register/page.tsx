'use client'
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { Lexend_Exa } from 'next/font/google';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { auth, db } from '@/firebase/clientApp';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, reload } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import toast from 'react-hot-toast';


const lexendExa = Lexend_Exa({
  weight: '400',
  subsets: ['latin'],
});

export default function Register() {

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    nascimento: '',
    senha: '',
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "telefone") {
      let digits = e.target.value.replace(/\D/g, "");

      if (digits.length === 0) {
        setFormData({ ...formData, telefone: "" });
        return;
      }

      if (digits.length > 11) digits = digits.slice(0, 11);

      let formatted = "";
      if (digits.length < 3) {
        formatted = `(${digits}`;
      } else if (digits.length < 7) {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      } else if (digits.length <= 10) {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      } else {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
      }

      setFormData({ ...formData, telefone: formatted });
      return;
    }

    if (id === "nascimento") {
      let digits = e.target.value.replace(/\D/g, "");

      if (digits.length > 8) digits = digits.slice(0, 8);

      let formatted = "";
      if (digits.length <= 2) {
        formatted = digits;
      } else if (digits.length <= 4) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      } else {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
      }

      setFormData({ ...formData, nascimento: formatted });
      return; 
    }

    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const { nome, email, telefone, nascimento, senha } = formData;
    const newErrors: { [key: string]: string } = {};

    if (!nome || nome.trim().length < 3) {
      newErrors.nome = "O nome deve ter pelo menos 3 caracteres.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Digite um e-mail válido.";
    }

    const digits = telefone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 11) {
      newErrors.telefone = "Digite um telefone válido (com DDD).";
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(nascimento)) {
      newErrors.nascimento = "Digite a data de nascimento no formato dd/mm/aaaa.";
    } else {
      const [dia, mes, ano] = nascimento.split("/").map(Number);
      const data = new Date(ano, mes - 1, dia);
      if (data > new Date() || ano < 1900) {
        newErrors.nascimento = "Digite uma data de nascimento válida.";
      }
    }

    if (senha.length < 8) {
      newErrors.senha = "A senha deve ter pelo menos 8 caracteres.";
    }

    setErrors(newErrors);
    setError(Object.values(newErrors)[0] || "");
    
    return Object.keys(newErrors).length === 0;
  };


  const handleRegister = async () => {
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.senha
      );
  
      const user = userCredential.user;
  
      await updateProfile(user, { displayName: formData.nome });
  
      await sendEmailVerification(user);

       // Usa imagem padrão do public
      const defaultProfilePicture = "/account_circle.png";
  
      await setDoc(doc(db, "Professores", user.uid), {
        uid: user.uid,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        nascimento: formData.nascimento,
        profilePicture: defaultProfilePicture,
        createdAt: new Date(),
      });
  
      toast.success("Conta criada! Enviamos um link de verificação para seu e-mail.");
  
      setFormData({ nome: '', email: '', telefone: '', nascimento: '', senha: '' });
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este e-mail já está cadastrado.");
      } else if (err.code === 'auth/invalid-email') {
        setError("E-mail inválido. Verifique e tente novamente.");
      } else if (err.code === 'auth/weak-password') {
        setError("A senha deve ter pelo menos 8 caracteres.");
      } else {
        setError("Erro ao cadastrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex flex-col md:flex-row bg-white">
    {/* Lado esquerdo com imagem de fundo */}
    <div
      className="hidden md:flex w-1/2 bg-cover bg-center rounded-tr-[24px] rounded-br-[24px] overflow-hidden flex-col justify-between"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      {/* LOGO */}
      <div className="flex flex-row items-center gap-3 mt-6 ml-8">
        <Image
          src="/logo aurora em svg.svg"
          alt="Logo Aurora"
          width={48}
          height={48}
          className="drop-shadow-md"
        />
        <h1
          className={`${lexendExa.className} text-[#90416B] text-xl md:text-[26px] xl:text-[30px] font-semibold tracking-[0.3em]`}>
          AURORA
        </h1>
      </div>

      {/* Texto “Um horizonte” fixo no rodapé do lado esquerdo */}
      <div className="ml-8 mb-16">
        <h2 className="text-[#7B6294] text-[28px] font-semibold -mb-2">Um horizonte</h2>
        <h2 className="text-[#3B3B3B] text-[18px] font-medium -mb-2"><span className="font-semibold italic">de inovação</span> na integração e no</h2>
        <h2 className="text-[#90416B] text-[20px] font-semibold italic -mb-2">compartilhamento de projetos.</h2>
      </div>
    </div>

      {/* Lado direito com fundo branco (sempre visível) */}
      <div className="flex flex-col w-full md:w-1/2 items-center justify-center pt-28 md:pt-6">
        <div className=" flex flex-col items-center justify-center">
          <div className=" flex flex-col items-center justify-center w-full py-12 md:py-12 2xl:left-auto">

            {/* Logo central no mobile */}
            <div className=" flex flex-col justify-start items-center">
              <Image
                src="/logo aurora em svg.svg"
                alt="Logo Aurora"
                width={80}
                height={80}
                className="w-16 h-16"
              />
            </div>

            <div className="flex flex-col" >
              <h1 className="text-2xl text-center text-[#3B3B3B] font-semibold mt-1 md:text-3xl xl:text-4xl">
                Crie uma conta
              </h1>
              <p className='text-[10px] text-[#3B3B3B] text-center px-6 font-medium md:text-[12px] md:mt-1 xl:text-[13px] 2xl:text-[14px] mb-4'>
                Crie sua conta e faça parte da <br />
                <span className='text-[#7B6294] font-semibold italic'>nova forma</span> de integrar e compartilhar ideias.
              </p>

              {/* Inputs */}
              <div className='flex flex-col gap-1 mt-4 px-2 sm:px-4 md:gap-2 xl:gap-2 xl:mt-4 w-96'>
                {/* Nome */}
                <div className="grid w-full max-w-sm items-center gap-1">
                  <Label htmlFor="nome" className='text-[11px] ml-1 text-[#3B3B3B] md:text-[12px] 2xl:text-[14px]'>
                    Nome
                  </Label>
                  <Input
                    type="text"
                    id="nome"
                    onChange={handleChange}
                    value={formData.nome}
                    placeholder="Nome"
                    className={`border-[#3B3B3B] rounded-lg text-[11px] placeholder-[#3B3B3B]
                    focus:outline-none shadow-none focus:ring-0 md:text-[12px]
                    ${errors.nome ? "border-red-500" : "border-[#3B3B3B]"}`}
                  />
                </div>

                {/* Email */}
                <div className="grid w-full max-w-sm items-center gap-1">
                  <Label htmlFor="email" className='text-[11px] ml-1 text-[#3B3B3B] md:text-[12px] 2xl:text-[14px]'>Email</Label>
                  <Input
                    type="email"
                    id="email"
                    onChange={handleChange}
                    value={formData.email}
                    placeholder="Email"
                    className={`border-[#3B3B3B] rounded-lg text-[11px] placeholder-[#3B3B3B]
                    focus:outline-none shadow-none focus:ring-0 md:text-[12px]
                    ${errors.email ? "border-red-500" : "border-[#3B3B3B]"}`}
                  />
                </div>

                {/* Telefone */}
                <div className="grid w-full max-w-sm items-center gap-1">
                  <Label htmlFor="telefone" className='text-[11px] ml-1 text-[#3B3B3B] md:text-[12px] 2xl:text-[14px]'>Telefone</Label>
                  <Input
                    type="text"
                    id="telefone"
                    onChange={handleChange}
                    value={formData.telefone}
                    placeholder="Telefone"
                    className={`border-[#3B3B3B] rounded-lg text-[11px] placeholder-[#3B3B3B]
                    focus:outline-none shadow-none focus:ring-0 md:text-[12px]
                    ${errors.telefone ? "border-red-500" : "border-[#3B3B3B]"}`}
                  />
                </div>

                {/* Nascimento */}
                <div className="grid w-full max-w-sm items-center gap-1">
                  <Label htmlFor="nascimento" className='text-[11px] ml-1 text-[#3B3B3B] md:text-[12px] 2xl:text-[14px]'>
                    Data de Nascimento
                  </Label>
                  <Input
                    type="text"
                    id="nascimento"
                    onChange={handleChange}
                    value={formData.nascimento}
                    placeholder="Data de Nascimento"
                    className={`border-[#3B3B3B] rounded-lg text-[11px] placeholder-[#3B3B3B]
                    focus:outline-none shadow-none focus:ring-0 md:text-[12px]
                    ${errors.nascimento ? "border-red-500" : "border-[#3B3B3B]"}`}
                  />
                </div>

                {/* Senha */}
                <div className="grid w-full max-w-sm items-center gap-1 mb-6">
                  <Label htmlFor="senha" className="text-[11px] ml-1 text-[#3B3B3B] md:text-[12px] 2xl:text-[14px]">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="senha"
                      onChange={handleChange}
                      value={formData.senha}
                      placeholder="Senha"
                      className={`border-[#3B3B3B] rounded-lg text-[11px] placeholder-[#3B3B3B]
                      focus:outline-none shadow-none focus:ring-0 w-full pr-8 md:text-[12px]
                      ${errors.senha ? "border-red-500" : "border-[#3B3B3B]"}`}
                    />
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#3B3B3B] hover:text-[#90416B] transition"
                    >
                      {showPassword ? (
                        <IoEyeOffOutline size={20} />
                      ) : (
                        <IoEyeOutline size={20} />
                      )}
                    </div>
                  </div>
                  {/* Mensagem abaixo do input */}
                  <p className="text-xs text-start pt-1 text-[#8C8C8C]">
                    Sua senha deve conter 8 ou mais caracteres.
                  </p>
                </div>
              </div>

              {/* Botões */}
              <div className='flex flex-col px-4 mt-4 gap-2 md:mt-6 md:gap-3'>
                <Button
                  className='rounded-sm h-10 bg-[#90416B] text-xl hover:bg-[#782F56] font-medium md:text-[18px] cursor-pointer md:h-10 2xl:h-10 2xl:text-[20px] 2xl:font-semibold'
                  disabled={loading}
                  onClick={handleRegister}
                >
                  {loading ? "Cadastrando..." : "Cadastrar"}
                </Button>
                {error && (
                  <p className='text-[11px] text-center text-red-500 font-medium'>
                    {error}
                  </p>
                )}
                <p className='text-[10px] text-center font-medium md:text-[11px] xl:mt-1 2xl:text-[12px] gap-2'>
                  Já tem uma conta? 
                  <span
                    onClick={() => router.push("/login")}
                    className="text-[#7B6294] italic font-bold cursor-pointer hover:underline">
                    Login
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
