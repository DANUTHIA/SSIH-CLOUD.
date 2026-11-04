"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WorkspaceShell from "../../../components/WorkspaceShell";

const documents = {
  "2": { title: "Kisumu County Integrated Development Plan (CIDP)", type: "Report", location: "Kisumu County", date: "2024-01-15", author: "County Government", status: "Approved" },
  "3": { title: "Ahero Flood Vulnerability Brief", type: "Planning Brief", location: "Ahero", date: "2026-02-10", author: "Danuthia & Associates", status: "Under Review" },
};

function DocumentViewerContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const record = documents[id] || { title: "Statutory Land Document", type: "Form", location: "Unlinked", date: "N/A", author: "Unknown", status: "Pending" };

  const handleDownload = () => {
    const file = new Blob([JSON.stringify({ id, ...record }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `spatial-record-${id ?? "unknown"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <WorkspaceShell compact>
      <main className="min-h-[calc(100vh-4rem)] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
          <section className="flex min-h-[420px] flex-col border border-[#dbe3eb] bg-white lg:min-h-[calc(100vh-8rem)]">
            <header className="flex items-center justify-between gap-4 border-b border-[#e2e8f0] px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#006194]">Document record · {record.type}</p>
                <h1 className="mt-1 truncate text-sm font-bold text-[#0b1c30]">{record.title}</h1>
              </div>
              <span className="shrink-0 rounded border border-[#cbd5e1] bg-[#f1f5f9] px-2 py-1 text-[10px] font-semibold uppercase text-[#526174]">Preview only</span>
            </header>
            <div className="flex flex-1 flex-col items-center justify-center bg-[#f1f5f9] px-6 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center border border-[#b8d8e9] bg-[#eff8fd] font-mono text-lg font-bold text-[#006194]">{record.type.slice(0, 1)}</span>
              <h2 className="mt-4 text-sm font-semibold text-[#334155]">No source file is attached</h2>
              <p className="mt-1 max-w-xs text-xs leading-5 text-[#64748b]">This record currently contains metadata only. An uploaded document preview will appear here when a source file is linked.</p>
            </div>
          </section>

          <aside className="flex flex-col border border-[#dbe3eb] bg-white">
            <header className="border-b border-[#e2e8f0] px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#006194]">Record details</p>
              <h2 className="mt-1 text-sm font-bold text-[#0b1c30]">Metadata</h2>
            </header>
            <dl className="divide-y divide-[#e2e8f0] px-5">
              <div className="py-3"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#718096]">Spatial link</dt><dd className="mt-1 text-xs font-medium text-[#334155]">{record.location}</dd></div>
              <div className="py-3"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#718096]">Date of execution</dt><dd className="mt-1 font-mono text-xs tabular-nums text-[#334155]">{record.date}</dd></div>
              <div className="py-3"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#718096]">Author / originator</dt><dd className="mt-1 text-xs font-medium text-[#334155]">{record.author}</dd></div>
              <div className="py-3"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#718096]">Statutory status</dt><dd className="mt-1"><span className={`inline-flex rounded border px-2 py-1 text-[10px] font-semibold uppercase ${record.status === "Approved" ? "border-[#b8e3cc] bg-[#eef9f2] text-[#28704c]" : "border-[#f2d5a5] bg-[#fff8e9] text-[#9a5c00]"}`}>{record.status}</span></dd></div>
            </dl>
            <div className="mt-auto space-y-2 border-t border-[#e2e8f0] p-5">
              <button type="button" disabled title="Signature verification service is not configured" className="h-9 w-full cursor-not-allowed rounded border border-[#cbd5e1] bg-[#f1f5f9] px-3 text-xs font-semibold text-[#7b8794]">Signature verification unavailable</button>
              <button type="button" onClick={handleDownload} className="h-9 w-full rounded bg-[#006194] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#00527c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]">Download metadata JSON</button>
            </div>
          </aside>
        </div>
      </main>
    </WorkspaceShell>
  );
}

// Next.js requires useSearchParams to be wrapped in a Suspense boundary
export default function DocumentViewer() {
  return (
    <Suspense fallback={<div className="p-10 flex h-screen items-center justify-center text-xl font-bold bg-slate-900 text-white">Initializing Secure Environment...</div>}>
      <DocumentViewerContent />
    </Suspense>
  );
}
