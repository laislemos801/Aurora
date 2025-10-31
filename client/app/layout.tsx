import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "@/components/RootLayoutClient";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Aurora",
  description: "Gestão de Projeto Semestral Universitário",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
       <body className={montserrat.variable}>
            <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
