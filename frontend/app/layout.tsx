import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MyRuntimeProvider } from "@/lib/runtime/MyRuntimeProvider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mini-AGI Chat - AI Orchestration Platform",
  description: "Professional AI orchestration system with agents, tools, and real-time insights",
  keywords: ["AI", "Orchestrator", "Agents", "Chat", "Mini-AGI"],
  authors: [{ name: "Mini-AGI Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MyRuntimeProvider>{children}</MyRuntimeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
