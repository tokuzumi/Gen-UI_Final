// src/components/ChatInterface.tsx
"use client";

import { useThread } from "@/providers/ThreadProvider";
import { Send, Loader2, StopCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function ChatInterface() {
  const {
    thread,
    displayedMessages,
    inputMessage,
    setInputMessage,
    handleSubmit,
  } = useThread();

  const isSending = thread.isLoading && inputMessage.trim() !== "";
  const isStreaming = thread.isLoading && inputMessage.trim() === "";

  // Lógica para o Status do Cabeçalho:
  let connectionStatusText = "Conectando...";

  if (thread.error) {
    connectionStatusText = "Erro de Conexão";
  } else if (isStreaming) {
    connectionStatusText = "Digitando...";
  } else if (thread.isConnected || displayedMessages.length > 0) {
    connectionStatusText = "Conectado";
  } else {
    connectionStatusText = "Desconectado";
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="p-4 bg-card shadow-lg border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Valdomiro AI</h1>
        <p className="text-sm text-muted-foreground">
          Status:{" "}
          {connectionStatusText}
        </p>
      </header>

      {/* Área de Mensagens */}
      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {displayedMessages.length === 0 && (
          <div className="text-center text-muted-foreground mt-10">
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
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-md ${
                message.type === "human"
                  ? "bg-card text-foreground border border-border rounded-tr-none"
                  : "text-foreground rounded-tl-sm"
              }`}
            >
              {message.type === "assistant" && (
                <p className="font-semibold capitalize mb-1 text-sm">Agente</p>
              )}
              <p className="text-base whitespace-pre-wrap">{message.content as string}</p>
            </div>
          </div>
        ))}
        
        {/* Indicador de digitação para o agente */}
        {isStreaming && (
            <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-xl text-foreground rounded-tl-sm">
                    <p className="font-semibold capitalize mb-1 text-sm">Agente</p>
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <p className="text-base text-muted-foreground">Digitando...</p>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Formulário de Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-card border-t border-border shadow-2xl">
        <div className="flex space-x-3 items-center">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-3 bg-input border-border focus-visible:ring-primary"
            disabled={thread.isLoading}
          />

          {thread.isLoading ? (
            <Button
              type="button"
              variant="destructive"
              onClick={() => thread.stop()}
              className="px-4 h-12"
            >
              <StopCircle className="h-5 w-5 mr-2" />
              Parar
            </Button>
          ) : (
            <Button
              type="submit"
              className="px-4 h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!inputMessage.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}