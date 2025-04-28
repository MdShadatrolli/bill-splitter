import React from 'react';
import { ReceiptSplitter } from './components/ReceiptSplitter';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
        <ReceiptSplitter />
      </main>
      <Footer />
    </div>
  );
}

export default App;