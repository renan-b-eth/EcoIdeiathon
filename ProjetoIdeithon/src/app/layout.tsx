import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DataBridge AI — Turn Any Spreadsheet Into Insights",
  description:
    "Upload any CSV and get AI-powered dashboards, insights, and narratives in seconds. No code required. Democratizing data analysis for everyone.",
  keywords: ["data analysis", "AI", "CSV", "dashboard", "insights", "no-code"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
