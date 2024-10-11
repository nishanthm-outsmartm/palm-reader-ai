'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import ImagePreview from '../components/ImagePreview';
import axios from 'axios';

interface PalmReadingProps {
  reading: string | null;
}

const PalmReading: React.FC<PalmReadingProps> = ({ reading }) => {
  if (!reading) return null;
  return (
    <motion.div
      className="mt-8 p-6 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-purple-600">Your Palm Reading</h2>
      <p className="text-gray-700 leading-relaxed">{reading}</p>
    </motion.div>
  );
};

export default function Home() {
  const [reading, setReading] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);

  const handleUploadComplete = (hash: string) => {
    setIpfsHash(hash);
    setImageUrl(`https://gateway.pinata.cloud/ipfs/${hash}`);
  };

  const handleAnalyze = async () => {
    if (!ipfsHash) return;
    setIsLoading(true);
    try {
      const response = await axios.post<{ reading: string }>('/api/analyze', { ipfsHash });
      setReading(response.data.reading);
    } catch (error) {
      console.error('Error analyzing palm:', error);
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
        className="text-5xl font-bold mb-8 text-center text-purple-600"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        Palm Reader AI
      </motion.h1>
      <div className="max-w-2xl mx-auto">
        <ImagePreview 
          imageUrl={imageUrl} 
          placeholderText="Upload your palm image to get started"
        />
        <FileUpload onUploadComplete={handleUploadComplete} />
        {imageUrl && (
          <motion.button
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAnalyze}
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Palm'}
          </motion.button>
        )}
        <PalmReading reading={reading} />
      </div>
    </motion.main>
  );
}

