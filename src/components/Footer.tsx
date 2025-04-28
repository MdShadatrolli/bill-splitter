import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-4 px-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-gray-600">© 2025 SplitSmart. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <a 
            href="#" 
            className="text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="GitHub Repository"
          >
            <Github className="h-5 w-5" />
          </a>
          <a 
            href="#" 
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            About
          </a>
          <a 
            href="#" 
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;