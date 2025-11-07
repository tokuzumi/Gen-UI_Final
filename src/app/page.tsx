// src/app/page.tsx
import DynamicChatWrapper from "@/components/DynamicChatWrapper";
import { ThreadProvider } from "@/providers/ThreadProvider";

export default function Home() {
  return (
    <main className="h-screen">
      {/* Envolver o chat com o Provedor */}
      <ThreadProvider>
        {/* Renderiza o wrapper que lida com o carregamento dinâmico no lado do cliente */}
        <DynamicChatWrapper />
      </ThreadProvider>
    </main>
  );
}