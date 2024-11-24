"use client";
import { useMessage } from "@/lib/store/messages";
import React from "react";

export default function ListMessages() {
  const messages = useMessage((state) => state.messages);

  return (
    <div className="flex-1 flex flex-col p-5 h-full overflow-y-auto ">
      <div className="flex-1"></div>
      <div className="space-y-7">
        {messages.map((message, index) => {
          return (
            <div key={index} className="flex gap-2">
              <div className="h-10 w-10 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <h1 className="font-bold">Miji</h1>
                  <h1 className="text-sm text-gray-400 ">
                    {new Date().toDateString()}
                  </h1>
                </div>
                <p className="text-gray-300">
                  Displays a form input field or a component that looks like an
                  input field.Displays a form input field or a component that
                  looks like an input field. Displays a form input field or a
                  component that looks like an input field. Displays a form
                  input field or a component that looks like an input
                  field.Displays a form input field or a component that looks
                  like an input field.Displays a form input field or a component
                  that looks like an input field.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
