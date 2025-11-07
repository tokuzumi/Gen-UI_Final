// src/components/ChatInterface.tsx
"use client";

import { useThread } from "@/providers/ThreadProvider";

export default function ChatInterface() {
  const {
    thread,
    displayedMessages,
    inputMessage,
    setInputMessage,
    handleSubmit,
  } = useThread();

  let statusText = "Conectando...";

  if (thread.error) {
    statusText = "Erro de Conexão";
  } else if (thread.isLoading) {
    // O agente está ativo (enviando ou recebendo)
    statusText = "Digitando...";
  } else if (thread.isConnected || displayedMessages.length > 0) {
    // Se thread.isConnected for true OU se já houver mensagens no histórico,
    // consideramos a conexão funcional e o agente pronto.
    statusText = "Conectado e Pronto";
  } else {
    // Se não estiver carregando, não estiver conectado e não houver histórico.
    statusText = "Desconectado";
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="p-4 bg-white shadow-md">
        <h1 className="text-xl font-bold text-gray-800">Gen-UI (Gen-UI.com.br)</h1>
        <p className="text-sm text-gray-500">
          Status:{" "}
          {statusText}
        </p>
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