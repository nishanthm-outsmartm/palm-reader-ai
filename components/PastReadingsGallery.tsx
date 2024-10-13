import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

interface Reading {
  ipfsHash: string;
  timestamp: string;
  reading: string;
  audioIpfsHash: string;
}

const PastReadingsGallery: React.FC = () => {
  const [pastReadings, setPastReadings] = useState<Reading[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const rawReadings = localStorage.getItem('pastReadings');
    if (rawReadings) {
      const allReadings = JSON.parse(rawReadings);
      const completeReadings = allReadings.filter((r: Reading) => r.timestamp && r.reading && r.audioIpfsHash);
      setPastReadings(completeReadings);
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  }, []);

  const toggleAudio = useCallback((audioIpfsHash: string) => {
    const audioUrl = `https://gateway.pinata.cloud/ipfs/${audioIpfsHash}`;
    if (currentlyPlaying === audioIpfsHash) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      } else {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.play();
      }
      setCurrentlyPlaying(audioIpfsHash);
    }
  }, [currentlyPlaying]);

  return (
    <Card className="w-full mt-8 bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300">
      <CardContent className="p-6">
        <ScrollArea className="h-[600px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastReadings.map((reading, index) => (
              <Dialog key={reading.ipfsHash}>
                <DialogTrigger asChild>
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-white">
                      <CardContent className="p-0">
                        <img 
                          src={`https://gateway.pinata.cloud/ipfs/${reading.ipfsHash}`} 
                          alt={`Palm reading ${index + 1}`} 
                          className="w-full h-48 object-contain"
                        />
                        <div className="p-4">
                          <p className="text-sm text-orange-600 mb-2 font-serif">{formatDate(reading.timestamp)}</p>
                          <p className="text-sm line-clamp-3 text-orange-900 font-serif">{reading.reading}</p>
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAudio(reading.audioIpfsHash);
                            }} 
                            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                          >
                            {currentlyPlaying === reading.audioIpfsHash ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                            {currentlyPlaying === reading.audioIpfsHash ? 'Pause' : 'Play'} Reading
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl bg-gradient-to-br from-yellow-50 to-orange-50">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-orange-800 font-serif">Palm Reading {index + 1}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <img 
                      src={`https://gateway.pinata.cloud/ipfs/${reading.ipfsHash}`} 
                      alt={`Palm reading ${index + 1}`} 
                      className="w-full h-auto object-contain rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-orange-900 font-serif">Your Reading</h3>
                      <p className="text-sm mb-2 text-orange-800 font-serif">{reading.reading}</p>
                      <p className="text-xs text-orange-600 font-serif">Date: {formatDate(reading.timestamp)}</p>
                      <Button 
                        onClick={() => toggleAudio(reading.audioIpfsHash)} 
                        className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        {currentlyPlaying === reading.audioIpfsHash ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                        {currentlyPlaying === reading.audioIpfsHash ? 'Pause' : 'Play'} Reading
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PastReadingsGallery;