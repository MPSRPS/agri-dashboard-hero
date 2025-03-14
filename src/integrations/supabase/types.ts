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
      disease_environmental_factors: {
        Row: {
          created_at: string
          disease_id: string
          factor_name: string
          factor_value: string
          id: string
        }
        Insert: {
          created_at?: string
          disease_id: string
          factor_name: string
          factor_value: string
          id?: string
        }
        Update: {
          created_at?: string
          disease_id?: string
          factor_name?: string
          factor_value?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disease_environmental_factors_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "plant_diseases"
            referencedColumns: ["id"]
          },
        ]
      }
      disease_preventive_measures: {
        Row: {
          created_at: string
          disease_id: string
          id: string
          measure: string
        }
        Insert: {
          created_at?: string
          disease_id: string
          id?: string
          measure: string
        }
        Update: {
          created_at?: string
          disease_id?: string
          id?: string
          measure?: string
        }
        Relationships: [
          {
            foreignKeyName: "disease_preventive_measures_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "plant_diseases"
            referencedColumns: ["id"]
          },
        ]
      }
      disease_symptoms: {
        Row: {
          created_at: string
          disease_id: string
          id: string
          symptom: string
        }
        Insert: {
          created_at?: string
          disease_id: string
          id?: string
          symptom: string
        }
        Update: {
          created_at?: string
          disease_id?: string
          id?: string
          symptom?: string
        }
        Relationships: [
          {
            foreignKeyName: "disease_symptoms_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "plant_diseases"
            referencedColumns: ["id"]
          },
        ]
      }
      disease_treatments: {
        Row: {
          created_at: string
          disease_id: string
          id: string
          treatment: string
        }
        Insert: {
          created_at?: string
          disease_id: string
          id?: string
          treatment: string
        }
        Update: {
          created_at?: string
          disease_id?: string
          id?: string
          treatment?: string
        }
        Relationships: [
          {
            foreignKeyName: "disease_treatments_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "plant_diseases"
            referencedColumns: ["id"]
          },
        ]
      }
      plant_analysis_history: {
        Row: {
          analysis_date: string
          confidence: number
          id: string
          image_path: string
          main_disease_id: string | null
          user_id: string | null
        }
        Insert: {
          analysis_date?: string
          confidence: number
          id?: string
          image_path: string
          main_disease_id?: string | null
          user_id?: string | null
        }
        Update: {
          analysis_date?: string
          confidence?: number
          id?: string
          image_path?: string
          main_disease_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plant_analysis_history_main_disease_id_fkey"
            columns: ["main_disease_id"]
            isOneToOne: false
            referencedRelation: "plant_diseases"
            referencedColumns: ["id"]
          },
        ]
      }
      plant_diseases: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
