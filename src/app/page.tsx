// src/app/page.tsx
import dynamic from "next/dynamic";

// Usamos next/dynamic para garantir que o ChatInterface (que é um Client Component
// e usa hooks) seja carregado apenas no lado do cliente (SSR desativado para ele).
const DynamicChatInterface = dynamic(
  () => import("@/components/ChatInterface"),
  {
    ssr: false, // Desativa a renderização no lado do servidor
    loading: () => (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Carregando interface de chat...</p>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <main className="h-screen">
      {/* Renderiza o componente carregado dinamicamente */}
      <DynamicChatInterface />
    </main>
  );
}