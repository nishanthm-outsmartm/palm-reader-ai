import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PalmReadingProps {
  reading: string | null;
}

const PalmReading: React.FC<PalmReadingProps> = ({ reading }) => {
  if (!reading) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Palm Reading</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{reading}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PalmReading;