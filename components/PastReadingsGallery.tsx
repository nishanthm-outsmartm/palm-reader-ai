import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Reading {
  ipfsHash: string;
  timestamp: string;
  reading: string | null;
}

const PastReadingsGallery: React.FC = () => {
  const [pastReadings, setPastReadings] = React.useState<Reading[]>([]);

  React.useEffect(() => {
    const readings = JSON.parse(localStorage.getItem('pastReadings') || '[]');
    setPastReadings(readings);
  }, []);

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Past Readings</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {pastReadings.map((reading, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <img 
                src={`https://gateway.pinata.cloud/ipfs/${reading.ipfsHash}`} 
                alt={`Palm reading ${index + 1}`} 
                className="rounded-md object-contain w-full h-full"
              />
              <p className="text-sm text-gray-500">{new Date(reading.timestamp).toLocaleString()}</p>
              {reading.reading && <p className="mt-2">{reading.reading}</p>}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PastReadingsGallery;