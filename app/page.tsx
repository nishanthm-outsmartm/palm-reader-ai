'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import ImagePreview from '../components/ImagePreview';
import PalmReading from '../components/PalmReading';
import PastReadingsGallery from '../components/PastReadingsGallery';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReadingMetadata {
  ipfsHash: string;
  pinSize?: number;
  timestamp: string;
  reading: string | null;
}

export default function Home() {
  const [reading, setReading] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);

  useEffect(() => {
    // Clear state when component mounts
    setReading(null);
    setImageUrl(null);
    setError(null);
    setIpfsHash(null);
  }, []);

  const handleUploadComplete = (hash: string) => {
    setIpfsHash(hash);
    setImageUrl(`https://gateway.pinata.cloud/ipfs/${hash}`);
    setError(null); // Clear any previous errors
    setReading(null); // Clear any previous reading
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
        // Update the metadata with the new reading
        updateMetadataWithReading(ipfsHash, response.data.reading);
      }
    } catch (error) {
      console.error('Error analyzing palm:', error);
      setError('An unexpected error occurred while analyzing the image.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateMetadataWithReading = (ipfsHash: string, newReading: string) => {
    const pastReadings = JSON.parse(localStorage.getItem('pastReadings') || '[]') as ReadingMetadata[];
    const updatedReadings = pastReadings.map((r: ReadingMetadata) => 
      r.ipfsHash === ipfsHash ? {...r, reading: newReading} : r
    );
    localStorage.setItem('pastReadings', JSON.stringify(updatedReadings));
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
      <Tabs defaultValue="current" className="max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Reading</TabsTrigger>
          <TabsTrigger value="past">Past Readings</TabsTrigger>
        </TabsList>
        <TabsContent value="current">
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
        </TabsContent>
        <TabsContent value="past">
          <PastReadingsGallery />
        </TabsContent>
      </Tabs>
    </motion.main>
  );
}