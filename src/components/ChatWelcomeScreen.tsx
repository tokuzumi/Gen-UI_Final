"use client";

import React from "react";
import Image from "next/image";
import PromptSuggestions from "./PromptSuggestions";

const LOGO_URL = "https://res.cloudinary.com/dco1sm3hy/image/upload/v1762494737/Gen-UI_logo_xf5km7.png";

export default function ChatWelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      
      {/* Logo */}
      <Image
        src={LOGO_URL}
        alt="Gen-UI Logo"
        width={248} // Novo tamanho base para otimização
        height={72} // Novo tamanho base para otimização
        // Em telas pequenas, limitamos a largura para 165px (tamanho anterior).
        // Em telas grandes (lg), permitimos que ele use o tamanho otimizado de 248px.
        className="w-auto h-auto max-w-[165px] lg:max-w-[248px] mb-6"
      />

      {/* Título e Contexto */}
      {/* <h1 className="text-3xl font-bold text-foreground mb-2">
        Gen-UI - Programa de Afiliados
      </h1> */}
      <p className="text-sm text-muted-foreground mb-1">
        Por CARLOS C TOLEDO
      </p>
      <p className="text-base text-foreground mb-12 max-w-md">
        Chat AFinance: capacita afiliados e promove excelência no mercado financeiro.
      </p>

      {/* Sugestões de Prompt */}
      <PromptSuggestions />
    </div>
  );
}