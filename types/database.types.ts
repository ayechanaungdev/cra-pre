export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          nrc: string | null
          role: 'renter' | 'car_owner' | 'admin'
          avatar_url: string | null
          license_url: string | null
          is_active: boolean
          is_blacklist: boolean
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          nrc?: string | null
          role: 'renter' | 'car_owner' | 'admin'
          avatar_url?: string | null
          license_url?: string | null
          is_active?: boolean
          is_blacklist?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          nrc?: string | null
          role?: 'renter' | 'car_owner' | 'admin'
          avatar_url?: string | null
          license_url?: string | null
          is_active?: boolean
          is_blacklist?: boolean
          created_at?: string
        }
      }
      cars: {
        Row: {
          id: string
          owner_id: string
          brand: string
          model: string
          price_per_day: number
          status: 'available' | 'booked' | 'maintenance' | 'pending' | 'rejected'
          location: string
          postal_code: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          brand: string
          model: string
          price_per_day: number
          status?: 'available' | 'booked' | 'maintenance' | 'pending' | 'rejected'
          location: string
          postal_code?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          brand?: string
          model?: string
          price_per_day?: number
          status?: 'available' | 'booked' | 'maintenance' | 'pending' | 'rejected'
          location?: string
          postal_code?: string | null
          description?: string | null
          created_at?: string
        }
      }
      drivers: {
        Row: {
          id: string
          owner_id: string
          name: string
          phone: string
          photo_url: string | null
          license_url: string | null
          status: 'available' | 'busy'
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          phone: string
          photo_url?: string | null
          license_url?: string | null
          status?: 'available' | 'busy'
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          phone?: string
          photo_url?: string | null
          license_url?: string | null
          status?: 'available' | 'busy'
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          customer_id: string
          car_id: string
          driver_id: string | null
          start_date: string
          end_date: string
          total_price: number
          pickup_location: string | null
          dropoff_location: string | null
          status: 'pending' | 'approved' | 'rejected' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          car_id: string
          driver_id?: string | null
          start_date: string
          end_date: string
          total_price: number
          pickup_location?: string | null
          dropoff_location?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          car_id?: string
          driver_id?: string | null
          start_date?: string
          end_date?: string
          total_price?: number
          pickup_location?: string | null
          dropoff_location?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'completed'
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
  }
}
