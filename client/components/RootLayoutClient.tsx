"use client";

import ToolBarLeft from "@/components/toolBar/left";
import ToolBarTop from "@/components/toolBar/top";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function RootLayoutClient({ children }: Props) {
  const pathname = usePathname();
  const showToolBar = ["/login", "/register", "/reset-password"].includes(
    pathname
  );

  return (
    <main className="w-full h-screen flex bg-[#FCF3FA]">
      {!showToolBar && (
        <div className="h-full w-1/15">
          {" "}
          <ToolBarLeft />
        </div>
      )}
      <div className="flex flex-col w-full">
        {!showToolBar && (
          <div className="w-12/12 h-1/9">
            <ToolBarTop />
          </div>
        )}
        <div className="w-12/12 h-full">{children}</div>
      </div>
    </main>
  );
}
