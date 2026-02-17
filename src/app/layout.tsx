import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Header from "@/components/layout/Header";
// import BottomNav from "@/components/layout/BottomNav";
// import { GamificationProvider } from "@/context/GamificationContext";
// import { AuthProvider } from "@/components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SATU SAF: Journey to Taqwa",
  description: "Gamified Islamic Learning Path for Sanlat Ramadhan 1447 H",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <div className="relative flex min-h-screen flex-col bg-background">
          {/* <Header /> */}
          <main className="flex-1 pb-20">
            {children}
          </main>
          {/* <BottomNav /> */}
        </div>
      </body>
    </html>
  );
}
