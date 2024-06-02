import { GlobalStyles } from "../styles/global";
import type { Metadata } from "next";
import "../styles/globals.css";
import { Providers } from "./providers";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Mapas Mentais - Direito",
  description: "Mapas Mentais para Faculdade de Direito",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="dark">
      <body
        style={{
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          position: "fixed",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
