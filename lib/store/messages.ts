import { create } from "zustand";
import { LIMIT_MESSAGE } from "../constant";

export type IMessage = {
  created_at: string;
  id: string;
  is_edit: boolean;
  send_by: string;
  text: string;
  users: {
    avatar_url: string;
    created_at: string;
    display_name: string;
    id: string;
  } | null;
};

interface MessageState {
  hasMore: boolean;
  page: number;
  messages: IMessage[];
  actionMessage: IMessage | undefined;
  addMessage: (message: IMessage) => void;
  setActionMessage: (message: IMessage | undefined) => void;
  optimisticIds: string[];
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (message: IMessage) => void;
  setOptimisticIds: (id: string) => void;
  setMessages: (messages: IMessage[]) => void;
}

export const useMessage = create<MessageState>()((set) => ({
  hasMore: true,
  page: 1,
  messages: [],
  actionMessage: undefined,
  setMessages: (messages) =>
    set((state) => ({
      messages: [...messages, ...state.messages],
      page: state.page + 1,
      hasMore: messages.length >= LIMIT_MESSAGE,
    })),
  addMessage: (newMessages) =>
    set((state) => ({
      messages: [...state.messages, newMessages],
      //optimisticIds: [...state.optimisticIds, newMessages.id],
    })),
  optimisticIds: [],
  setActionMessage: (message) => set(() => ({ actionMessage: message })),
  optimisticDeleteMessage: (messageId) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => message.id !== messageId),
      };
    }),

  optimisticUpdateMessage: (updateMessage) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => {
          if (message.id === updateMessage.id) {
            message.text = updateMessage.text;
            message.is_edit = updateMessage.is_edit;
          }
          return message;
        }),
      };
    }),

  setOptimisticIds: (id: string) =>
    set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),
  ////메세지 추가 시 응답값도 오기때문에 두번 입력되는 현상 발생, 방지하기 위해 고유한 아이디값 부여
}));
