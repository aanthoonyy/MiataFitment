import { supabase } from "@/provider/AuthProvider";
import type { SavedConfig } from "@/types/garage";

export async function createGarageConfig(args: {
  userId: string;
  name: string;
  payload: any;
}) {
  const { userId, name, payload } = args;

  console.log(userId)

  const { data, error } = await supabase
    .from("garage_configs")
    .insert({
      user_id: userId,
      name,
      payload,
    })
    .select("id,name,updated_at")
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    updatedAt: data.updated_at,
  };
}

export async function listGarageConfigs(userId: string): Promise<SavedConfig[]> {
  const { data, error } = await supabase
    .from("garage_configs")
    .select("id,name,updated_at,payload")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    updatedAt: row.updated_at,
    payload: row.payload,
  }));
}

export async function deleteGarageConfig(id: string) {
  const { error } = await supabase
    .from("garage_configs")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

