import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VoiturePremium - Voitures de luxe au Maroc",
  description:
    "Agrégateur d'annonces de voitures premium et de luxe au Maroc. Mercedes, BMW, Audi, Porsche et plus encore.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans bg-background text-foreground min-h-screen flex flex-col antialiased`}>
        <Header />
        <main className="flex-1 relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
