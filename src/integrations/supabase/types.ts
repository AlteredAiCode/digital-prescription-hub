export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      medicines: {
        Row: {
          composition: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          type: Database["public"]["Enums"]["medicine_type"]
          updated_at: string
        }
        Insert: {
          composition?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          type?: Database["public"]["Enums"]["medicine_type"]
          updated_at?: string
        }
        Update: {
          composition?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          type?: Database["public"]["Enums"]["medicine_type"]
          updated_at?: string
        }
        Relationships: []
      }
      prescription_medicines: {
        Row: {
          composition: string | null
          created_at: string
          dosage_afternoon: number
          dosage_morning: number
          dosage_night: number
          id: string
          medicine_name: string
          medicine_type: Database["public"]["Enums"]["medicine_type"]
          prescription_id: string
          quantity: number | null
          timing_freq_duration: string | null
        }
        Insert: {
          composition?: string | null
          created_at?: string
          dosage_afternoon?: number
          dosage_morning?: number
          dosage_night?: number
          id?: string
          medicine_name: string
          medicine_type?: Database["public"]["Enums"]["medicine_type"]
          prescription_id: string
          quantity?: number | null
          timing_freq_duration?: string | null
        }
        Update: {
          composition?: string | null
          created_at?: string
          dosage_afternoon?: number
          dosage_morning?: number
          dosage_night?: number
          id?: string
          medicine_name?: string
          medicine_type?: Database["public"]["Enums"]["medicine_type"]
          prescription_id?: string
          quantity?: number | null
          timing_freq_duration?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescription_medicines_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          bp: string | null
          created_at: string
          date_time: string
          diagnosis: string | null
          id: string
          next_appointment: string | null
          patient_age: number | null
          patient_gender: string | null
          patient_name: string
          patient_phone: string | null
          prescribed_tests: string | null
          pulse: string | null
          spo2: string | null
          updated_at: string
        }
        Insert: {
          bp?: string | null
          created_at?: string
          date_time?: string
          diagnosis?: string | null
          id?: string
          next_appointment?: string | null
          patient_age?: number | null
          patient_gender?: string | null
          patient_name: string
          patient_phone?: string | null
          prescribed_tests?: string | null
          pulse?: string | null
          spo2?: string | null
          updated_at?: string
        }
        Update: {
          bp?: string | null
          created_at?: string
          date_time?: string
          diagnosis?: string | null
          id?: string
          next_appointment?: string | null
          patient_age?: number | null
          patient_gender?: string | null
          patient_name?: string
          patient_phone?: string | null
          prescribed_tests?: string | null
          pulse?: string | null
          spo2?: string | null
          updated_at?: string
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
      medicine_type: "TAB" | "CAP" | "SYR" | "INJ" | "OINT" | "DROP" | "OTHER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      medicine_type: ["TAB", "CAP", "SYR", "INJ", "OINT", "DROP", "OTHER"],
    },
  },
} as const
