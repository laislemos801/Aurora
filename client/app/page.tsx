"use client";
import { useEffect, useState } from "react";
import PageDesktop from "./page-desktop";
import PageMobile from "./page-mobile";

export default function Page() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <PageMobile /> : <PageDesktop />;
}