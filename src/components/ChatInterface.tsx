// src/components/ChatInterface.tsx (CÓDIGO DE TESTE)
"use client";

// Importações do LangGraph removidas temporariamente
import { useState } from "react";

export default function ChatInterface() {
  const [inputMessage, setInputMessage] = useState("");

  // Lógica do useStream removida. Apenas um componente React simples.
  const isLoading = false;
  const messages = [
    { id: "1", type: "ai", content: "Olá! Este é um teste de renderização." },
    { id: "2", type: "human", content: "O chat está funcionando?" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mensagem enviada: ${inputMessage}`);
    setInputMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="p-4 bg-white shadow-md">
        <h1 className="text-xl font-bold text-gray-800">
          TESTE: Se você vir isso, o problema é o useStream()
        </h1>
        <p className="text-sm text-red-500">
          Se a página ainda estiver em branco, o problema é a instalação da
          dependência ou a configuração do Next.js.
        </p>
      </header>

      {/* Área de Mensagens */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
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
            disabled={isLoading}
          />

          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-150"
            disabled={!inputMessage.trim()}
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}