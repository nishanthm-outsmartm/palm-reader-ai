'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import ImagePreview from '../components/ImagePreview';
import PalmReading from '../components/PalmReading';
import PastReadingsGallery from '../components/PastReadingsGallery';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Loader } from 'lucide-react';
import Hero from '@/components/HeroComponent';
import HowToUse from '@/components/HowToUse';
import Footer from '@/components/Footer';


const loadingMessages = [
  "Analyzing the lines of destiny...",
  "Decoding the secrets of your palm...",
  "Consulting with the digital oracle...",
  "Unraveling the mysteries of your future...",
  "Channeling the wisdom of ancient palmists...",
  "Translating hand-written fate into binary...",
  "Scanning for signs of upcoming adventures...",
  "Detecting traces of good fortune...",
  "Measuring the length of your life line...",
  "Calculating your luckiness quotient..."
];

export default function Home() {
  const [reading, setReading] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 3000); // Change message every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isLoading]);

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
      <a href="#how-to-use" className="text-orange-600 hover:text-orange-800">
      <HowToUse />
      </a>
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
              {imageUrl && !isLoading && (
                <Button
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={handleAnalyze}
                >
                  Analyze Palm
                </Button>
              )}
              {isLoading && (
                <div className="mt-4 p-6 bg-orange-100 border border-orange-300 rounded-lg text-center">
                  <Loader className="animate-spin mx-auto mb-4 text-orange-500" size={40} />
                  <motion.p 
                    key={loadingMessage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-orange-800 font-semibold text-lg mb-2"
                  >
                    {loadingMessage}
                  </motion.p>
                  <p className="text-orange-600">Please wait while our AI works its magic...</p>
                </div>
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