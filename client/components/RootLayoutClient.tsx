"use client";

import ToolBarLeft from "@/components/toolBar/left";
import ToolBarTop from "@/components/toolBar/top";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function RootLayoutClient({ children }: Props) {
  const pathname = usePathname();
  const showToolBar = ["/login", "/register", "/reset-password", "/auth/action"].includes(
    pathname
  );

  if (showToolBar) {
    return <main className="w-full h-screen bg-[#FCF3FA]">{children}</main>;
  }

  return (
    <main className="w-full h-screen flex bg-[#FCF3FA] overflow-hidden">
      {!showToolBar && (
        <div className="h-full w-3 sm:w-20 xl:w-22 2xl:w-26">
          {" "}
          <ToolBarLeft />
        </div>
      )}
      <div className="flex flex-col w-full">
        {!showToolBar && (
          <div className="">
            <ToolBarTop />
          </div>
        )}
        <div
          className="w-full h-full bg-white pt-8 pl-8 mt-2 rounded-tl-[20px] sm:rounded-tl-[40px]
          xl:rounded-tl-[50px] shadow-[0_4px_12px_rgba(0,0,0,0.15),0_-4px_2px_rgba(0,0,0,0.01)]"
        >
          {children}
        </div>
      </div>
    </main>
  );
}
