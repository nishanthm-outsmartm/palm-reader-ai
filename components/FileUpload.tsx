import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onUploadComplete: (ipfsHash: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('/api/upload', formData);
      const { ipfsHash, pinSize, timestamp } = response.data;
      
      // Guardar los metadatos en localStorage o en una base de datos
      const metadata = {
        ipfsHash,
        pinSize,
        timestamp,
        reading: null // Se actualizará después del análisis
      };
      saveMetadata(metadata);
      
      onUploadComplete(ipfsHash);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  interface Metadata {
    ipfsHash: string;
    pinSize: number;
    timestamp: string;
    reading: string | null;
  }

  const saveMetadata = (metadata: Metadata) => {
    const pastReadings = JSON.parse(localStorage.getItem('pastReadings') || '[]');
    pastReadings.push(metadata);
    localStorage.setItem('pastReadings', JSON.stringify(pastReadings));
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      className="mt-4 flex items-center justify-center p-4 border-2 border-dashed rounded-md"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
        accept="image/*"
      />
      <Button onClick={handleButtonClick} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Image'}
        <Upload className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default FileUpload;