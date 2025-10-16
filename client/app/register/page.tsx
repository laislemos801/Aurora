'use client'
import Image from 'next/image';
import { useState } from 'react';
import { Lexend_Exa } from 'next/font/google';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Logo from "@/public/logo.png"
import EyeOpen from "@/public/eye_open.svg"
import EyeClosed from "@/public/eye_closed.svg"
import Group1 from "@/public/group1.svg"
import Group2 from "@/public/group2.png"
import Horizonte from "@/public/horizonte.png"

const lexendExa = Lexend_Exa({
  weight: '400',
  subsets: ['latin'],
});

export default function Register() {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen bg-no-repeat bg-center bg-cover bg-right flex items-center justify-center md:justify-end md:overflow-hidden"
      style={{ backgroundImage: "url('/bg.png')" }}
    >

      <div className="absolute top-0 left-0 z-20 hidden md:block">
        <Image
          src={Horizonte}
          alt="Imagem texto"
          width={330}
          height={330}
          className="object-contain px-2 lg:hidden"
        />
        <Image
          src={Horizonte}
          alt="Imagem texto"
          width={470}
          height={470}
          className="object-contain px-6 hidden lg:block 2xl:hidden"
        />

        <Image
          src={Horizonte}
          alt="Imagem texto"
          width={800}
          height={800}
          className="object-contain px-6 hidden 2xl:block"
        />
        <p className="text-[#FFB97C] text-xl font-semibold mt-1 px-2 leading-none lg:px-6 lg:text-2xl 2xl:text-3xl 2xl:px-30">
          <span className='italic'>de inovação</span> <br /> <span className='font-medium'>na integração</span>
        </p>
        <p className="text-[#C288B3] text-xl font-medium mt-1 px-2 leading-none text-center lg:px-6 lg:text-2xl 2xl:text-3xl 2xl:px-30">
          <span className='font-semibold text-[#4A4A4A]'>e no</span><span className='font-medium italic'> compartilhamento</span>
          <br></br><span className='italic'>de projetos.</span>
        </p>
      </div>

      <div className="absolute bottom-0 left-0 z-20 hidden md:block lg:hidden 2xl:hidden">
        <Image
          src={Group1}
          alt="Imagem grupo"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>

      <div className="absolute bottom-0 left-0 z-20 hidden lg:block 2xl:hidden">
        <Image
          src={Group1}
          alt="Imagem grupo"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>

      <div className="absolute bottom-0 left-0 z-20 hidden 2xl:block 2xl:px-6">
        <Image
          src={Group2}
          alt="Imagem grupo"
          width={900}
          height={900}
          className="object-contain"
        />
      </div>

      <div className="flex flex-col z-10">
        
        <div className="relative flex w-80 h-[550px] py-8 border border-white/40 bg-white/25 rounded-[40px] backdrop-blur-sm justify-center
        md:w-120 md:h-[650px] md:py-12 md:left-8 lg:w-160 xl:h-[700px] 2xl:w-180 2xl:h-[780px] 2xl:left-auto 2xl:mr-10 margin-3xl">

          <div className="absolute -top-18 left-1/2 -translate-x-1/2">
            <Image
              src={Logo}
              alt="Logo"
              width={120}
              height={120}
              className="w-33 h-33"
            />
          </div>
          <div className='flex flex-col 2xl:mt-4'>
            <h1 className={`${lexendExa.className} text-xl text-center text-[#90416B] md:text-[26px] xl:text-[30px]`}>AURORA</h1>
            <h1 className="text-2xl text-center text-[#614281] font-medium mt-2 md:text-3xl xl:text-4xl">Bem-vindo!</h1>
            <p className='text-[10px] text-white text-center px-6 font-light md:text-[12px] md:mt-2 xl:text-[13px] 2xl:text-[14px]'>
              Crie sua conta e faça parte do nascer de uma <br></br> <span className='font-medium italic'>nova forma</span> de integrar e compartilhar ideias.
            </p>
            <div className='flex flex-col gap-1 mt-4 px-4 md:gap-2 xl:gap-3 xl:mt-6 2xl:mt-9'>
                <div className="grid w-full max-w-sm items-center gap-1">
                    <Label htmlFor="nome" className='text-[11px] ml-1 text-[#7B6294] md:text-[12px] 2xl:text-[14px]'>Nome</Label>
                    <Input 
                    type="nome" 
                    id="nome" 
                    placeholder="Nome" 
                    className='border-[#7B6294] rounded-lg text-[11px] placeholder-[#7B6294] !placeholder-[#7B6294] 
                    focus:outline-none shadow-none focus:ring-0 md:text-[12px] md:w-75 lg:w-85 2xl:w-90'
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1">
                    <Label htmlFor="email" className='text-[11px] ml-1 text-[#7B6294] md:text-[12px] 2xl:text-[14px]'>Email</Label>
                    <Input 
                    type="email" 
                    id="email" 
                    placeholder="Email" 
                    className='border-[#7B6294] rounded-lg text-[11px] placeholder-[#7B6294] !placeholder-[#7B6294] 
                    focus:outline-none shadow-none focus:ring-0 md:text-[12px]'
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1">
                    <Label htmlFor="telefone" className='text-[11px] ml-1 text-[#7B6294] md:text-[12px] 2xl:text-[14px]'>Telefone</Label>
                    <Input 
                    type="number" 
                    id="telefone" 
                    placeholder="Telefone" 
                    className='border-[#7B6294] rounded-lg text-[11px] placeholder-[#7B6294] !placeholder-[#7B6294] 
                    focus:outline-none shadow-none focus:ring-0 md:text-[12px]'
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1">
                    <Label htmlFor="senha" className='text-[11px] ml-1 text-[#7B6294] md:text-[12px] 2xl:text-[14px]'>Data de Nascimento</Label>
                    <Input 
                    type="string" 
                    id="nascimento" 
                    placeholder="Data de Nascimento" 
                    className='border-[#7B6294] rounded-lg text-[11px] placeholder-[#7B6294] !placeholder-[#7B6294] 
                    focus:outline-none shadow-none focus:ring-0 md:text-[12px]'
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1">
                  <Label htmlFor="senha" className="text-[11px] ml-1 text-[#7B6294] md:text-[12px] 2xl:text-[14px]">
                    Senha
                  </Label>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="senha"
                      placeholder="Senha"
                      className="border-[#7B6294] rounded-lg text-[11px] placeholder-[#7B6294] !placeholder-[#7B6294] 
                      focus:outline-none shadow-none focus:ring-0 w-full pr-8 md:text-[12px]"
                    />

                    <Image
                      src={showPassword ? EyeClosed : EyeOpen}
                      alt="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer w-5 h-5"
                    />
                  </div>
                </div>
            </div>
            <div className='flex flex-col px-4 mt-4 gap-2 md:mt-6 md:gap-3'>
                <Button className='rounded-sm h-8 bg-[#C288B3] font-light md:text-[16px] md:h-8.5 2xl:h-9 2xl:text-[18px] 2xl:font-regular'>Cadastrar</Button>
                <p className='text-[10px] text-center font-medium md:text-[11px] xl:mt-1 2xl:text-[12px]'>Já tem uma conta? <span className='underline text-[#7B6294] font-semibold'>Login</span></p>
            </div>

          </div>
        
        </div>
      </div>
    </div>
  );
}
