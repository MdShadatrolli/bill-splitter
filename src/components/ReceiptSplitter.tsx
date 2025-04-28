import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { ProcessingStatus } from './ProcessingStatus';
import { SplitResults } from './SplitResults';
import { analyzeBillWithTesseract } from '../utils/imageProcessing';
import { BillItem, SplitBill } from '../types/bills';
import { ArrowRightCircle } from 'lucide-react';

export const ReceiptSplitter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [splitBill, setSplitBill] = useState<SplitBill | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setError(null);
    setSplitBill(null);
    setBillItems([]);
    
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
  };

  const processReceipt = async () => {
    if (!selectedFile || !previewUrl) {
      setError("Please select an image first");
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingProgress(0);

      // Update progress while processing
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);

      // Process the image using Tesseract.js
      const items = await analyzeBillWithTesseract(
        previewUrl,
        (progress) => {
          setProcessingProgress(progress * 0.9); // Scale to 90%
        }
      );
      
      clearInterval(progressInterval);
      setProcessingProgress(100);

      // Calculate totals and create split bill
      const total = items.reduce((sum, item) => sum + item.price, 0);
      const perPerson = total / 2;
      
      setBillItems(items);
      setSplitBill({
        total,
        perPerson,
        items
      });
      
    } catch (err) {
      setError("Failed to process the receipt. Please try again or use a clearer image.");
      console.error("Receipt processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsProcessing(false);
    setProcessingProgress(0);
    setBillItems([]);
    setSplitBill(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Split Your Bill</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 space-y-6">
            <ImageUploader 
              onFileChange={handleFileChange} 
              previewUrl={previewUrl}
              disabled={isProcessing}
            />
            
            {previewUrl && !splitBill && (
              <button 
                onClick={processReceipt}
                disabled={isProcessing}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                Process Receipt
                <ArrowRightCircle className="h-5 w-5" />
              </button>
            )}
            
            {isProcessing && (
              <ProcessingStatus progress={processingProgress} />
            )}
            
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
          </div>
          
          <div className="lg:w-1/2">
            {splitBill && (
              <SplitResults 
                splitBill={splitBill} 
                onReset={resetForm}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};