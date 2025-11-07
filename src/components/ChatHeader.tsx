"use client";

import Image from "next/image";
import React from "react";

const LOGO_URL = "https://res.cloudinary.com/dco1sm3hy/image/upload/v1762494737/Gen-UI_logo_xf5km7.png";

export default function ChatHeader() {
  return (
    <header className="p-4 border-b border-border flex justify-center items-center">
      <Image
        src={LOGO_URL}
        alt="Gen-UI Logo"
        width={165}
        height={48}
        className="w-auto h-auto max-w-[165px]" // Garante que a imagem seja responsiva e não exceda 165px de largura
      />
    </header>
  );
}