import RootProvider from "@/components/providers/RootProvider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budget Tracker",
  description:
    "A simple nextjs budget tracker app to track all your incomes and expenses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
        <body className={inter.className}>
          <Toaster richColors position="top-right" />
          <RootProvider>{children}</RootProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
