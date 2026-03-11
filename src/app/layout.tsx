import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Port-as-a-Service",
  description: "AI Smart Center Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 antialiased h-screen w-screen overflow-hidden font-sans">
        {children}
      </body>
    </html>
  );
}