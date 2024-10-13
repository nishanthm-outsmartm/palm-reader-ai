'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import ImagePreview from '../components/ImagePreview';
import PalmReading from '../components/PalmReading';
import PastReadingsGallery from '../components/PastReadingsGallery';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause } from 'lucide-react';
import Hero from '@/components/HeroComponent';
import Footer from '@/components/Footer';

export default function Home() {
  const [reading, setReading] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleUploadComplete = (hash: string) => {
    setIpfsHash(hash);
    setImageUrl(`https://gateway.pinata.cloud/ipfs/${hash}`);
    setError(null);
    setReading(null);
    setAudioUrl(null);
  };

  const handleAnalyze = async () => {
    if (!ipfsHash) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<{ reading: string, audioIpfsHash: string }>('/api/analyze', { ipfsHash });
      setReading(response.data.reading);
      setAudioUrl(`https://gateway.pinata.cloud/ipfs/${response.data.audioIpfsHash}`);
      saveReading(ipfsHash, response.data.reading, response.data.audioIpfsHash);
    } catch (error) {
      console.error('Error analyzing palm:', error);
      setError('An unexpected error occurred while analyzing the image.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveReading = (ipfsHash: string, reading: string, audioIpfsHash: string) => {
    const newReading = {
      ipfsHash,
      timestamp: new Date().toISOString(),
      reading,
      audioIpfsHash
    };
    const pastReadings = JSON.parse(localStorage.getItem('pastReadings') || '[]');
    pastReadings.push(newReading);
    localStorage.setItem('pastReadings', JSON.stringify(pastReadings));
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100">
      <Hero />
      <motion.main 
        className="container mx-auto px-4 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <Tabs defaultValue="current" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 bg-yellow-200 rounded-lg p-1">
            <TabsTrigger value="current" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Current Reading
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Past Readings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-6">
              <ImagePreview imageUrl={imageUrl} />
              <FileUpload onUploadComplete={handleUploadComplete} />
              {imageUrl && (
                <Button
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white"
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
              {audioUrl && (
                <div className="mt-4 flex justify-center">
                  <Button onClick={toggleAudio} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                    {isPlaying ? 'Pause Reading' : 'Play Reading'}
                  </Button>
                  <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
                </div>
              )}
              {reading && <PalmReading reading={reading} />}
            </div>
          </TabsContent>
          <TabsContent value="past" className="w-full">
            <PastReadingsGallery />
          </TabsContent>
        </Tabs>
      </motion.main>
      <Footer/>
    </div>
  );
}