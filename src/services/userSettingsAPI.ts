import { supabase } from "@/lib/supabase";

export type UserSettings = {
  id: string;
  userId: string;
  darkMode: boolean;
  metric: boolean;
};

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await supabase
    .from("user_settings")
    .select("id,user_id,dark_mode,metric")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    darkMode: data.dark_mode,
    metric: data.metric,
  };
}

export async function saveUserSettings(args: {
  userId: string;
  darkMode: boolean;
  metric: boolean;
}): Promise<UserSettings> {
  const { userId, darkMode, metric } = args;

  const { data, error } = await supabase
    .from("user_settings")
    .upsert(
      {
        user_id: userId,
        dark_mode: darkMode,
        metric,
      },
      { onConflict: "user_id" }
    )
    .select("id,user_id,dark_mode,metric")
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    darkMode: data.dark_mode,
    metric: data.metric,
  };
}
