'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import ImagePreview from '../components/ImagePreview';
import PalmReading from '../components/PalmReading';
import { Button } from "@/components/ui/button";

export default function Home() {
  const [reading, setReading] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);

  const handleUploadComplete = (hash: string) => {
    setIpfsHash(hash);
    setImageUrl(`https://gateway.pinata.cloud/ipfs/${hash}`);
    setError(null); // Clear any previous errors
  };

  const handleAnalyze = async () => {
    if (!ipfsHash) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<{ reading: string }>('/api/analyze', { ipfsHash });
      if (response.data.reading.startsWith('Error:')) {
        setError(response.data.reading);
        setReading(null);
      } else {
        setReading(response.data.reading);
      }
    } catch (error) {
      console.error('Error analyzing palm:', error);
      setError('An unexpected error occurred while analyzing the image.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.main 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        Palm Reader AI
      </motion.h1>
      <div className="max-w-2xl mx-auto">
        <ImagePreview imageUrl={imageUrl} />
        <FileUpload onUploadComplete={handleUploadComplete} />
        {imageUrl && (
          <Button
            className="mt-4 w-full"
            onClick={handleAnalyze}
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Palm'}
          </Button>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {reading && <PalmReading reading={reading} />}
      </div>
    </motion.main>
  );
}