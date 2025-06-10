'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSession(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error checking session:', err);
      }
    };

    checkSession();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Test</h1>
      
      {error ? (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      ) : session ? (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h2 className="font-bold">Session Data:</h2>
          <pre className="mt-2 p-4 bg-white rounded overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      ) : (
        <p>Loading session data...</p>
      )}
    </div>
  );
}
