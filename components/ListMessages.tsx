"use client";
import { IMessage, useMessage } from "@/lib/store/messages";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { DeleteAlert, EditAlert } from "./MessageActions";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { ArrowDown } from "lucide-react";
import LoadMoreMessages from "./LoadMoreMessages";

export default function ListMessages() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [userScroll, setUserScroll] = useState(false);
  const [notification, setNotification] = useState(0);
  //데이터베이스와 상호작용할 액션들
  const {
    messages,
    addMessage,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  } = useMessage((state) => state);

  const supabase = supabaseBrowser();

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          //optimistic update개념(사용자 경험 향상) :
          //-요청을 보내는 것과 동시에 결과를 예측하고, 예측한 결과를 UI에 반영하는 것
          //- 좋아요나 장바구니 담기 기능은 사용자 입장에서 바로 기능이 수행되는것을 기대함
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
          const scrollContainer = scrollRef.current;
          if (
            scrollContainer.scrollTop <
            scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
          ) {
            setNotification((current) => current + 1);
          }
        }
      )
      .on(
        //삭제 시 실시간으로 업데이트
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          optimisticDeleteMessage(payload.old.id);
        }
      )
      .on(
        //업데이트 시 실시간으로 업데이트
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          optimisticUpdateMessage(payload.new as IMessage);
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

    if (scrollContainer && !userScroll) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScroll(isScroll);
      //맨 아래 위치해있다면
      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        setNotification(0);
      }
    }
  };

  const scrollDown = () => {
    setNotification(0);
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  return (
    <div
      className="flex-1 flex flex-col p-5 h-full overflow-y-auto gap-5"
      ref={scrollRef}
      onScroll={handleOnScroll}
    >
      <div className="flex-1">
        <LoadMoreMessages />
      </div>
      <div className="space-y-7">
        {messages.map((message, index) => {
          return <Message key={index} message={message} />;
        })}
      </div>
      {userScroll && (
        <div className="absolute bottom-20 w-full">
          {notification ? (
            <div
              onClick={scrollDown}
              className="w-36 mx-auto bg-indigo-500 p-1 rounded-md cursor-pointer"
            >
              <h1>New {notification} messages</h1>
            </div>
          ) : (
            <div
              className="w-10 h-10 bg-blue-500 rounded-full justify-center items-center flex mx-auto border cursor-pointer hover:scale-110 transition-all"
              onClick={scrollDown}
            >
              <ArrowDown />
            </div>
          )}
        </div>
      )}

      <DeleteAlert />
      <EditAlert />
    </div>
  );
}
