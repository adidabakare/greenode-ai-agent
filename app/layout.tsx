import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeFAI Energy Dashboard",
  description: "AI-driven energy optimization for blockchain operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
