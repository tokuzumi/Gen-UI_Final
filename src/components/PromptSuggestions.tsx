"use client";

import React from "react";
import { Button } from "./ui/button";
import { useThread } from "@/providers/ThreadProvider";

const SUGGESTIONS = [
  "Quais são os benefícios do programa...",
  "Como funciona o sistema de afiliados bancários?",
  "Que tipos de produtos estão disponíveis no...",
  "Como posso começar a indicar leads pelo...",
];

export default function PromptSuggestions() {
  const { thread, setInputMessage, handleSubmit } = useThread();

  const handleSuggestionClick = (suggestion: string) => {
    // Define a sugestão como input e submete o formulário
    setInputMessage(suggestion);
    
    const simulatedEvent = {
        preventDefault: () => {},
    } as React.FormEvent;

    // Submete a mensagem após um pequeno delay para garantir que o estado do input seja atualizado
    setTimeout(() => {
        thread.submit(
            { messages: [{ id: 'temp', type: 'human', content: suggestion }] },
            {
                streamMode: ["values"],
                optimisticValues: (prev) => ({
                    ...prev,
                    messages: [...(prev.messages ?? []), { id: 'temp', type: 'human', content: suggestion }],
                }),
            },
        );
        setInputMessage(""); // Limpa o input após o envio
    }, 0);
  };

  return (
    // Removendo max-w-3xl em mobile e aplicando-o a partir de md
    <div className="grid grid-cols-2 gap-4 w-full md:max-w-3xl mx-auto px-4 md:grid-cols-4">
      {SUGGESTIONS.map((suggestion, index) => (
        <Button
          key={index}
          variant="secondary"
          className="h-auto p-4 text-left whitespace-normal text-sm font-normal border border-border/50 hover:bg-secondary/70"
          onClick={() => handleSuggestionClick(suggestion)}
          disabled={thread.isLoading}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}