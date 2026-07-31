import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Si Lestari — Kamus Hidup Bahasa Daerah",
  description:
    "Platform kolaboratif pelestarian kosakata bahasa daerah Indonesia berbasis AI.",
  icons: { icon: "/brand/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
