import { supabase } from "@/provider/AuthProvider";

export async function trackButtonClick() {
  const { error } = await supabase.rpc("increment_analytics_clicks");
  if (error) throw error;
}
