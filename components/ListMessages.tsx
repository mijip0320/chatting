"use client";
import { IMessage, useMessage } from "@/lib/store/messages";
import React, { useEffect, useReducer, useRef } from "react";
import Message from "./Message";
import { DeleteAlert, EditAlert } from "./MessageActions";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { Container } from "postcss";

export default function ListMessages() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const { messages, addMessage, optimisticIds } = useMessage((state) => state);
  const supabase = supabaseBrowser();

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          if (!optimisticIds.includes(payload.new.id)) {
            const { error, data } = await supabase
              .from("users")
              .select("*")
              .eq("id", payload.new.send_by)
              .single();

            if (error) {
              toast.error(error.message);
            } else {
              const newMessage = {
                ...payload.new,
                users: data,
              };

              addMessage(newMessage as IMessage);
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [messages]);

  //자동 스크롤
  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="flex-1 flex flex-col p-5 h-full overflow-y-auto"
      ref={scrollRef}
    >
      <div className="flex-1"></div>
      <div className="space-y-7">
        {messages.map((message, index) => {
          return <Message key={index} message={message} />;
        })}
      </div>
      <DeleteAlert />
      <EditAlert />
    </div>
  );
}
