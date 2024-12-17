import React from "react";

export default function ChatAbout() {
  return (
    <div className="flex-1 flex item-center justify-center">
      <div className="text-center space-y-5 content-center">
        <h1 className="text-3xl font-bold">Welcome to Daily Chat</h1>
        <p className="w-96">
          This is a chat application that is powered by supabase realtime db.
          Please Login to start chatting
        </p>
      </div>
    </div>
  );
}
