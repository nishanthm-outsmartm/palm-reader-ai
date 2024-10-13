import React from 'react';
import { motion } from 'framer-motion';

interface PalmReadingProps {
  reading: string;
}

const PalmReading: React.FC<PalmReadingProps> = ({ reading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-lg p-6"
    >
      <h2 className="text-2xl text-center text-orange-800 font-serif mb-4">Your Mystical Palm Reading</h2>
      <p className="text-orange-900 leading-relaxed italic font-serif">{reading}</p>
    </motion.div>
  );
};

export default PalmReading;