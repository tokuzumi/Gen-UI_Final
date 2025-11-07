"use client";

import React from "react";
import Image from "next/image";
import { Separator } from "./ui/separator";

const LOGO_URL = "https://res.cloudinary.com/dco1sm3hy/image/upload/v1762494737/Gen-UI_logo_xf5km7.png";

export default function ChatHeader() {
  return (
    <header className="sticky top-0 z-10 bg-card border-b border-border p-4 shadow-md">
      <div className="flex justify-center items-center mx-auto md:max-w-3xl">
        <Image
          src={LOGO_URL}
          alt="Gen-UI Logo"
          width={124} // Tamanho menor para o cabeçalho
          height={36}
          className="w-auto h-auto max-w-[124px]"
        />
      </div>
    </header>
  );
}