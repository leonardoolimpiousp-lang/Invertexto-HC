import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Invertexto-HC · notepad clínico e ferramentas para o residente médico",
    template: "%s · Invertexto-HC",
  },
  description:
    "Notepad clínico de URL pública com auto-save e arsenal de ferramentas integradas (calculadoras, escores, CID-10, antimicrobianos) para médicos, residentes e internos.",
  applicationName: "Invertexto-HC",
  authors: [{ name: "Invertexto-HC" }],
  keywords: [
    "notepad clínico",
    "residência médica",
    "calculadoras médicas",
    "escores clínicos",
    "CID-10",
    "Hospital das Clínicas",
  ],
  openGraph: {
    title: "Invertexto-HC",
    description:
      "Notepad clínico e ferramentas integradas para residentes do Hospital das Clínicas.",
    type: "website",
    locale: "pt_BR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0F766E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
