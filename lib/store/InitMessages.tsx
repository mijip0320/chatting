"use client";
import React, { useEffect, useRef } from "react";

import { IMessage, useMessage } from "./messages";

export default function InitMessages({ messages }: { messages: IMessage[] }) {
  const initState = useRef(false);
  //const hasMore = messages.length >= LIMIT_MESSAGE;

  useEffect(() => {
    if (!initState.current) {
      useMessage.setState({ messages });
    }
    initState.current = true;
    // eslint-disable-next-line
  }, []);

  return <></>;
}
