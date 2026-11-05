"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";

const portalConfig = {
  professional: {
    label: "High-Access Professionals & Organisations",
    shortLabel: "Institutional portal",
    description: "Access secure datasets, manage institutional workflows, and coordinate geospatial exchange requests.",
    accent: "Institutional access",
  },
  student: {
    label: "Students",
    shortLabel: "Student portal",
    description: "Access teaching resources, approved datasets, and learning-focused spatial tools for academic use.",
    accent: "Academic access",
  },
} as const;

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPortal = searchParams.get("portal") === "student" ? "student" : "professional";
  const portal = portalConfig[selectedPortal];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/dashboard");
    });
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!supabase) {
      setError("Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      setIsSubmitting(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setIsSubmitting(false);
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3f6fa] text-[#0b1c30]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage: "url('/Gemini_Generated_Image_ymun4iymun4iymun.jfif')",
        }}
      />
      <div className="absolute inset-0 bg-[#f3f6fa]/35" />

      <header className="relative z-10 flex h-16 items-center justify-between border-b border-[#cbd5e1] bg-white/80 px-5 backdrop-blur-sm sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Sovereign Spatial home">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-[#006194] text-[10px] font-bold tracking-wide text-white">KE</span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-wide">Sovereign Spatial</span>
            <span className="hidden text-[11px] text-[#64748b] sm:block">Republic of Kenya National GIS Data Mesh</span>
          </span>
        </Link>
        <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#28704c]"><span className="h-1.5 w-1.5 rounded-full bg-[#0d9488]" /> Secure gateway</span>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-10 px-5 pb-10 pt-8 md:grid-cols-[1fr_420px] md:px-8 lg:gap-12">
        <section className="max-w-lg pl-0 md:pl-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#006194]">Republic of Kenya · KNSDI Portal</p>
          <h1 className="mt-3 text-3xl font-bold leading-[0.95] tracking-tight sm:text-5xl">{portal.label}</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#526174]">{portal.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <span className="rounded border border-[#b8d8e9] bg-white/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#00527c]">{portal.accent}</span>
            <Link href="/" className="text-[11px] font-semibold text-[#006194] hover:text-[#00527c]">Change portal</Link>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="w-full rounded-md border border-[#dbe3eb] bg-white/85 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#006194]">Portal access</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0f172a]">Sign in to your {selectedPortal === "student" ? "student" : "professional"} account</h2>
          <p className="mt-2 text-xs text-[#64748b]">Enter your registered email and password.</p>

          <div className="mt-6">
            <label className="mb-1.5 block text-xs font-semibold text-[#334155]" htmlFor="email">Email address</label>
            <input id="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-10 w-full rounded border border-[#cbd5e1] bg-white px-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]" placeholder={selectedPortal === "student" ? "name@student.ac.ke" : "name@organization.go.ke"} />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold text-[#334155]" htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="h-10 w-full rounded border border-[#cbd5e1] bg-white px-3 text-sm text-[#0f172a] focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]" />
          </div>

          {error && <p className="mt-4 border-l-2 border-[#dc2626] bg-[#fef2f2] px-3 py-2 text-xs text-[#991b1b]" role="alert">{error}</p>}

          <button type="submit" disabled={isSubmitting} className="mt-6 h-11 w-full rounded bg-[#006194] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#00527c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? "Signing in..." : `Sign in to ${selectedPortal === "student" ? "student" : "professional"} portal`}
          </button>

          <div className="mt-4 flex items-center justify-between border-t border-[#e2e8f0] pt-4 text-[11px] text-[#64748b]">
            <span>Need an account?</span>
            <Link href="/signup" className="font-semibold text-[#006194] hover:text-[#00527c]">Create one</Link>
          </div>

          <p className="mt-4 text-[10px] leading-4 text-[#718096]">Access is verified by the identity provider and database policies.</p>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#f3f6fa] text-[#0b1c30]">
        <div className="flex min-h-screen items-center justify-center px-5">
          <div className="rounded border border-[#dbe3eb] bg-white px-6 py-4 text-sm font-medium text-[#334155]">
            Loading portal...
          </div>
        </div>
      </main>
    }>
      <LoginPageContent />
    </Suspense>
  );
}