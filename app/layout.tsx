import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeFAI Energy Dashboard",
  description: "AI-powered energy optimization for blockchain transactions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-[#0A0A0A] text-white">
          <nav className="border-b border-gray-800 px-6 py-4">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold">⬡</div>
              <div className="flex space-x-6">
                <a href="/" className="hover:text-green-400">
                  Dashboard
                </a>
                <a href="/transactions" className="hover:text-green-400">
                  Transactions
                </a>
                <a href="/analytics" className="hover:text-green-400">
                  Analytics
                </a>
                <a href="/settings" className="hover:text-green-400">
                  Settings
                </a>
              </div>
            </div>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
