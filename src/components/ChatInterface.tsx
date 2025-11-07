"use client";

import { useThread } from "@/providers/ThreadProvider";
import { Send, Loader2, StopCircle } from "lucide-react"; // Plus removido
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ChatWelcomeScreen from "./ChatWelcomeScreen";

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
  const showWelcomeScreen = displayedMessages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-background">
      
      {/* Área de Mensagens / Tela de Boas-Vindas */}
      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {showWelcomeScreen ? (
          <ChatWelcomeScreen />
        ) : (
          displayedMessages.map((message, index) => (
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
          ))
        )}
        
        {/* Indicador de digitação para o agente - Simplificado */}
        {isStreaming && (
            <div className="flex justify-start items-center space-x-2 ml-4">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">O Agente está digitando...</p>
            </div>
        )}
      </div>

      {/* Formulário de Input - Aplicando rounded-t-xl aqui */}
      <form onSubmit={handleSubmit} className="p-4 bg-card border-t border-border shadow-2xl rounded-t-xl">
        {/* Container centralizado e limitado em largura */}
        <div className="flex items-center mx-auto w-full md:max-w-3xl">
          
          {/* Input Wrapper: relative position for integrated button */}
          <div className="relative flex-1">
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Pergunte alguma coisa"
              // Removendo rounded-full, usando arredondamento padrão e pr-12
              className="w-full h-12 p-3 bg-input border-border focus-visible:ring-0 focus-visible:ring-offset-0 pr-12" 
              disabled={thread.isLoading}
            />
            
            {/* Botão de Envio integrado */}
            {!thread.isLoading && (
                <Button
                    type="submit"
                    size="icon"
                    // Mantendo rounded-full para o botão de ícone
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                    disabled={!inputMessage.trim()}
                >
                    <Send className="h-5 w-5" />
                </Button>
            )}
          </div>

          {/* Botão de Parar (se carregando) */}
          {thread.isLoading && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => thread.stop()}
              // Usando rounded-lg para o botão de parar
              className="px-4 h-12 ml-3 rounded-lg"
            >
              <StopCircle className="h-5 w-5 mr-2" />
              Parar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}