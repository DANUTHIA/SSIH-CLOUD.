import Link from 'next/link';

const portalOptions = [
  {
    id: 'professional',
    title: 'High-Access Professionals & Organisations',
    shortLabel: 'Institutional access',
    href: '/login?portal=professional',
  },
  {
    id: 'student',
    title: 'Students',
    shortLabel: 'Academic access',
    href: '/login?portal=student',
  },
];

function GisIllustration() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#dbe3eb] bg-[#edf7ff] p-2 shadow-sm">
      <div className="relative h-36 overflow-hidden rounded-lg border border-[#d4e7f7] bg-[#dfeffb]">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
          alt="GIS mapping and terrain overview"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/30 via-transparent to-white/10" />
        <div className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/80 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#006194]">
          GIS map
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3f6fa] text-[#0b1c30]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45"
        style={{
          backgroundImage: "url('/Gemini_Generated_Image_ymun4iymun4iymun.jfif')",
        }}
      />
      <div className="absolute inset-0 bg-[#f3f6fa]/35" />

      <header className="relative z-10 flex h-16 items-center justify-between border-b border-[#cbd5e1] bg-white/80 px-5 backdrop-blur-sm sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-[#006194] text-[10px] font-bold tracking-wide text-white">KE</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide">Sovereign Spatial</p>
            <p className="hidden text-[11px] text-[#64748b] sm:block">Republic of Kenya National GIS Data Mesh</p>
          </div>
        </div>
        <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#28704c]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0d9488]" />
          Secure access gateway
        </span>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-8 px-5 py-8 md:grid-cols-[1fr_0.92fr] md:px-6">
        <section className="max-w-xl py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#006194]">National spatial data infrastructure</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Sovereign Spatial Intelligence Hub</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-[#526174]">A secure workspace for discovering spatial records, coordinating data requests, and digitizing raster maps.</p>
          <div className="mt-8 grid gap-2 border-y border-[#dbe3eb] py-4 sm:grid-cols-3">
            {[
              ["01", "Dataset catalogue"],
              ["02", "Data exchange"],
              ["03", "Raster digitizing"],
            ].map(([number, label]) => (
              <div key={number} className="flex items-center gap-2.5 py-1">
                <span className="font-mono text-[10px] text-[#006194]">{number}</span>
                <span className="text-xs font-medium text-[#334155]">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/signup" className="inline-flex h-11 items-center justify-center rounded bg-[#006194] px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#00527c]">
              Create account
            </Link>
            <Link href="/login" className="inline-flex h-11 items-center justify-center rounded border border-[#cbd5e1] bg-white px-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#00527c] transition-colors hover:bg-[#f8fbff]">
              Sign in
            </Link>
          </div>
        </section>

        <section className="w-full max-w-xl justify-self-center rounded-xl border border-[#dbe3eb] bg-white/85 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-[#e2e8f0] pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#006194]">Portal access</p>
              <h2 className="mt-1 text-lg font-bold">Choose your access route</h2>
            </div>
            <span className="rounded border border-[#b8d8e9] bg-[#eff8fd] px-2 py-1 text-[10px] font-semibold uppercase text-[#00527c]">KE-MESH</span>
          </div>

          <div className="mb-5">
            <GisIllustration />
          </div>

          <div className="space-y-4">
            {portalOptions.map((portal) => (
              <Link
                key={portal.id}
                href={portal.href}
                className="block rounded-xl border border-[#dbe3eb] bg-[#f8fbff] p-4 transition-colors hover:border-[#b8d8e9] hover:bg-[#f2f9ff]"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#006194]">{portal.shortLabel}</p>
                <h3 className="mt-2 text-xl font-bold text-[#0f172a]">{portal.title}</h3>
                <span className="mt-4 inline-flex h-10 items-center justify-center rounded bg-[#006194] px-4 text-xs font-semibold text-white">
                  Continue
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}