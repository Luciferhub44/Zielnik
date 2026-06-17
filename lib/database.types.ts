export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  __InternalSupabase: { PostgrestVersion: '14.5' }
  public: {
    Tables: {
      admin_users: {
        Row:    { pharmacy_id: string | null; role: string; user_id: string }
        Insert: { pharmacy_id?: string | null; role?: string; user_id: string }
        Update: { pharmacy_id?: string | null; role?: string; user_id?: string }
        Relationships: [{ foreignKeyName: 'admin_users_pharmacy_id_fkey'; columns: ['pharmacy_id']; isOneToOne: false; referencedRelation: 'pharmacies'; referencedColumns: ['id'] }]
      }
      inventory: {
        Row:    { batch_number: string | null; expiry_date: string; id: string; pharmacy_id: string; price_per_gram: number; stock_level: number; strain_id: string; updated_at: string }
        Insert: { batch_number?: string | null; expiry_date: string; id?: string; pharmacy_id: string; price_per_gram: number; stock_level?: number; strain_id: string; updated_at?: string }
        Update: { batch_number?: string | null; expiry_date?: string; id?: string; pharmacy_id?: string; price_per_gram?: number; stock_level?: number; strain_id?: string; updated_at?: string }
        Relationships: [
          { foreignKeyName: 'inventory_pharmacy_id_fkey'; columns: ['pharmacy_id']; isOneToOne: false; referencedRelation: 'pharmacies'; referencedColumns: ['id'] },
          { foreignKeyName: 'inventory_strain_id_fkey'; columns: ['strain_id']; isOneToOne: false; referencedRelation: 'strains'; referencedColumns: ['id'] },
        ]
      }
      journal_entries: {
        Row:    { created_at: string; entry_date: string; id: string; note: string; rating: number; user_id: string }
        Insert: { created_at?: string; entry_date?: string; id?: string; note: string; rating: number; user_id: string }
        Update: { created_at?: string; entry_date?: string; id?: string; note?: string; rating?: number; user_id?: string }
        Relationships: []
      }
      patient_documents: {
        Row:    { created_at: string; id: string; invoice_url: string | null; patient_pesel: string; prescription_code: string; updated_at: string; user_id: string }
        Insert: { created_at?: string; id?: string; invoice_url?: string | null; patient_pesel: string; prescription_code: string; updated_at?: string; user_id: string }
        Update: { created_at?: string; id?: string; invoice_url?: string | null; patient_pesel?: string; prescription_code?: string; updated_at?: string; user_id?: string }
        Relationships: []
      }
      pharmacies: {
        Row:    { address: string; city: string; created_at: string; email: string | null; id: string; latitude: number; longitude: number; name: string; phone: string | null; slug: string; updated_at: string; voivodeship: string; website: string | null }
        Insert: { address: string; city: string; created_at?: string; email?: string | null; id?: string; latitude: number; longitude: number; name: string; phone?: string | null; slug: string; updated_at?: string; voivodeship: string; website?: string | null }
        Update: { address?: string; city?: string; created_at?: string; email?: string | null; id?: string; latitude?: number; longitude?: number; name?: string; phone?: string | null; slug?: string; updated_at?: string; voivodeship?: string; website?: string | null }
        Relationships: []
      }
      prescriptions: {
        Row:    { brand: string; created_at: string; dose: string; id: string; refills_left: number; strain_name: string; user_id: string; valid_until: string }
        Insert: { brand: string; created_at?: string; dose: string; id?: string; refills_left?: number; strain_name: string; user_id: string; valid_until: string }
        Update: { brand?: string; created_at?: string; dose?: string; id?: string; refills_left?: number; strain_name?: string; user_id?: string; valid_until?: string }
        Relationships: []
      }
      strains: {
        Row:    { cbd_pct: number; created_at: string; dominant_terpenes: string[] | null; id: string; image_url: string | null; lineage: string | null; name: string; producer: string; thc_pct: number }
        Insert: { cbd_pct: number; created_at?: string; dominant_terpenes?: string[] | null; id?: string; image_url?: string | null; lineage?: string | null; name: string; producer: string; thc_pct: number }
        Update: { cbd_pct?: number; created_at?: string; dominant_terpenes?: string[] | null; id?: string; image_url?: string | null; lineage?: string | null; name?: string; producer?: string; thc_pct?: number }
        Relationships: []
      }
    }
    Views:          { [_ in never]: never }
    Functions:      { [_ in never]: never }
    Enums:          { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<T extends keyof DefaultSchema['Tables']> = DefaultSchema['Tables'][T]['Row']
export const Constants = { public: { Enums: {} } } as const
