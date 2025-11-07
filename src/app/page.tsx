// src/app/page.tsx
import DynamicChatWrapper from "@/components/DynamicChatWrapper";
import { ThreadProvider } from "@/providers/ThreadProvider";

export default function Home() {
  return (
    <main className="h-screen flex justify-center bg-background">
      {/* Contêiner que limita a largura: w-full em mobile, lg:w-[60%] em desktop, e altura total */}
      <div className="w-full lg:w-[60%] h-full">
        {/* Envolver o chat com o Provedor */}
        <ThreadProvider>
          {/* Renderiza o wrapper que lida com o carregamento dinâmico no lado do cliente */}
          <DynamicChatWrapper />
        </ThreadProvider>
      </div>
    </main>
  );
}