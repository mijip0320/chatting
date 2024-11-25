import { create } from "zustand";

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
  messages: IMessage[];
  actionMessage: IMessage | undefined;
  addMessage: (message: IMessage) => void;
  setActionMessage: (message: IMessage | undefined) => void;
  optimisticIds: string[];
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (message: IMessage) => void;
  setOptimisticIds: (id: string) => void;
}

export const useMessage = create<MessageState>()((set) => ({
  messages: [],
  actionMessage: undefined,
  addMessage: (newMessages) =>
    set((state) => ({
      messages: [...state.messages, newMessages],
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
            (message.text = updateMessage.text),
              (message.is_edit = updateMessage.is_edit);
          }

          return message;
        }),
      };
    }),

  setOptimisticIds: (id: string) =>
    set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),
}));
