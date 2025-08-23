"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Toaster } from "@/components/ui/toaster";

export type Lang = "en" | "tr";
export const LanguageContext = createContext<Lang>("en");

export function useLanguage() {
  return useContext(LanguageContext);
}

function getInitialLang(): Lang {
  if (typeof window === "undefined") {
    return "en";
  }
  const l = window.localStorage.getItem("lang");
  return l === "tr" ? "tr" : "en";
}

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(getInitialLang());
    const onChange = (e: any) => setLang(e.detail?.lang === "tr" ? "tr" : "en");
    window.addEventListener("lang-change", onChange as any);
    return () => window.removeEventListener("lang-change", onChange as any);
  }, []);

  return (
    <LanguageContext.Provider value={lang}>
        {/*
      <header className="border-b bg-background text-foreground">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="Logo" className="h-8 w-8" />
            <span className="text-2xl font-bold">QR Kafem</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            {/* Add ThemeToggle, navigation, etc. here if needed */}{/*
          </div>
        </div>
      </header> */}
      <main className="min-h-[80vh]">{children}</main>
      <footer className="border-t bg-background text-muted-foreground py-4 text-center">
        &copy; {new Date().getFullYear()} QR Kafem
      </footer>
      <Toaster />
    </LanguageContext.Provider>
  );
}
