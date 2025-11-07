"use client";

import { useStream } from "@langchain/langgraph-sdk/react";
import type { Message } from "@langchain/langgraph-sdk";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from "react";
import { v4 as uuidv4 } from "uuid";

// Define a interface para o estado do agente.
interface AgentState {
  messages: Message[];
}

// Define a URL da API usando a variável de ambiente, com um fallback para o padrão local.
const LANGGRAPH_API_URL =
  process.env.NEXT_PUBLIC_LANGGRAPH_API_URL || "http://localhost:2024";

// Definir o tipo para o nosso contexto
interface ThreadContextType {
  thread: ReturnType<typeof useStream<AgentState>>;
  displayedMessages: Message[];
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

// Criar o Contexto
const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

// Criar o Componente Provedor
export function ThreadProvider({ children }: { children: ReactNode }) {
  const [inputMessage, setInputMessage] = useState("");

  const thread = useStream<AgentState>({
    apiUrl: LANGGRAPH_API_URL,
    assistantId: "agent",
    messagesKey: "messages",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      type: "human",
      content: inputMessage,
    };

    thread.submit(
      { messages: [userMessage] },
      {
        streamMode: ["values"],
        optimisticValues: (prev) => ({
          ...prev,
          messages: [...(prev.messages ?? []), userMessage],
        }),
      },
    );

    setInputMessage("");
  };

  const displayedMessages = thread.messages;

  // Otimizar o valor do contexto com useMemo
  const contextValue = useMemo(
    () => ({
      thread,
      displayedMessages,
      inputMessage,
      setInputMessage,
      handleSubmit,
    }),
    [thread, displayedMessages, inputMessage],
  );

  return (
    <ThreadContext.Provider value={contextValue}>
      {children}
    </ThreadContext.Provider>
  );
}

// Criar o Hook Customizado
export const useThread = (): ThreadContextType => {
  const context = useContext(ThreadContext);
  if (context === undefined) {
    throw new Error("useThread deve ser usado dentro de um ThreadProvider");
  }
  return context;
};