// src/types/index.ts

export type PaymentMethod = 'mpesa' | 'card' | 'bank' | 'opensource_gateway';

export interface PaymentPayload {
  amount: number;
  email: string;
  studentName: string;
  planId: string;
  method: PaymentMethod;
  phoneNumber?: string; 
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
  };
  bankAccount?: string;
}

export interface GatewayResponse {
  success: boolean;
  transactionId?: string;
  message: string;
}

export interface CourseLevel {
  id: string;
  title: string;
  age: string;
  description: string;
  tools: string[];
  skills: string[];
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  displayPrice: string;
  billing: string;
  features: string[];
  popular: boolean;
}