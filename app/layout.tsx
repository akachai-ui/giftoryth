import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Giftoryth - Curating Something Extraordinary",
  description: "เว็บไซต์ Giftoryth โฉมใหม่กำลังอยู่ระหว่างการพัฒนา",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}