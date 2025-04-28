import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
  previewUrl: string | null;
  disabled: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onFileChange, 
  previewUrl,
  disabled
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileChange(acceptedFiles[0]);
    }
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.heic', '.heif']
    },
    maxFiles: 1,
    disabled
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
  };

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
        ${disabled ? 'opacity-70 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      {previewUrl ? (
        <div className="relative">
          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={previewUrl} 
              alt="Receipt preview" 
              className="w-full h-full object-contain"
            />
          </div>
          {!disabled && (
            <button 
              onClick={removeImage}
              className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-90 transition-opacity"
              aria-label="Remove image"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      ) : (
        <div className="py-8 flex flex-col items-center">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-700 font-medium">
            Drag & drop your receipt image here,<br />or click to select a file
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: JPEG, PNG
          </p>
        </div>
      )}
    </div>
  );
};