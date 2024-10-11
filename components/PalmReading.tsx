import React from 'react';

interface PalmReadingProps {
  reading: string | null;
}

const PalmReading: React.FC<PalmReadingProps> = ({ reading }) => {
  if (!reading) return null;
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Palm Reading</h2>
      <p className="text-gray-700">{reading}</p>
    </div>
  );
};

export default PalmReading;