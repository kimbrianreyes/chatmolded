"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createBotAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const name = (formData.get("name") as string) || "My AI Assistant";
  const welcome_message =
    (formData.get("welcome_message") as string) || "Hello! How can I help you today?";
  const provider = (formData.get("provider") as string) || "groq";
  const theme = (formData.get("theme") as string) || "emerald";

  const { data, error } = await (supabase.from("bots") as any)
    .insert({
      user_id: user.id,
      name,
      welcome_message,
      provider: provider as any,
      theme: theme as any,
      allowed_origins: ["*"],
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  return data;
}

export async function deleteBotAction(botId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("bots")
    .delete()
    .eq("id", botId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}
