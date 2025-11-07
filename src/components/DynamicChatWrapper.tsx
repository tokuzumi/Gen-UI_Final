"use client";

import dynamic from "next/dynamic";
import React from "react";

// O Next.js exige que o dynamic import com ssr: false esteja dentro de um Client Component.
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

export default function DynamicChatWrapper() {
  return <DynamicChatInterface />;
}