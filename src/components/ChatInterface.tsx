// src/components/ChatInterface.tsx
"use client";

import { useStream } from "@langchain/langgraph-sdk/react";
import type { Message } from "@langchain/langgraph-sdk";
import { useState, useMemo } from "react";

// Define a interface para o estado do agente.
interface AgentState {
  messages: Message[];
}

// Define a URL da API usando a variável de ambiente, com um fallback para o padrão local.
const LANGGRAPH_API_URL =
  process.env.NEXT_PUBLIC_LANGGRAPH_API_URL || "http://localhost:2024";

export default function ChatInterface() {
  const [inputMessage, setInputMessage] = useState("");
  // NOVO: Estado para a mensagem do usuário que acabou de ser enviada,
  // mas ainda não foi confirmada pelo servidor.
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null);

  // O hook useStream se conecta ao servidor do agente LangGraph.
  const thread = useStream<AgentState>({
    apiUrl: LANGGRAPH_API_URL,
    assistantId: "agent",
    messagesKey: "messages",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(), // ID temporário
      type: "human",
      content: inputMessage,
    };

    // 1. Adiciona a mensagem ao estado pendente (para exibição imediata)
    setPendingMessage(userMessage);

    // 2. Envia a mensagem para o agente.
    thread.submit({
      messages: [userMessage],
    });

    setInputMessage("");
  };

  // 3. Combina as mensagens do thread com a mensagem pendente (se houver)
  const displayedMessages = useMemo(() => {
    let messages = [...thread.messages];
    
    // Se a thread estiver carregando e houver uma mensagem pendente,
    // e a mensagem pendente ainda não estiver no thread.messages, adicione-a.
    if (thread.isLoading && pendingMessage) {
        // Verifica se a mensagem pendente já foi incluída pelo servidor
        const isConfirmed = messages.some(
            (msg) => msg.content === pendingMessage.content && msg.type === pendingMessage.type
        );
        
        if (!isConfirmed) {
            messages = [...messages, pendingMessage];
        }
    }
    
    // Se o carregamento terminou, a mensagem pendente deve ter sido confirmada
    // e podemos limpar o estado pendente.
    if (!thread.isLoading && pendingMessage) {
        setPendingMessage(null);
    }

    return messages;
  }, [thread.messages, thread.isLoading, pendingMessage]);


  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="p-4 bg-white shadow-md">
        <h1 className="text-xl font-bold text-gray-800">LangGraph Agent Chat</h1>
        <p className="text-sm text-gray-500">Conectado a: {LANGGRAPH_API_URL}</p>
      </header>

      {/* Área de Mensagens */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {displayedMessages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            Diga olá para o seu agente LangGraph!
          </div>
        )}
        {displayedMessages.map((message, index) => (
          <div
            key={message.id || index}
            className={`flex ${
              message.type === "human" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                message.type === "human"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              <p className="font-semibold capitalize mb-1">
                {message.type === "human" ? "Você" : "Agente"}
              </p>
              <p>{message.content as string}</p>
            </div>
          </div>
        ))}
        {thread.isLoading && !pendingMessage && ( // Mostra 'Digitando...' apenas se não for a mensagem pendente
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow">
              <p className="font-semibold mb-1">Agente</p>
              <p>Digitando...</p>
            </div>
          </div>
        )}
      </div>

      {/* Formulário de Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t shadow-lg">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            disabled={thread.isLoading}
          />

          {thread.isLoading ? (
            <button
              type="button"
              onClick={() => thread.stop()}
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-150"
            >
              Parar
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-150"
              disabled={!inputMessage.trim()}
            >
              Enviar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}