export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  productReference?: string;
  isTyping?: boolean;
}

export interface QuickReply {
  id: string;
  text: string;
}

export interface Product {
  id: string;
  name: string;
  winery: string;
  region: string;
  vintage: number;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  inStock: boolean;
  stockCount?: number;
  description: string;
  tastingNotes: {
    category: string;
    notes: string[];
  }[];
  pairings: string[];
  expertReview?: string;
  provenance?: string;
  badges?: string[];
  varietal: string;
  alcoholContent: number;
  bottleSize: string;
}

export interface ChatState {
  isExpanded: boolean;
  messages: Message[];
  isLoading: boolean;
  error?: string;
}
