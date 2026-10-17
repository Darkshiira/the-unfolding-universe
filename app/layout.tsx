import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Unfolding Universe – Från Big Bang till livet på jorden",
    template: "%s | The Unfolding Universe",
  },

  description:
    "Följ universums fantastiska historia – från Big Bang och de första stjärnorna till jordens födelse och livets utveckling. Utforska en interaktiv tidslinje fylld med spännande fakta och upptäckter.",

  applicationName: "The Unfolding Universe",

  keywords: [
    "universum",
    "Big Bang",
    "jordens historia",
    "livets utveckling",
    "evolution",
    "solsystemet",
    "galaxer",
    "vetenskap",
    "interaktiv tidslinje",
    "naturhistoria",
  ],

  openGraph: {
    type: "website",
    locale: "sv_SE",
    siteName: "The Unfolding Universe",
    title: "The Unfolding Universe – Från Big Bang till livet på jorden",
    description:
      "En interaktiv resa genom universums och jordens historia. Upptäck hur stjärnorna, planeterna och livet växte fram.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Unfolding Universe – Från Big Bang till livet på jorden",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "The Unfolding Universe – Från Big Bang till livet på jorden",
    description:
      "Utforska universums historia, jordens födelse och livets utveckling genom en interaktiv upplevelse.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
