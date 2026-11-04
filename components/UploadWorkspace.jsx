"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supabase } from "../app/lib/supabase";

const MapDigitizer = dynamic(() => import("./MapDigitizer"), {
  ssr: false,
  loading: () => <div className="flex min-h-[520px] items-center justify-center bg-slate-100 text-slate-500">Loading map digitizer...</div>,
});

const uploadTypes = [
  { value: "plan", label: "Plans" },
  { value: "survey", label: "Survey Documents" },
  { value: "report", label: "Reports" },
  { value: "plot_number", label: "Plot Numbers" },
  { value: "map", label: "Maps" },
];

const recipients = ["County Government", "KeNHA", "NEMA", "KURA", "Kenya Power", "Other Parastatal"];
const spatialTypes = new Set(["plot_number", "map"]);

export default function UploadWorkspace() {
  const [uploadType, setUploadType] = useState("plan");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [userId, setUserId] = useState("");
  const [shareMode, setShareMode] = useState("private");
  const [shareTarget, setShareTarget] = useState({ recipient: recipients[0] });
  const [request, setRequest] = useState({ recipient: recipients[0], subject: "", details: "" });
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadExchange = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("data_requests")
        .select("id, kind, direction, subject, details, status, sender_id, recipient, created_at")
        .order("created_at", { ascending: false });
      setMessages(data ?? []);
    };
    loadExchange();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadStatus("Choose a file before uploading.");
      return;
    }

    setUploadStatus("Uploading...");
    const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${uploadType}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("spatial-uploads").upload(path, selectedFile);

    if (error) {
      const message = error.message.toLowerCase().includes("bucket not found")
        ? "Upload storage is not configured yet. Create the spatial-uploads bucket in Supabase, then try again."
        : `Upload failed: ${error.message}`;
      setUploadStatus(message);
      return;
    }

    if (shareMode === "shared") {
      const { error: shareError } = await supabase.from("data_requests").insert([{
        kind: "share",
        direction: "outgoing",
        sender_id: userId,
        recipient: shareTarget.recipient,
        subject: selectedFile.name,
        details: `Shared ${uploadType} file: ${selectedFile.name}`,
        file_path: path,
        status: "open",
      }]);
      if (shareError) {
        setUploadStatus(`File uploaded, but sharing failed: ${shareError.message}`);
        return;
      }
      setMessages((current) => [{
        kind: "share",
        direction: "outgoing",
        subject: selectedFile.name,
        details: `Shared ${uploadType} file: ${selectedFile.name}`,
        status: "open",
        recipient: shareTarget.recipient,
      }, ...current]);
    }

    setUploadStatus(shareMode === "shared" ? `Uploaded and shared with ${shareTarget.recipient}.` : `Uploaded ${selectedFile.name}.`);
    setSelectedFile(null);
    event.target.reset();
  };

  const handleRequest = async (event) => {
    event.preventDefault();
    setRequestStatus("Sending request...");

    const { error } = await supabase.from("data_requests").insert([{
      kind: "request",
      direction: "outgoing",
      sender_id: userId,
      recipient: request.recipient,
      subject: request.subject,
      details: request.details,
      status: "open",
    }]);

    if (error) {
      setRequestStatus(`Request failed: ${error.message}`);
      return;
    }

    setRequest({ recipient: recipients[0], subject: "", details: "" });
    setRequestStatus("Request sent to the data coordination channel.");
    setMessages((current) => [{ kind: "request", direction: "outgoing", subject: request.subject, details: request.details, status: "open", sender_id: userId, recipient: request.recipient }, ...current]);
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <section className="border border-[#dbe3eb] bg-white p-5 md:p-6">
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#006194]">Data intake</p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-[#0b1c30]">Upload spatial data</h1>
          <p className="mt-1 text-sm text-[#526174]">Classify each file so it can be routed, searched, and reviewed correctly.</p>
        </div>

        <form onSubmit={handleUpload} className="grid gap-4 md:grid-cols-[220px_1fr_220px_auto] md:items-end">
          <div>
            <label htmlFor="upload-type" className="mb-2 block text-xs font-semibold text-[#334155]">Upload type</label>
            <select id="upload-type" value={uploadType} onChange={(event) => setUploadType(event.target.value)} className="h-10 w-full rounded border border-[#cbd5e1] bg-white px-3 text-xs text-[#0f172a] focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]">
              {uploadTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="data-file" className="mb-2 block text-xs font-semibold text-[#334155]">File</label>
            <input id="data-file" type="file" required onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} className="h-10 w-full rounded border border-[#cbd5e1] bg-white p-1.5 text-xs text-[#475569] file:mr-3 file:rounded-sm file:border-0 file:bg-[#eaf5fb] file:px-3 file:py-2 file:font-semibold file:text-[#00527c]" />
          </div>
          <div>
            <label htmlFor="share-mode" className="mb-2 block text-xs font-semibold text-[#334155]">Access</label>
            <select id="share-mode" value={shareMode} onChange={(event) => setShareMode(event.target.value)} className="h-10 w-full rounded border border-[#cbd5e1] bg-white px-3 text-xs text-[#0f172a] focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]">
              <option value="private">Private workspace</option>
              <option value="shared">Share with partner</option>
            </select>
          </div>
          <button type="submit" className="h-10 rounded bg-[#006194] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#00527c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]">Upload</button>
        </form>
        {shareMode === "shared" && (
          <div className="mt-4 grid gap-4 border border-[#b8d8e9] bg-[#f0f8fc] p-4 md:grid-cols-2">
            <div>
              <label htmlFor="share-recipient" className="mb-2 block text-xs font-semibold text-[#334155]">Share with</label>
              <select id="share-recipient" value={shareTarget.recipient} onChange={(event) => setShareTarget({ ...shareTarget, recipient: event.target.value })} className="h-10 w-full rounded border border-[#cbd5e1] bg-white px-3 text-xs text-[#0f172a] focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]">
                {recipients.map((recipient) => <option key={recipient}>{recipient}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs leading-relaxed text-[#526174]">This creates an in-app sharing record for the selected organization.</p>
            </div>
          </div>
        )}
        {uploadStatus && <p className="mt-3 border-l-2 border-[#0284c7] bg-[#f1f8fc] px-3 py-2 text-xs text-[#334155]" role="status">{uploadStatus}</p>}
      </section>

      {spatialTypes.has(uploadType) && (
        <section className="overflow-hidden border border-[#dbe3eb] bg-white">
          <div className="border-b border-[#e2e8f0] p-5 md:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#006194]">Spatial review</p>
            <h2 className="mt-1 text-lg font-bold text-[#0b1c30]">Place and digitize this {uploadTypes.find((type) => type.value === uploadType)?.label.toLowerCase()}</h2>
            <p className="mt-1 text-xs text-[#64748b]">Use the base map to position the upload, then trace plot boundaries or other features.</p>
          </div>
          <div className="h-[680px]">
            <MapDigitizer embedded />
          </div>
        </section>
      )}

      <section className="border border-[#dbe3eb] bg-white p-5 md:p-6">
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b45309]">Coordination channel</p>
          <h2 className="mt-1 text-lg font-bold text-[#0b1c30]">Request specific data</h2>
          <p className="mt-1 text-xs text-[#64748b]">Send a structured request to a parastatal or county government team.</p>
        </div>
        <form onSubmit={handleRequest} className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="recipient" className="mb-2 block text-xs font-semibold text-[#334155]">Request from</label>
            <select id="recipient" value={request.recipient} onChange={(event) => setRequest({ ...request, recipient: event.target.value })} className="h-10 w-full rounded border border-[#cbd5e1] bg-white px-3 text-xs text-[#0f172a] focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]">
              {recipients.map((recipient) => <option key={recipient}>{recipient}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="subject" className="mb-2 block text-xs font-semibold text-[#334155]">Subject</label>
            <input id="subject" required value={request.subject} onChange={(event) => setRequest({ ...request, subject: event.target.value })} className="h-10 w-full rounded border border-[#cbd5e1] px-3 text-xs text-[#0f172a] focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]" placeholder="e.g. Sachangwan parcel index" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="details" className="mb-2 block text-xs font-semibold text-[#334155]">Details needed</label>
            <textarea id="details" required rows={4} value={request.details} onChange={(event) => setRequest({ ...request, details: event.target.value })} className="w-full rounded border border-[#cbd5e1] p-3 text-xs text-[#0f172a] focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]" placeholder="Describe the boundary, date range, format, or reference number." />
          </div>
          <div className="md:col-span-2 flex items-center justify-between gap-4">
            {requestStatus && <p className="text-xs text-[#526174]" role="status">{requestStatus}</p>}
            <button type="submit" className="ml-auto rounded bg-[#006194] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#00527c]">Send data request</button>
          </div>
        </form>
      </section>

      <section className="border border-[#dbe3eb] bg-white p-5 md:p-6">
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#006194]">Exchange inbox</p>
          <h2 className="mt-1 text-lg font-bold text-[#0b1c30]">Sent and received data</h2>
          <p className="mt-1 text-xs text-[#64748b]">Follow requests and shared files in both directions.</p>
        </div>
        <div className="space-y-3">
          {messages.length === 0 ? <p className="text-sm text-slate-500">No exchange activity yet.</p> : messages.map((message, index) => (
            <div key={message.id ?? index} className="flex items-start justify-between gap-4 border border-[#e2e8f0] p-4 even:bg-[#f8fafc]">
              <div>
                <p className="text-xs font-semibold text-[#0f172a]">{message.subject}</p>
                <p className="mt-1 text-xs text-[#526174]">{message.details}</p>
                <p className="mt-1 text-[10px] text-[#64748b]">{message.direction === "incoming" ? "Received" : "Sent"} {message.kind ?? "request"} {message.recipient ? `to ${message.recipient}` : ""}</p>
              </div>
              <span className="h-fit rounded border border-[#cbd5e1] bg-[#f1f5f9] px-2 py-1 text-[10px] font-semibold uppercase text-[#526174]">{message.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
