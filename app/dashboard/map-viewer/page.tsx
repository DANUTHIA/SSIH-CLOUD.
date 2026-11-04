"use client";

import dynamic from "next/dynamic";
import WorkspaceShell from "../../../components/WorkspaceShell";

const MapDigitizer = dynamic(() => import("../../../components/MapDigitizer"), {
  ssr: false,
  loading: () => <div className="flex h-screen items-center justify-center">Loading Spatial Environment...</div>,
});

export default function MapViewerPage() {
  return (
    <WorkspaceShell compact>
      <div className="h-[calc(100dvh-4rem)] min-h-0 w-full">
        <MapDigitizer inWorkspace />
      </div>
    </WorkspaceShell>
  );
}
