"use client";
import React from "react";
import { Input } from "./ui/input";

export default function ChatInput() {
  const handleSendMessage = (text: string) => {
    alert(text);
  };
  return (
    <div className="p-5">
      <Input
        placeholder="send message"
        color="white"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}
