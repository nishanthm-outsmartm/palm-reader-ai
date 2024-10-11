import React from 'react';
import { motion } from 'framer-motion';

interface ImagePreviewProps {
  imageUrl: string | null;
  placeholderText: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, placeholderText }) => {
  return (
    <motion.div
      className="mt-4 rounded-lg overflow-hidden shadow-lg bg-gray-100 h-64 flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="Uploaded palm" className="w-full h-full object-cover" />
      ) : (
        <p className="text-gray-500 text-center p-4">{placeholderText}</p>
      )}
    </motion.div>
  );
};

export default ImagePreview;