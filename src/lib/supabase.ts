import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cfigfcufbornekzjxbqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaWdmY3VmYm9ybmVremp4YnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDU4NDcsImV4cCI6MjA2ODQ4MTg0N30.Y40XGZS1wvUVku4kEKi5CpntHA3k8Y9ohzMSG9bNMHI';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          customer_address: string;
          order_type: 'pickup' | 'delivery';
          total_amount: number;
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          customer_address?: string;
          order_type?: 'pickup' | 'delivery';
          total_amount?: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
        };
        Update: {
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          customer_address?: string;
          order_type?: 'pickup' | 'delivery';
          total_amount?: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_name: string;
          product_price: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          order_id: string;
          product_name: string;
          product_price: string;
          quantity: number;
        };
        Update: {
          order_id?: string;
          product_name?: string;
          product_price?: string;
          quantity?: number;
        };
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone?: string;
          subject: string;
          message: string;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          phone?: string;
          subject: string;
          message: string;
        };
        Update: {
          name?: string;
          email?: string;
          phone?: string;
          subject?: string;
          message?: string;
        };
      };
      Settings: {
        Row: {
          Id: number;
          BusinessName: string;
          Address: string;
          Phone: string;
          Email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          Id?: number;
          BusinessName?: string;
          Address?: string;
          Phone?: string;
          Email?: string;
        };
        Update: {
          Id?: number;
          BusinessName?: string;
          Address?: string;
          Phone?: string;
          Email?: string;
        };
      };
    };
  };
};
