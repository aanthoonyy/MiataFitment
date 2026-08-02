import { supabase } from "@/provider/AuthProvider";
import type { SavedConfig, SavedConfigPayload } from "@/types/garage";

export async function createGarageConfig(args: {
  userId: string;
  name: string;
  payload: SavedConfigPayload;
}) {
  const { userId, name, payload } = args;

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

export async function listGarageConfigs(
  userId: string
): Promise<SavedConfig[]> {
  const { data, error } = await supabase
    .from("garage_configs")
    .select("id,name,updated_at,payload")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    updatedAt: row.updated_at,
    payload: row.payload,
  }));
}

export async function updateGarageConfig(args: {
  id: string;
  payload: SavedConfigPayload;
}): Promise<Pick<SavedConfig, "id" | "name" | "updatedAt">> {
  const { id, payload } = args;

  const { data, error } = await supabase
    .from("garage_configs")
    .update({ payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id,name,updated_at")
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    updatedAt: data.updated_at,
  };
}

export async function deleteGarageConfig(id: string) {
  const { error } = await supabase.from("garage_configs").delete().eq("id", id);

  if (error) throw error;
}
