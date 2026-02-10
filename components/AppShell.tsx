"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command, Menu, X, Monitor, Image as ImageIcon, Users } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/stage") return pathname?.startsWith("/stage");
    if (path === "/agents") return pathname?.startsWith("/agents");
    if (path === "/gallery") return pathname?.startsWith("/gallery");
    return pathname === path;
  };

  const navLinks = [
    { href: "/stage", label: "LAB_控制台", icon: <Monitor size={16} /> },
    { href: "/gallery", label: "成果_陈列馆", icon: <ImageIcon size={16} /> },
    { href: "/agents", label: "AGENT_配置", icon: <Users size={16} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col font-mono text-black bg-paper">
      <header className="sticky top-0 z-[100] w-full border-b-4 border-black bg-paper/90 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/" className="flex items-center gap-3 font-black text-xl tracking-tighter">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Command size={18} />
              </div>
              <span className="pixel-ch-text text-sm sm:text-xl">智研家 STAGE</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`hover:text-accent transition-colors ${isActive(link.href) ? "text-accent border-b-4 border-accent pb-1" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-1.5 border-2 border-black px-3 py-1 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px] font-black">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                GHOST_CONNECTED
             </div>
             
             {/* Mobile Menu Toggle */}
             <button 
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               className="lg:hidden p-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
             >
               {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-[68px] left-0 w-full bg-white border-b-4 border-black shadow-xl animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 border-2 border-black font-black text-xs uppercase transition-all ${isActive(link.href) ? "bg-accent text-white" : "bg-ink-50 hover:bg-ink-100"}`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 p-2 text-center border-2 border-black border-dashed text-[8px] font-black uppercase text-ink-400">
                Section 9 Mobile Access // Authenticated
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto">{children}</main>
    </div>
  );
};
