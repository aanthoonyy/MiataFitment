import { supabase } from "@/provider/AuthProvider";
import type { SavedConfig } from "@/types/garage";

type GarageConfigRow = {
  id: string;
  user_id: string;
  name: string;
  payload: any;
  payload_preview: string | null;
  updated_at: string;
};

export async function createGarageConfig(args: {
  userId: string;
  name: string;
  payload: any;
  payloadPreview?: string;
}): Promise<SavedConfig> {
  const { userId, name, payload, payloadPreview } = args;

  const { data, error } = await supabase
    .from("garage_configs")
    .insert({
      user_id: userId,
      name,
      payload,
      payload_preview: payloadPreview ?? null,
    })
    .select("id,name,payload_preview,updated_at")
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    payloadPreview: data.payload_preview ?? undefined,
    updatedAt: data.updated_at,
  };
}
