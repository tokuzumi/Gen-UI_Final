"use client";

import React from "react";
import { Button } from "./ui/button";
import { useThread } from "@/providers/ThreadProvider";

const SUGGESTIONS = [
  "Seu site está deixando de fazer negócios ...",
  "Só existe uma forma de implementar IA ...",
  "A UI Generativa é a nova era dos sites",
  "Por que você precisa da Gen-UI?",
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
    // w-full garante que ele use 100% da largura do pai (que é 100% da tela em mobile)
    // px-4 fornece o padding lateral desejado.
    <div className="grid grid-cols-2 gap-4 w-full md:max-w-3xl mx-auto px-4 md:grid-cols-4">
      {SUGGESTIONS.map((suggestion, index) => (
        <Button
          key={index}
          variant="ghost" // Usando ghost para remover o fundo sólido
          // Aplicando borda com a cor secondary e garantindo que o texto seja foreground
          className="h-auto p-4 text-left whitespace-normal text-sm font-normal border border-secondary text-foreground hover:bg-secondary/20"
          onClick={() => handleSuggestionClick(suggestion)}
          disabled={thread.isLoading}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}