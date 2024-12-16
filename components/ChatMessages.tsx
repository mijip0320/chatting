import React, { Suspense } from "react";
import ListMessages from "./ListMessages";
import { supabaseServer } from "@/lib/supabase/server";
import InitMessages from "@/lib/store/InitMessages";
import { LIMIT_MESSAGE } from "@/lib/constant";

//server component
export default async function ChatMessages() {
  const supabase = supabaseServer();

  const data = (await supabase)
    .from("messages")
    .select("*,users(*)")
    .range(0, LIMIT_MESSAGE)
    .order("created_at", { ascending: false });

  return (
    <Suspense fallback={"loading..."}>
      <ListMessages />
      <InitMessages messages={(await data).data?.reverse() || []} />
    </Suspense>
  );
}
