import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar"; // Sidebarをインポート

import { Menu } from "lucide-react"; // Menuをインポート
import Link from "next/link";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100">
        <Sidebar />
          <main className="flex-1 overflow-auto">
            <header className="bg-[#FF5722] border-b p-4 flex justify-between items-center">
              <Link href="/home">
                <h2 className="text-2xl font-bold text-white" >roomy</h2> {/* 文字色を白に変更 */}
              </Link>
              
              <Menu className="text-orange-600" />
              
            </header>
            {children} {/* 子コンポーネントをここに表示 */}
          </main>
        </div>
      </body>
    </html>
  );
}