"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from "react";
import { v4 as uuidv4 } from "uuid";

// Tipos básicos para mensagens
export interface Message {
  id?: string;
  type: "human" | "ai";
  content: string;
}

interface ThreadContextType {
  thread: {
    isLoading: boolean;
    stop: () => void; // Placeholder por enquanto
  };
  displayedMessages: Message[];
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

export function ThreadProvider({ children }: { children: ReactNode }) {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsg: Message = {
      id: uuidv4(),
      type: "human",
      content: inputMessage,
    };

    // Atualiza UI otimisticamente
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg.content }),
      });

      if (!response.ok) {
        throw new Error("Falha na comunicação com o backend");
      }

      const data = await response.json();

      // O backend retorna {"messages": [AIMessage(...)]}
      // Precisamos extrair o conteúdo da última mensagem
      const aiResponse = data.messages[data.messages.length - 1];

      const aiMsg: Message = {
        id: uuidv4(),
        type: "ai",
        content: aiResponse.content || JSON.stringify(aiResponse),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      // Opcional: Adicionar mensagem de erro na UI
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      thread: {
        isLoading,
        stop: () => setIsLoading(false),
      },
      displayedMessages: messages,
      inputMessage,
      setInputMessage,
      handleSubmit,
    }),
    [isLoading, messages, inputMessage]
  );

  return (
    <ThreadContext.Provider value={contextValue}>
      {children}
    </ThreadContext.Provider>
  );
}

export const useThread = (): ThreadContextType => {
  const context = useContext(ThreadContext);
  if (context === undefined) {
    throw new Error("useThread deve ser usado dentro de um ThreadProvider");
  }
  return context;
};