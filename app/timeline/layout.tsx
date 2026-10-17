import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jordens historia – Utforska livets utveckling",

  description:
    "Utforska jordens 4,54 miljarder år långa historia genom en interaktiv tidslinje. Upptäck de första haven, livets uppkomst, dinosaurierna och människans utveckling.",

  openGraph: {
    title: "Jordens historia | The Unfolding Universe",
    description:
      "Res genom jordens historia och upptäck hur livet utvecklades – från de första mikroorganismerna till idag.",
    images: ["/og-image.png"],
  },
};

export default function TimelineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
