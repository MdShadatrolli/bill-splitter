import React, { useState } from 'react';
import { SplitBill, BillItem } from '../types/bills';
import { CreditCard, RefreshCw, DollarSign, Edit, Check, X } from 'lucide-react';

interface SplitResultsProps {
  splitBill: SplitBill;
  onReset: () => void;
}

export const SplitResults: React.FC<SplitResultsProps> = ({ splitBill, onReset }) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editableItems, setEditableItems] = useState<BillItem[]>(splitBill.items);
  
  // Calculated totals based on current editable items
  const total = editableItems.reduce((sum, item) => sum + item.price, 0);
  const perPerson = total / 2;

  const handleEditItem = (id: string) => {
    setEditingItemId(id);
  };

  const handleSaveItem = (id: string, newName: string, newPrice: number) => {
    setEditableItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, name: newName, price: newPrice } 
          : item
      )
    );
    setEditingItemId(null);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          Bill Summary
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-blue-100">
            <span className="text-gray-700">Total Bill</span>
            <span className="font-medium text-gray-900">{formatCurrency(total)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-blue-100">
            <span className="text-gray-700">Split (2 people)</span>
            <span className="font-medium text-gray-900">{formatCurrency(perPerson)}</span>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-green-800 font-medium flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Per Person
              </span>
              <span className="text-lg font-bold text-green-800">{formatCurrency(perPerson)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Item Details</h3>
        
        <div className="max-h-60 overflow-y-auto pr-2">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Item</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Price</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {editableItems.map((item) => (
                <tr key={item.id}>
                  {editingItemId === item.id ? (
                    // Edit mode
                    <>
                      <td className="py-2">
                        <input 
                          type="text" 
                          defaultValue={item.name}
                          className="w-full text-sm border rounded px-2 py-1"
                          id={`edit-name-${item.id}`}
                        />
                      </td>
                      <td className="py-2">
                        <input 
                          type="number"
                          step="0.01"
                          defaultValue={item.price}
                          className="w-full text-sm border rounded px-2 py-1 text-right"
                          id={`edit-price-${item.id}`}
                        />
                      </td>
                      <td className="py-2 text-right space-x-1">
                        <button 
                          onClick={() => {
                            const nameInput = document.getElementById(`edit-name-${item.id}`) as HTMLInputElement;
                            const priceInput = document.getElementById(`edit-price-${item.id}`) as HTMLInputElement;
                            handleSaveItem(
                              item.id, 
                              nameInput.value, 
                              parseFloat(priceInput.value)
                            );
                          }}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td className="py-2 text-sm text-gray-800">{item.name}</td>
                      <td className="py-2 text-sm text-gray-800 text-right">{formatCurrency(item.price)}</td>
                      <td className="py-2 text-right">
                        <button 
                          onClick={() => handleEditItem(item.id)}
                          className="p-1 text-gray-500 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button 
        onClick={onReset}
        className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Upload a New Receipt
      </button>
    </div>
  );
};