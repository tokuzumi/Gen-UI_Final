// src/app/page.tsx
import DynamicChatWrapper from "@/components/DynamicChatWrapper";
import { ThreadProvider } from "@/providers/ThreadProvider";

export default function Home() {
  return (
    <main className="flex justify-center bg-background min-h-screen">
      {/* Removendo a limitação de largura aqui. O ChatInterface agora ocupa w-full. */}
      <div className="w-full"> 
        {/* Envolver o chat com o Provedor */}
        <ThreadProvider>
          {/* Renderiza o wrapper que lida com o carregamento dinâmico no lado do cliente */}
          <DynamicChatWrapper />
        </ThreadProvider>
      </div>
    </main>
  );
}