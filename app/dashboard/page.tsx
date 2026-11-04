"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import WorkspaceShell from "../../components/WorkspaceShell";

const documents = [
  { id: 1, title: "Sachangwani Settlement Scheme", type: "Map", location: "Nakuru County", date: "2023-10-12" },
  { id: 2, title: "Kisumu County Integrated Development Plan (CIDP)", type: "Report", location: "Kisumu County", date: "2024-01-15" },
  { id: 3, title: "Ahero Flood Vulnerability Brief", type: "Planning Brief", location: "Ahero", date: "2026-02-10" },
  { id: 4, title: "Nairobi Road Corridor Topo Survey", type: "Map", location: "Nairobi", date: "2025-11-05" },
];

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserEmail(user.email ?? "Authenticated user");
    });
  }, [router]);

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = activeCategory === "All" || doc.type === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || `${doc.title} ${doc.type} ${doc.location}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (!userEmail) return <div className="min-h-screen bg-gray-50 p-8 text-gray-500">Verifying secure session...</div>;

  return (
    <WorkspaceShell userEmail={userEmail} onSignOut={handleLogout}>
      <main className="min-h-[calc(100vh-4rem)] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5">
          <section className="flex flex-col justify-between gap-4 border-b border-[#dbe3eb] pb-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#006194]">National spatial data infrastructure</p>
              <h1 className="text-2xl font-bold tracking-tight text-[#0b1c30]">Dataset catalogue</h1>
              <p className="mt-1 max-w-2xl text-sm text-[#526174]">Browse map layers, planning briefs, and shared records in your workspace.</p>
            </div>
            <Link href="/dashboard/upload" className="inline-flex h-9 items-center justify-center rounded bg-[#006194] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#00527c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]">
              Upload or request data
            </Link>
          </section>

          <section aria-label="Catalogue summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Catalogue records", value: documents.length, detail: "Available in this workspace" },
              { label: "Map layers", value: documents.filter((doc) => doc.type === "Map").length, detail: "Open in spatial viewer" },
              { label: "Documents & briefs", value: documents.filter((doc) => doc.type !== "Map").length, detail: "Open record details" },
              { label: "Current results", value: filteredDocs.length, detail: "Matches your search and filters" },
            ].map((stat) => (
              <div key={stat.label} className="border border-[#dbe3eb] bg-white px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#64748b]">{stat.label}</p>
                <div className="mt-1 flex items-baseline justify-between gap-2">
                  <span className="text-2xl font-bold tabular-nums text-[#0b1c30]">{stat.value}</span>
                  <span className="hidden text-[10px] text-[#718096] xl:inline">{stat.detail}</span>
                </div>
              </div>
            ))}
          </section>

          <section className="overflow-hidden border border-[#dbe3eb] bg-white">
            <div className="flex flex-col gap-4 border-b border-[#e2e8f0] p-4 sm:p-5">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="text-sm font-bold text-[#0b1c30]">Available spatial records</h2>
                  <p className="mt-1 text-xs text-[#64748b]">Search by title, record type, or location.</p>
                </div>
                <label className="block w-full md:max-w-sm">
                  <span className="sr-only">Search spatial records</span>
                  <input
                    type="search"
                    placeholder="Search datasets and locations"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="h-9 w-full rounded border border-[#cbd5e1] bg-[#f8fafc] px-3 text-xs text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]"
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by record type">
                {["All", "Map", "Report", "Planning Brief", "Statutory Land Doc"].map((category) => (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0284c7] ${activeCategory === category ? "bg-[#006194] text-white" : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"}`}
                  >
                    {category === "All" ? "All records" : category}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#cbd5e1] bg-[#f1f5f9] text-[10px] uppercase tracking-wide text-[#526174]">
                    <th scope="col" className="px-4 py-3 font-semibold">Dataset / document</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Type</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Location</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Updated</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-xs text-[#334155]">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="transition-colors odd:bg-white even:bg-[#fbfcfe] hover:bg-[#eff8fd]">
                      <td className="px-4 py-3.5">
                        <span className="block font-semibold text-[#0f172a]">{doc.title}</span>
                        <span className="mt-1 block font-mono text-[10px] text-[#718096]">Record ID {String(doc.id).padStart(4, "0")}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex rounded border border-[#d5e7f2] bg-[#eff8fd] px-2 py-1 text-[10px] font-semibold text-[#00527c]">{doc.type}</span>
                      </td>
                      <td className="px-4 py-3.5">{doc.location}</td>
                      <td className="px-4 py-3.5 font-mono text-[11px] tabular-nums text-[#526174]">{doc.date}</td>
                      <td className="px-4 py-3.5 text-right">
                        {doc.type === "Map" ? (
                          <Link href={`/dashboard/map-viewer?id=${doc.id}`} className="inline-flex rounded border border-[#b8d8e9] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#00527c] hover:bg-[#eaf5fb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]">Open map</Link>
                        ) : (
                          <Link href={`/dashboard/document-viewer?id=${doc.id}`} className="inline-flex rounded border border-[#b8d8e9] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#00527c] hover:bg-[#eaf5fb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]">View record</Link>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredDocs.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-[#64748b]">No records match the current search and filter.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-[#e2e8f0] bg-[#f8fafc] px-4 py-2.5 text-[10px] text-[#64748b]">
              <span>Showing {filteredDocs.length} of {documents.length} records</span>
              <span className="font-mono">Spatial data catalogue</span>
            </div>
          </section>
        </div>
      </main>
    </WorkspaceShell>
  );
}
