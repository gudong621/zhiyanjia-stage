"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command, CreditCard, User, Menu, X, Image as ImageIcon } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { useAuth } from "./AuthProvider";

// Re-writing AppShell with Gallery Link
interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const { user, supabase, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/stage") return pathname?.startsWith("/stage");
    if (path === "/agents") return pathname?.startsWith("/agents");
    if (path === "/gallery") return pathname?.startsWith("/gallery");
    return pathname === path;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col font-mono text-black bg-paper">
      <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-paper/90 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 font-black text-xl tracking-tighter">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Command size={18} />
              </div>
              <span className="pixel-ch-text">智研家 STAGE</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase">
              <Link href="/stage" className={`hover:text-accent transition-colors ${isActive("/stage") ? "text-accent border-b-4 border-accent pb-1" : ""}`}>LAB_控制台</Link>
              <Link href="/gallery" className={`hover:text-accent transition-colors ${isActive("/gallery") ? "text-accent border-b-4 border-accent pb-1" : ""}`}>成果_陈列馆</Link>
              <Link href="/agents" className={`hover:text-accent transition-colors ${isActive("/agents") ? "text-accent border-b-4 border-accent pb-1" : ""}`}>AGENT_配置</Link>
            </nav>
          </div>

          <div className="hidden sm:flex items-center gap-4">
             <div className="flex items-center gap-1.5 border-2 border-black px-3 py-1 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px] font-black">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                GHOST_CONNECTED
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto">{children}</main>
    </div>
  );
};
