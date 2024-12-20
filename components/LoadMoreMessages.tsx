import React from "react";
import { Button } from "./ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { LIMIT_MESSAGE } from "@/lib/constant";
import { getFromAndTo } from "@/lib/utils";
import { useMessage } from "@/lib/store/messages";
import { toast } from "sonner";

export default function LoadMoreMessages() {
  const page = useMessage((state) => state.page);
  const { from, to } = getFromAndTo(page, LIMIT_MESSAGE);
  const setMessages = useMessage((state) => state.setMessages);
  const hasMore = useMessage((state) => state.hasMore);

  const supabase = supabaseBrowser();
  const fetchMore = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*,users(*)")
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setMessages(data.reverse());
    }
  };

  return hasMore ? (
    <Button variant={"outline"} className="w-full" onClick={fetchMore}>
      Load More
    </Button>
  ) : (
    <></>
  );
}
