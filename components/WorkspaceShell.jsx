"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../app/lib/supabase";

const navigation = [
  { label: "Dashboard & Mesh", href: "/dashboard", section: "governance" },
  { label: "Upload & Exchange", href: "/dashboard/upload", section: "governance" },
  { label: "Raster Digitizer", href: "/dashboard/map-viewer?id=4", section: "tools" },
];

/** @param {{ children: import("react").ReactNode, userEmail?: string, onSignOut?: () => void | Promise<void>, compact?: boolean }} props */
export default function WorkspaceShell({ children, userEmail = "", onSignOut = null, compact = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUserEmail, setCurrentUserEmail] = useState(userEmail);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (active) setCurrentUserEmail(userEmail || user?.email || "");
    });
    return () => { active = false; };
  }, [userEmail]);

  const handleSignOut = onSignOut ?? (async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  });

  return (
    <div className="min-h-screen bg-[#f3f6fa] font-sans text-[#0b1c30]">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#cbd5e1] bg-white px-4 sm:px-6">
        <Link href={currentUserEmail ? "/dashboard" : "/"} className="flex min-w-0 items-center gap-3" aria-label="Sovereign Spatial home">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#006194] text-[10px] font-bold tracking-wide text-white">KE</span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-bold uppercase tracking-wide text-[#0b1c30] sm:text-sm">Sovereign Spatial</span>
            <span className="hidden text-[11px] text-[#64748b] sm:block">Republic of Kenya National GIS Data Mesh</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <span className="hidden items-center gap-2 rounded border border-[#d6e8df] bg-[#f0f8f3] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#28704c] sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0d9488]" />
            Spatial workspace
          </span>
          {currentUserEmail && <span className="hidden max-w-48 truncate text-xs text-[#475569] lg:block">{currentUserEmail}</span>}
          {currentUserEmail ? (
            <button onClick={handleSignOut} className="rounded border border-[#cbd5e1] px-3 py-1.5 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#f1f5f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]">
              Sign out
            </button>
          ) : (
            <Link href="/login" className="rounded border border-[#cbd5e1] px-3 py-1.5 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#f1f5f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]">
              Sign in
            </Link>
          )}
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className={`hidden shrink-0 flex-col border-r border-[#cbd5e1] bg-white md:flex ${compact ? "w-14 lg:w-60" : "w-60 lg:w-64"}`}>
          <div className={`flex-1 py-5 ${compact ? "px-2 lg:px-3" : "px-3"}`}>
            <p className={`mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b8b9b] ${compact ? "hidden lg:block" : ""}`}>Spatial mesh governance</p>
            <nav aria-label="Primary navigation" className="flex flex-col gap-1">
              {navigation.filter((item) => item.section === "governance").map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} aria-label={compact ? item.label : undefined} title={compact ? item.label : undefined} className={`flex items-center gap-3 rounded px-3 py-2.5 text-xs transition-colors ${active ? "border-l-2 border-[#0284c7] bg-[#eaf5fb] font-semibold text-[#00527c]" : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#0284c7]" : "bg-[#94a3b8]"}`} />
                    <span className={compact ? "hidden lg:inline" : ""}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <p className={`mb-2 mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b8b9b] ${compact ? "hidden lg:block" : ""}`}>Spatial tools</p>
            <nav aria-label="Spatial tools" className="flex flex-col gap-1">
              {navigation.filter((item) => item.section === "tools").map((item) => {
                const active = pathname === "/dashboard/map-viewer";
                return (
                  <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} aria-label={compact ? item.label : undefined} title={compact ? item.label : undefined} className={`flex items-center gap-3 rounded px-3 py-2.5 text-xs transition-colors ${active ? "border-l-2 border-[#0284c7] bg-[#eaf5fb] font-semibold text-[#00527c]" : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#0284c7]" : "bg-[#94a3b8]"}`} />
                    <span className={compact ? "hidden lg:inline" : ""}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className={`border-t border-[#e2e8f0] bg-[#f8fafc] p-4 ${compact ? "hidden lg:block" : ""}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#64748b]">Current section</p>
            <p className="mt-1 truncate text-xs font-semibold text-[#334155]">{pathname.startsWith("/dashboard/upload") ? "Data exchange" : pathname.startsWith("/dashboard/map-viewer") ? "Raster digitizer" : "Dataset catalogue"}</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <nav aria-label="Primary navigation" className="flex gap-1 overflow-x-auto border-b border-[#cbd5e1] bg-white px-3 py-2 md:hidden">
            {navigation.map((item) => {
              const active = item.section === "tools" ? pathname === "/dashboard/map-viewer" : pathname === item.href;
              return (
                <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`shrink-0 rounded px-3 py-2 text-xs font-medium ${active ? "bg-[#eaf5fb] text-[#00527c]" : "text-[#475569] hover:bg-[#f1f5f9]"}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {children}
        </div>
      </div>
    </div>
  );
}