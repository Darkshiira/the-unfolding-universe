import Image from "next/image";
import { Landmark } from "lucide-react";

type MuseumShowcaseProps = {
  src: string;
  title: string;
  description: string;
  alt: string;
};

export default function MuseumShowcase({
  src,
  title,
  description,
  alt,
}: MuseumShowcaseProps) {
  return (
    <section
      aria-label={`Museiföremål: ${title}`}
      className="relative overflow-hidden rounded-[24px] border border-[#DED5C6] bg-[#F5F0E7]"
    >
      {/* Soft museum lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#FFFDF6_0%,#F5F0E7_55%,#E8DFD1_100%)]" />

      {/* Museum collection label */}
      <div className="relative z-10 px-4 pt-6 text-center">
        <p className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9B8063]">
          <Landmark size={14} />
          Ur museets samling
        </p>
      </div>

      {/* Museum specimen */}
      <div className="relative mx-auto h-[230px] w-full sm:h-[250px] lg:h-[230px]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1023px) 100vw, 290px"
          className="object-contain drop-shadow-[0_15px_18px_rgba(60,44,28,0.12)]"
        />
      </div>

      {/* Exhibit information */}
      <div className="relative z-10 mx-4 mb-4 rounded-2xl border border-[#DED5C6] bg-[#FFFCF6]/90 px-4 py-5 text-center shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A28A70]">
          Utställningsföremål
        </p>

        <h2 className="mt-2 font-serif text-xl font-semibold text-[#34473C]">
          {title}
        </h2>

        <p className="mt-3 text-xs leading-6 text-[#77766A]">{description}</p>
      </div>
    </section>
  );
}
