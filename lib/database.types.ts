export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      inventory: {
        Row: {
          batch_number: string | null
          expiry_date: string
          id: string
          pharmacy_id: string
          price_per_gram: number
          stock_level: number
          strain_id: string
          updated_at: string
        }
        Insert: {
          batch_number?: string | null
          expiry_date: string
          id?: string
          pharmacy_id: string
          price_per_gram: number
          stock_level?: number
          strain_id: string
          updated_at?: string
        }
        Update: {
          batch_number?: string | null
          expiry_date?: string
          id?: string
          pharmacy_id?: string
          price_per_gram?: number
          stock_level?: number
          strain_id?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: "inventory_pharmacy_id_fkey"; columns: ["pharmacy_id"]; referencedRelation: "pharmacies"; referencedColumns: ["id"] },
          { foreignKeyName: "inventory_strain_id_fkey"; columns: ["strain_id"]; referencedRelation: "strains"; referencedColumns: ["id"] },
        ]
      }
      patient_documents: {
        Row: {
          created_at: string
          id: string
          invoice_url: string | null
          patient_pesel: string
          prescription_code: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_url?: string | null
          patient_pesel: string
          prescription_code: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invoice_url?: string | null
          patient_pesel?: string
          prescription_code?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pharmacies: {
        Row: {
          address: string
          city: string
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
          slug: string
          updated_at: string
          voivodeship: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          name: string
          slug: string
          updated_at?: string
          voivodeship: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          slug?: string
          updated_at?: string
          voivodeship?: string
        }
        Relationships: []
      }
      strains: {
        Row: {
          cbd_pct: number
          created_at: string
          dominant_terpenes: string[] | null
          id: string
          lineage: string | null
          name: string
          producer: string
          thc_pct: number
        }
        Insert: {
          cbd_pct: number
          created_at?: string
          dominant_terpenes?: string[] | null
          id?: string
          lineage?: string | null
          name: string
          producer: string
          thc_pct: number
        }
        Update: {
          cbd_pct?: number
          created_at?: string
          dominant_terpenes?: string[] | null
          id?: string
          lineage?: string | null
          name?: string
          producer?: string
          thc_pct?: number
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
