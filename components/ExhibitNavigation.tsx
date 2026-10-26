import Link from "next/link";
import { ArrowLeft, BookOpen, Compass } from "lucide-react";
import MuseumDropdown from "./MuseumDropdown";
import { getMuseumExhibit } from "@/app/museum/museum-exhibits";

type ExhibitNavigationProps = {
  exhibitId: string;
};

export default function ExhibitNavigation({
  exhibitId,
}: ExhibitNavigationProps) {
  const exhibit = getMuseumExhibit(exhibitId);

  return (
    <nav
      aria-label="Utställningens navigation"
      className="relative z-50 flex items-center justify-between gap-3 border-b border-[#DED7CA] bg-[#FBF9F3]/95 px-4 py-3 backdrop-blur-md sm:px-8"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/timeline"
          aria-label="Tillbaka till tidslinjen"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#DDD4C6] text-[#526B5B] transition hover:bg-[#EFE8DB]"
        >
          <ArrowLeft size={17} />
        </Link>

        <div className="min-w-0">
          <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-[#B48E6B] sm:block">
            Interaktiv utställning
          </p>
          <p className="truncate text-sm font-semibold text-[#34473C]">
            {exhibit?.title ?? "Utforska museet"}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {exhibit?.articleHref && (
          <Link
            href={exhibit.articleHref}
            className="hidden items-center gap-2 rounded-full border border-[#DDD4C6] px-3 py-2.5 text-xs font-semibold text-[#66766B] transition hover:bg-[#EFE8DB] sm:inline-flex"
          >
            <BookOpen size={15} />
            Till artikeln
          </Link>
        )}

        <Link
          href="/timeline"
          className="hidden items-center gap-2 rounded-full border border-[#DDD4C6] px-3 py-2.5 text-xs font-semibold text-[#66766B] transition hover:bg-[#EFE8DB] lg:inline-flex"
        >
          <Compass size={15} />
          Tidslinjen
        </Link>

        <MuseumDropdown />
      </div>
    </nav>
  );
}
