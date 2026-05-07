// Powered by OnSpace.AI
import React, { createContext, useState, ReactNode } from 'react';
import { GenerationResult } from '@/services/aiService';

interface GalleryContextType {
  items: GenerationResult[];
  addItem: (item: GenerationResult) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
}

export const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<GenerationResult[]>([]);

  const addItem = (item: GenerationResult) => {
    setItems(prev => [item, ...prev]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearAll = () => setItems([]);

  return (
    <GalleryContext.Provider value={{ items, addItem, removeItem, clearAll }}>
      {children}
    </GalleryContext.Provider>
  );
}
