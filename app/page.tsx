import CosmicIntro from "@/components/CosmicIntro";
import FirstStars from "@/components/FirstStars";
import BirthOfGalaxies from "@/components/BirthOfGalaxies";
import SolarSystem from "@/components/SolarSystem";
import TimelineGateway from "@/components/TimelineGateway";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <CosmicIntro />
      <FirstStars />
      <BirthOfGalaxies />
      <SolarSystem />
      <TimelineGateway />

      {/* Our next chapter
      <section className="flex min-h-screen items-center justify-center bg-black px-6 text-center text-white">
        <div className="max-w-2xl">
          <p className="mb-5 text-xs uppercase tracking-[0.35em] text-amber-200/65">
            Coming Next
          </p>

          <h2 className="text-4xl font-light sm:text-6xl">
            A world in transformation.
          </h2>

          <p className="mt-7 text-base leading-8 text-white/55">
            From a young, volatile planet to oceans, continents, and the
            conditions that would eventually allow life to emerge.
          </p>
        </div>
      </section> */}
    </main>
  );
}
