import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EcoImpact - Rastreie seu Impacto Ambiental",
  description:
    "Plataforma gamificada para rastrear e reduzir seu impacto ambiental. Registre ações sustentáveis, ganhe pontos e compete com amigos.",
  keywords: ["sustentabilidade", "meio ambiente", "gamificação", "CO2", "impacto ambiental"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
