'use client';

import { useParams } from 'next/navigation';
import CallTracker from '@/components/CallTracker';

export default function CallTrackerPage() {
  const params = useParams();
  const callId = params.id as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Call Tracker</h1>
      <CallTracker callId={callId} />
    </div>
  );
} 