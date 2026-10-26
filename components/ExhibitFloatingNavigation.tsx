
"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import MuseumDropdown from "./MuseumDropdown";
import { getMuseumExhibit } from "@/app/museum/museum-exhibits";

type Props = {
  exhibitId: string;
};

export default function ExhibitFloatingNavigation({
  exhibitId,
}: Props) {
  const exhibit = getMuseumExhibit(exhibitId);

  return (
    <nav
      aria-label="Museets huvudnavigation"
      className="pointer-events-auto absolute right-4 top-4 z-[100] flex items-center gap-2"
    >
      {exhibit?.articleHref && (
        <Link
          href={exhibit.articleHref}
          aria-label="Tillbaka till artikeln"
          title="Tillbaka till artikeln"
          className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-[#071b28]/85 text-white shadow-lg backdrop-blur-xl transition hover:bg-[#123b4a]"
        >
          <BookOpen size={17} />
        </Link>
      )}

      <Link
        href="/timeline"
        aria-label="Till tidslinjen"
        title="Till tidslinjen"
        className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-[#071b28]/85 text-white shadow-lg backdrop-blur-xl transition hover:bg-[#123b4a]"
      >
        <ArrowLeft size={17} />
      </Link>

      <MuseumDropdown />
    </nav>
  );
}
