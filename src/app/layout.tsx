import type { Metadata } from "next";
import "../styles/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Firebase Study",
  description: "Estudo Geral Firebase",
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
          overflow: "hidden auto",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
