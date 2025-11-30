import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { BookmarksProvider } from "@/components/context/BookmarksContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Scholarly Insight",
  description: "This is our scholarly insight project for NYU's Leetcode Bootcamp.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#0a0a0a] text-[#ededed]`}
      >
        <AuthProvider>
          <BookmarksProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </BookmarksProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
