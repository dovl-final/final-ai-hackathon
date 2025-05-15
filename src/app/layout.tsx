import type { Metadata } from "next";
import { Sora } from "next/font/google";
import Providers from "../components/Providers";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Final AI Hackathon",
  description: "Final's internal AI Hackathon platform for project idea submissions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} antialiased bg-gray-50`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
