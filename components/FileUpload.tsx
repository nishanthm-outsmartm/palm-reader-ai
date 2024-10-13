import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Upload, Camera } from 'lucide-react';
import Webcam from 'react-webcam';

interface FileUploadProps {
  onUploadComplete: (ipfsHash: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const uploadFile = async (file: File | Blob) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData);
      onUploadComplete(response.data.ipfsHash);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
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

  const handleWebcamCapture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const blob = await fetch(imageSrc).then(res => res.blob());
      await uploadFile(blob);
      setIsWebcamOpen(false);
    }
  }, [webcamRef]);

  return (
    <div className="mt-4">
      {!isWebcamOpen ? (
        <motion.div
          className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md"
          // whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
            accept="image/*"
          />
          <Button onClick={handleButtonClick} disabled={isUploading} className="mb-2">
            {isUploading ? 'Uploading...' : 'Upload Image'}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
          <Button onClick={() => setIsWebcamOpen(true)} disabled={isUploading}>
            Take Picture
            <Camera className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="mb-4 rounded-lg"
          />
          <div className="flex space-x-2">
            <Button onClick={handleWebcamCapture}>Capture</Button>
            <Button onClick={() => setIsWebcamOpen(false)} variant="outline">Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;