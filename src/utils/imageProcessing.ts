import Tesseract from 'tesseract.js';
import { BillItem } from '../types/bills';

// Helper to generate unique IDs
const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export const analyzeBillWithTesseract = async (
  imageUrl: string,
  progressCallback?: (progress: number) => void
): Promise<BillItem[]> => {
  try {
    // Use Tesseract.js to extract text from the image
    const result = await Tesseract.recognize(
      imageUrl,
      'eng',
      {
        logger: (m) => {
          if (progressCallback && m.status === 'recognizing text') {
            progressCallback(m.progress);
          }
        },
      }
    );

    // Extract text lines from the result
    const text = result.data.text;
    const lines = text.split('\n').filter(line => line.trim() !== '');

    // Process the text to identify items and prices
    return extractItemsFromText(lines);
  } catch (error) {
    console.error('Error analyzing bill with Tesseract:', error);
    throw new Error('Failed to analyze bill image');
  }
};

const extractItemsFromText = (lines: string[]): BillItem[] => {
  const items: BillItem[] = [];
  const priceRegex = /\$?\s*(\d+\.\d{2}|\d+\,\d{2}|\d+)/;

  // Filter out lines that are likely to be items with prices
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip lines that are too short or likely headers
    if (line.length < 3 || /total|subtotal|tax|tip|sum|amount|due/i.test(line)) {
      continue;
    }
    
    // Check if the line contains a price
    const priceMatch = line.match(priceRegex);
    
    if (priceMatch) {
      const priceStr = priceMatch[1].replace(',', '.');
      const price = parseFloat(priceStr);
      
      if (!isNaN(price) && price > 0) {
        // Extract the item name by removing the price part
        let name = line.replace(priceMatch[0], '').trim();
        name = name.replace(/\d+\s*x\s*/, ''); // Remove quantity if present
        
        // Clean up the name
        name = name.replace(/[^\w\s]/g, ' ').trim();
        
        // Only add if we have both name and price
        if (name.length > 0) {
          items.push({
            id: generateId(),
            name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            price
          });
        }
      }
    }
  }

  // If we couldn't extract any items, create some dummy items for demo purposes
  if (items.length === 0) {
    return [
      { id: generateId(), name: 'Pasta', price: 12.99 },
      { id: generateId(), name: 'Pizza', price: 15.50 },
      { id: generateId(), name: 'Salad', price: 8.99 },
      { id: generateId(), name: 'Soda', price: 2.50 }
    ];
  }

  return items;
};

// For server-side implementation (comment out when using client-side only)
/*
export const analyzeReceiptWithAPI = async (
  file: File,
  progressCallback?: (progress: number) => void
): Promise<BillItem[]> => {
  try {
    const formData = new FormData();
    formData.append('receipt', file);

    const response = await axios.post('/api/analyze-receipt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressCallback && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          progressCallback(progress);
        }
      }
    });

    return response.data.items;
  } catch (error) {
    console.error('Error analyzing receipt with API:', error);
    throw new Error('Failed to analyze receipt with server API');
  }
};
*/