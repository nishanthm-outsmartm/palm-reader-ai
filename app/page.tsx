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
import { Loader, Sparkles, Eye, History, AlertCircle } from 'lucide-react';
import HowToUse from '@/components/HowToUse';
import Footer from '@/components/Footer';
import type {
  HandLandmarker as HandLandmarkerType,
  FilesetResolver as FilesetResolverType,
} from '@mediapipe/tasks-vision';

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

declare global {
  interface Window {
    HandLandmarker: typeof HandLandmarkerType;
    FilesetResolver: typeof FilesetResolverType;
  }
}

export default function Home() {
  const [reading, setReading] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@mediapipe/tasks-vision').then(mod => {
        console.log("✅ MediaPipe modules loaded");
        window.HandLandmarker = mod.HandLandmarker;
        window.FilesetResolver = mod.FilesetResolver;
      }).catch(err => {
        console.error("❌ Error loading MediaPipe modules:", err);
      });
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleUploadComplete = (hash: string) => {
    setIpfsHash(hash);
    setImageUrl(`https://gateway.pinata.cloud/ipfs/${hash}`);
    setError(null);
    setReading(null);
  };

  const handleAnalyze = async () => {
    if (!ipfsHash || !imageUrl) return;
    setIsLoading(true);
    setError(null);
    try {
      const isValid = await validateHand(imageUrl);
      console.log("🧠 Hand validation result:", isValid);
      if (!isValid) {
        setError("No se detectó una mano clara en la imagen.");
        return;
      }

      const response = await axios.post<{ reading: string }>('/api/analyze', { ipfsHash });
      setReading(response.data.reading);
      saveReading(ipfsHash, response.data.reading);
    } catch (error) {
      console.error('❌ Error analyzing palm:', error);
      setError('An unexpected error occurred while analyzing the image.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveReading = (ipfsHash: string, reading: string) => {
    const newReading = {
      ipfsHash,
      timestamp: new Date().toISOString(),
      reading
    };
    const pastReadings = JSON.parse(localStorage.getItem('pastReadings') || '[]');
    pastReadings.push(newReading);
    localStorage.setItem('pastReadings', JSON.stringify(pastReadings));
  };

  const validateHand = async (imageUrl: string): Promise<boolean> => {
    try {
      console.log("🧬 Initializing FilesetResolver...");
      const vision = await window.FilesetResolver.forVisionTasks('/models');

      console.log("🖐️ Creating HandLandmarker...");
      const detector = await window.HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: '/models/hand_landmarker.task',
        },
        runningMode: 'IMAGE',
        numHands: 2,
      });

      console.log("📷 Fetching image...");
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error("❌ Canvas context is null");
        return false;
      }

      ctx.drawImage(bitmap, 0, 0);
      const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);

      console.log("🔍 Detecting hand...");
      const result = detector.detect(imageData);

      console.log("🧾 Detection result:", result);
      return result.handedness.length > 0;
    } catch (err) {
      console.error("❌ Error in validateHand:", err);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_70%)]"></div>
        
        <motion.div
          className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full text-purple-700 font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Powered by AI & Built for DEV Challenge</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Palm Reader AI
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Discover the secrets hidden in your palm with advanced AI technology. 
            Upload your palm photo and unlock mystical insights about your destiny.
          </p>
        </motion.div>
      </section>

      {/* How to Use Section */}
      <HowToUse />
      
      {/* Main Content */}
      <motion.main 
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm rounded-2xl p-2 border border-purple-200/50 shadow-lg">
              <TabsTrigger 
                value="current" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Current Reading
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
              >
                <History className="w-4 h-4" />
                Past Readings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="mt-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    New Palm Reading
                  </h2>
                  <p className="text-purple-100 mt-2">Upload your palm image to discover your destiny</p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                  <ImagePreview imageUrl={imageUrl} />
                  <FileUpload onUploadComplete={handleUploadComplete} />
                  
                  {imageUrl && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        onClick={handleAnalyze}
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Analyze Palm & Reveal Destiny
                      </Button>
                    </motion.div>
                  )}
                  
                  {isLoading && (
                    <motion.div 
                      className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-8 text-center"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <Loader className="animate-spin w-12 h-12 text-purple-500" />
                          <div className="absolute inset-0 w-12 h-12 border-4 border-purple-200 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      
                      <motion.h3 
                        key={loadingMessage}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="text-purple-800 font-bold text-xl mb-3"
                      >
                        {loadingMessage}
                      </motion.h3>
                      
                      <p className="text-purple-600 text-lg">
                        Our mystical AI is decoding the secrets of your palm...
                      </p>
                      
                      <div className="mt-6 flex justify-center">
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {error && (
                    <motion.div 
                      className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800 mb-1">Analysis Error</h4>
                        <p className="text-red-700">{error}</p>
                      </div>
                    </motion.div>
                  )}
                  
                  {!error && reading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <PalmReading reading={reading} />
                    </motion.div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="past" className="mt-8">
              <PastReadingsGallery />
            </TabsContent>
          </Tabs>
        </div>
      </motion.main>
      
      <Footer />
    </div>
  );
}