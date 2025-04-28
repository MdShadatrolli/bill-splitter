import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  progress: number;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ progress }) => {
  const roundedProgress = Math.round(progress);
  
  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
        <p className="text-blue-700 font-medium">
          {roundedProgress < 100 
            ? "Analyzing your receipt..." 
            : "Analysis complete!"}
        </p>
      </div>
      
      <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${roundedProgress}%` }}
        />
      </div>
      
      <p className="text-xs text-blue-600 mt-2 text-right">
        {roundedProgress}%
      </p>
    </div>
  );
};