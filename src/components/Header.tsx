import React from 'react';
import { Receipt } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-800">SplitSmart</h1>
        </div>
        <p className="text-sm text-gray-600 hidden sm:block">AI-Powered Bill Splitting</p>
      </div>
    </header>
  );
};

export default Header;