"use client";

import React from "react";
import Image from "next/image";
import PromptSuggestions from "./PromptSuggestions";

const LOGO_URL = "https://res.cloudinary.com/dco1sm3hy/image/upload/v1762494737/Gen-UI_logo_xf5km7.png";

export default function ChatWelcomeScreen() {
  return (
    // Removendo p-8 para que PromptSuggestions possa usar a largura total
    <div className="flex flex-col items-center justify-center h-full text-center">
      
      {/* Logo */}
      <Image
        src={LOGO_URL}
        alt="Gen-UI Logo"
        width={248} // Novo tamanho base para otimização
        height={72} // Novo tamanho base para otimização
        // Em telas pequenas, limitamos a largura para 165px (tamanho anterior).
        // Em telas grandes (lg), permitimos que ele use o tamanho otimizado de 248px.
        className="w-auto h-auto max-w-[165px] lg:max-w-[248px] mb-6 mt-12" // Adicionando mt-12 para espaçamento superior
      />

      {/* Título e Contexto - Aplicando padding horizontal aqui */}
      <div className="px-4 w-full">
        {/* Removido: <p className="text-sm text-muted-foreground mb-1">Por CARLOS C TOLEDO</p> */}
        <p className="text-base text-muted-foreground mb-12 max-w-md mx-auto">
          Este site foi criado para entregar conteúdo de forma personalizada
        </p>
      </div>

      {/* Sugestões de Prompt - Agora pode usar a largura total do contêiner pai */}
      <PromptSuggestions />
    </div>
  );
}