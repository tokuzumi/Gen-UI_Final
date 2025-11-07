// src/app/page.tsx
import DynamicChatWrapper from "@/components/DynamicChatWrapper";

export default function Home() {
  return (
    <main className="h-screen">
      {/* Renderiza o wrapper que lida com o carregamento dinâmico no lado do cliente */}
      <DynamicChatWrapper />
    </main>
  );
}