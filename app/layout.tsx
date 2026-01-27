import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AOSProvider from "./providers/AOSProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mecarvi Technologies - Welcome to Our Mecarvi Signs",
  description:
    "Wanna know more about out us please have a look below and explore us more",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased m-0 p-0 overflow-x-hidden`}
      >
        <AOSProvider>{children}</AOSProvider>
      </body>
    </html>
  );
}
