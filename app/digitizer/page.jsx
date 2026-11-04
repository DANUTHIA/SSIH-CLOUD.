"use client";

import dynamic from 'next/dynamic';
import WorkspaceShell from '../../components/WorkspaceShell';

// Dynamically import the map component with server-side rendering strictly disabled
const MapDigitizer = dynamic(() => import('../../components/MapDigitizer'), {
  ssr: false,
  loading: () => <div className="flex h-screen items-center justify-center">Loading Spatial Environment...</div>
});

export default function DigitizerPage() {
  return (
    <WorkspaceShell compact>
      <div className="h-[calc(100dvh-4rem)] min-h-0 w-full">
        <MapDigitizer inWorkspace />
      </div>
    </WorkspaceShell>
  );
}
