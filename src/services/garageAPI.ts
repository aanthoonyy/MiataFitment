import { supabase } from "@/provider/AuthProvider";

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
