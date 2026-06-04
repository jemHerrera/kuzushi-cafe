import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Kuzushi Cafe",
  description: "Mindful grappling notes and progress tracking.",
  icons: {
    icon: [
      {
        url: "/kuzushi-cafe.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: "/kuzushi-cafe.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/kuzushi-cafe.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
