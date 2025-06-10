'use client';

import { useEffect, useState } from 'react';

export default function TestApi() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const apiUrl = 'http://localhost:3001/api/test';
        console.log(`Fetching ${apiUrl}...`);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
          cache: 'no-store',
          mode: 'cors' // Enable CORS mode
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const responseText = await response.text();
        console.log('Raw response text:', responseText);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
        }
        
        const result = JSON.parse(responseText);
        console.log('Parsed response data:', result);
        setData(result);
      } catch (err: any) {
        const errorMessage = err.message || 'An error occurred';
        console.error('Error fetching data:', errorMessage, err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Test Page</h1>
      
      <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h2>Testing: GET /api/test</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <div style={{ color: 'red' }}>Error: {error}</div>
        ) : data ? (
          <pre style={{ 
            backgroundColor: '#f8f8f8',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <p>No data received</p>
        )}
      </div>
    </div>
  );
}
