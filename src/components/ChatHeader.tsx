"use client";

import Image from "next/image";
import React from "react";

const LOGO_URL = "https://res.cloudinary.com/dco1sm3hy/image/upload/v1762494737/Gen-UI_logo_xf5km7.png";

export default function ChatHeader() {
  return (
    <header className="p-4 bg-card shadow-lg border-b border-border flex items-center space-x-3">
      <Image
        src={LOGO_URL}
        alt="Gen-UI Logo"
        width={32}
        height={32}
        className="rounded-full"
      />
      <h1 className="text-xl font-bold text-foreground">Gen-UI</h1>
    </header>
  );
}