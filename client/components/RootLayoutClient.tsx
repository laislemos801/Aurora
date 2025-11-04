"use client";

import ToolBarLeft from "@/components/toolBar/left";
import ToolBarTop from "@/components/toolBar/top";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

interface Props {
  children: React.ReactNode;
}

export default function RootLayoutClient({ children }: Props) {
  const pathname = usePathname();
  const showToolBar = ["/login", "/register", "/reset-password"].includes(
    pathname
  );

  if (showToolBar) {
    return (
      <main className="w-full h-screen bg-[#FCF3FA]">
        {children}
        {/* Toaster para notificações */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 2000,
            style: {
              background: "#C288B3",
              color: "#FCF3FA",
              fontWeight: "400",
            },
          }}
        />
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen flex bg-[#FCF3FA]">
      {!showToolBar && (
        <div className="h-full w-3 sm:w-20 xl:w-22 2xl:w-26">
          <ToolBarLeft />
        </div>
      )}
      <div className="flex flex-col w-full">
        {!showToolBar && <ToolBarTop />}
        <div
          className="w-full h-full bg-white pt-4 pl-3 mt-2 rounded-tl-[20px] sm:rounded-tl-[40px]
          xl:rounded-tl-[50px] shadow-[0_4px_12px_rgba(0,0,0,0.15),0_-4px_2px_rgba(0,0,0,0.01)] lg:pl-8 lg:pt-8
          2xl:pl-14"
        >
          {children}
          {/* Toaster para notificações */}
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 2000,
              style: {
                background: "#FCF3FA",
                color: "#C288B3",
                fontWeight: "400",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
