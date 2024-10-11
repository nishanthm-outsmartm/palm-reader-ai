'use client';

import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import PalmReading from '../components/PalmReading';
import axios from 'axios';

export default function Home() {
  const [reading, setReading] = useState<string | null>(null);

  const handleUploadComplete = async (ipfsHash: string) => {
    try {
      const response = await axios.post<{ reading: string }>('/api/analyze', { ipfsHash });
      setReading(response.data.reading);
    } catch (error) {
      console.error('Error analyzing palm:', error);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Palm Reader AI</h1>
      <FileUpload onUploadComplete={handleUploadComplete} />
      <PalmReading reading={reading} />
    </main>
  );
}