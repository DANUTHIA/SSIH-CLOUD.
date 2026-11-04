"use client";

import dynamic from "next/dynamic";
import WorkspaceShell from "../../../components/WorkspaceShell";

const UploadWorkspace = dynamic(() => import("../../../components/UploadWorkspace"), {
  ssr: false,
  loading: () => <div className="p-8 text-slate-500">Loading upload workspace...</div>,
});

export default function UploadPage() {
  return (
    <WorkspaceShell>
      <main className="min-h-[calc(100vh-4rem)] bg-[#f3f6fa] px-4 py-5 text-[#0b1c30] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <UploadWorkspace />
      </div>
      </main>
    </WorkspaceShell>
  );
}
