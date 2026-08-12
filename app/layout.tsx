import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Framewise Reviews | Film Criticism Portfolio",
  description:
    "A polished movie review portfolio built with Next.js, TypeScript, Tailwind CSS, and shadcn UI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="flex min-h-full flex-col bg-slate-950">
        <AuthProvider>
          <TooltipProvider>
            <Header />
            {children}
            <Toaster
              theme="dark"
              position="top-center"
              duration={5000}
              toastOptions={{
                style: {
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#e2e8f0",
                  fontFamily: "monospace",
                  fontSize: "12px",
                },
              }}
            />
            <Footer />
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
