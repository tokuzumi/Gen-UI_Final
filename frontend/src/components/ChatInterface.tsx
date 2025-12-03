"use client";

import { useThread } from "@/providers/ThreadProvider";
import { Send, Loader2, StopCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import ChatHeader from "./ChatHeader";
import React, { useRef, useEffect } from "react";

// Definindo as larguras para clareza
const WELCOME_SCREEN_WIDTH = "md:max-w-3xl";
const MESSAGE_CONTENT_WIDTH = "md:max-w-5xl";

export default function ChatInterface() {
  const {
    thread,
    displayedMessages,
    inputMessage,
    setInputMessage,
    handleSubmit,
  } = useThread();

  // 1. Criando a referência para o contêiner de mensagens
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isSending = thread.isLoading && inputMessage.trim() !== "";
  const isStreaming = thread.isLoading && inputMessage.trim() === "";
  const showWelcomeScreen = displayedMessages.length === 0;
  const showHeader = displayedMessages.length > 0;

  // 2. Função de rolagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 3. Efeito para rolar sempre que as mensagens mudarem
  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages]);

  // Calculamos o padding inferior necessário para que a última mensagem não fique escondida pelo formulário fixo.
  // Aumentando para 120px em desktop (md)
  const paddingBottom = showHeader ? "pb-[100px] md:pb-[120px]" : "pb-4";

  // Se for a tela de boas-vindas, precisamos garantir que ela ocupe a altura restante para centralizar o conteúdo.
  const welcomeScreenClasses = showWelcomeScreen
    ? "min-h-[calc(100vh-100px)] flex flex-col justify-center"
    : "";

  return (
    // O ChatInterface agora ocupa w-full
    <div className="bg-background min-h-screen">

      {/* 1. Cabeçalho (Visível após a primeira mensagem) - Usa md:max-w-3xl (definido em ChatHeader.tsx) */}
      {showHeader && <ChatHeader />}

      {/* 2. Área de Mensagens / Tela de Boas-Vindas */}
      {/* Reduzindo o padding horizontal para px-2 em mobile, mantendo py-4 */}
      <div className={`space-y-6 px-2 py-4 md:p-4 ${welcomeScreenClasses} ${paddingBottom}`}>
        {showWelcomeScreen ? (
          <ChatWelcomeScreen />
        ) : (
          // Usando a largura expandida (md:max-w-5xl) APENAS para o conteúdo das mensagens
          <div className={`mx-auto ${MESSAGE_CONTENT_WIDTH} space-y-6`}>
            {displayedMessages.map((message, index) => {
              const isHuman = message.type === "human";

              // Largura da bolha: max-w-xs em mobile. Em desktop, max-w-md para humano, max-w-xl para agente.
              const bubbleMaxWidth = isHuman ? "lg:max-w-md" : "lg:max-w-xl";

              return (
                <div
                  key={message.id || index}
                  className={`flex ${isHuman ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    // Aplicando a largura condicional
                    className={`max-w-xs ${bubbleMaxWidth} px-4 py-3 rounded-xl shadow-md ${isHuman
                        ? "bg-card text-foreground border border-border rounded-tr-none"
                        : "text-foreground rounded-tl-sm"
                      }`}
                  >
                    {!isHuman && (
                      <p className="font-semibold capitalize mb-1 text-sm">Agente</p>
                    )}
                    <p className="text-base whitespace-pre-wrap">{message.content as string}</p>
                  </div>
                </div>
              );
            })}

            {/* Indicador de digitação para o agente - Ajustando margem */}
            {isStreaming && (
              <div className="flex justify-start items-center space-x-2 ml-2 md:ml-0">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">O Agente está digitando...</p>
              </div>
            )}

            {/* 4. Elemento de referência para rolagem */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 3. Formulário de Input (Fixo na parte inferior) */}
      <div className="fixed bottom-0 w-full flex justify-center z-20">
        <form
          onSubmit={handleSubmit}
          // Aumentando a transparência para bg-card/60
          className={`p-4 ${WELCOME_SCREEN_WIDTH} w-full`}
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