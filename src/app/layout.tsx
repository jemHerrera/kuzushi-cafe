import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
