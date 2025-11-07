"use client";

import { useThread } from "@/providers/ThreadProvider";
import { Send, Loader2, StopCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import ChatHeader from "./ChatHeader";

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
  const showHeader = displayedMessages.length > 0;

  // Calculamos o padding inferior necessário para que a última mensagem não fique escondida pelo formulário fixo.
  const paddingBottom = showHeader ? "pb-[100px]" : "pb-4"; 

  // Se for a tela de boas-vindas, precisamos garantir que ela ocupe a altura restante para centralizar o conteúdo.
  // Usamos min-h-[calc(100vh - altura_do_header - altura_do_input)]
  const welcomeScreenClasses = showWelcomeScreen 
    ? "min-h-[calc(100vh-100px)] flex flex-col justify-center" 
    : "";

  return (
    // O ChatInterface agora ocupa w-full
    <div className="bg-background min-h-screen">
      
      {/* 1. Cabeçalho (Visível após a primeira mensagem) */}
      {/* O ChatHeader já é sticky e limitado a md:max-w-3xl internamente */}
      {showHeader && <ChatHeader />}

      {/* 2. Área de Mensagens / Tela de Boas-Vindas */}
      <div className={`space-y-6 p-4 ${welcomeScreenClasses} ${paddingBottom}`}>
        {showWelcomeScreen ? (
          <ChatWelcomeScreen />
        ) : (
          // Centralizando as mensagens horizontalmente em telas grandes
          <div className="mx-auto md:max-w-3xl space-y-6">
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
            
            {/* Indicador de digitação para o agente - Simplificado */}
            {isStreaming && (
                <div className="flex justify-start items-center space-x-2 ml-4">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">O Agente está digitando...</p>
                </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Formulário de Input (Fixo na parte inferior) */}
      {/* Aplicando fixed bottom-0 e w-full para fixar na parte inferior da tela */}
      {/* O wrapper fixed agora garante que o formulário limitado (md:max-w-3xl) seja centralizado na viewport. */}
      <div className="fixed bottom-0 w-full flex justify-center z-20">
        <form 
          onSubmit={handleSubmit} 
          className="p-4 bg-card border-t border-border shadow-2xl rounded-t-xl md:max-w-3xl w-full"
        >
          <div className="flex items-center w-full">
            
            {/* Input Wrapper: relative position for integrated button */}
            <div className="relative flex-1">
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Como posso te ajudar?"
                className="w-full h-12 p-3 bg-input border-border focus-visible:ring-0 focus-visible:ring-offset-0 pr-12" 
                disabled={thread.isLoading}
              />
              
              {/* Botão de Envio integrado */}
              {!thread.isLoading && (
                  <Button
                      type="submit"
                      size="icon"
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
                className="px-4 h-12 ml-3 rounded-lg"
              >
                <StopCircle className="h-5 w-5 mr-2" />
                Parar
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}