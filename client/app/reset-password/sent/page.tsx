'use client'

import Image from 'next/image'
import { Lexend_Exa } from 'next/font/google'
import { Button } from '@/components/ui/button'

const lexendExa = Lexend_Exa({
  weight: '400',
  subsets: ['latin'],
})

export default function EmailSent() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="relative flex flex-col w-[650px] h-[720px] border border-white/30 rounded-[35px] backdrop-blur-md bg-white/25 shadow-lg items-center text-center">
        
        {/* LOGO CIRCULAR */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <Image
            src="/logo_original.png"
            alt="Logo Aurora"
            width={110}
            height={110}
            quality={100}
            className="drop-shadow-md"
          />
        </div>

        {/* TÍTULOS */}
        <h1 className={`${lexendExa.className} text-[#90416B] text-[36px] font-semibold mt-12 tracking-widest`}>
          AURORA
        </h1>

        <Image
          src="/closed_lock.png"
          alt="Ícone E-mail enviado"
          width={110}
          height={110}
          className="mt-5"
        />

        <h2 className="text-[38px] text-[#614281] font-semibold mt-4">
          E-mail enviado!
        </h2>

        <p className="text-[18px] text-[#614281]/90 mt-4 leading-6 px-12">
          Verifique sua <span className="italic font-semibold">caixa de mensagens</span> ou <span className="italic font-semibold">spam</span>, 
          para redefinir sua senha.
        </p>

        {/* BOTÃO */}
        <div className="mt-16">
          <Button
            className="w-[280px] h-12 bg-[#C288B3] text-white font-medium rounded-md hover:bg-[#b676a2] transition-all text-[17px]"
            onClick={() => window.location.href = '/login'}
          >
            Voltar para o Login
          </Button>
        </div>

        {/* PERSONAGENS */}
        <div className="absolute bottom-0 w-full flex justify-center">
          <Image
            src="/people.png"
            alt="Personagens Aurora"
            width={500}
            height={130}
            quality={100}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}
