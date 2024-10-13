import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Reading {
  ipfsHash: string;
  timestamp: string;
  reading: string;
}

const PastReadingsGallery: React.FC = () => {
  const [pastReadings, setPastReadings] = useState<Reading[]>([]);

  useEffect(() => {
    const rawReadings = localStorage.getItem('pastReadings');
    if (rawReadings) {
      const allReadings = JSON.parse(rawReadings);
      // Filter out incomplete readings
      const completeReadings = allReadings.filter((r: Reading) => r.timestamp && r.reading);
      setPastReadings(completeReadings);
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card className="w-full mt-8">
      <CardContent className="p-6">
        <ScrollArea className="h-[600px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastReadings.map((reading, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <img 
                        src={`https://gateway.pinata.cloud/ipfs/${reading.ipfsHash}`} 
                        alt={`Palm reading ${index + 1}`} 
                        className="w-full h-48 object-contain"
                      />
                      <div className="p-4">
                        <p className="text-sm text-gray-500 mb-2">{formatDate(reading.timestamp)}</p>
                        <p className="text-sm line-clamp-3">{reading.reading}</p>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Palm Reading {index + 1}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <img 
                      src={`https://gateway.pinata.cloud/ipfs/${reading.ipfsHash}`} 
                      alt={`Palm reading ${index + 1}`} 
                      className="w-full h-auto object-contain rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Your Reading</h3>
                      <p className="text-sm mb-2">{reading.reading}</p>
                      <p className="text-xs text-gray-500">Date: {formatDate(reading.timestamp)}</p>
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