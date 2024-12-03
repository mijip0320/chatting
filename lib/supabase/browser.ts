import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../types/supabase";

//프론트와 데이터를 받아서 서버와 상호작용을 해주는 역할
export const supabaseBrowser = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
