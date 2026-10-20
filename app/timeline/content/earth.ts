import type { MilestoneArticleData } from "./types";

export const earthArticles: Record<string, MilestoneArticleData> = {
  earth: {
    id: "earth",
    kicker: "HADEIKUM · PLANETENS FÖDELSE",
    lead: "Jorden föddes inte på en enda dag. Den växte fram ur stoft, sten och kollisioner runt den unga solen. Under sina första miljoner år förvandlades den från en samling mindre himlakroppar till en planet med en inre struktur, en yta och så småningom förutsättningar för hav.",
    hero: {
      src: "/images/timeline/earth/young-earth.webp",
      alt: "Konstnärlig illustration av den heta, unga jorden i rymden med glödande områden och små himlakroppar.",
      caption:
        "Så kan den mycket unga jorden ha sett ut. Illustration, inte ett fotografi.",
      credit: "AI-genererad rekonstruktion för The Unfolding Universe",
      kind: "illustration",
    },
    atmosphere: {
      mode: "embers",
      intensity: "dramatic",
    },
    sections: [
      {
        id: "solsystemet",
        heading: "Allt började runt en ung sol",
        paragraphs: [
          "För ungefär 4,6 miljarder år sedan fanns en roterande skiva av gas och stoft runt den nybildade solen. I skivans varmare inre delar kunde mineral och metallkorn samlas till fasta partiklar.",
          "Partiklar kolliderade och klumpade ihop sig. Med tiden bildades större kroppar, så kallade planetesimaler. Gravitationen hjälpte dem att dra till sig ännu mer material. Jorden växte fram genom många sådana sammanstötningar, inte genom ett enda ögonblick av skapelse.",
        ],

        image: {
          src: "/images/timeline/earth/protoplanetary-disk.webp",
          alt: "Konstnärlig rekonstruktion av en glödande ung stjärna med en skiva av gas, stoft och stenmaterial.",
          caption:
            "En ung stjärna omgiven av material som kan bilda planeter. Konstnärlig rekonstruktion.",
          credit: "AI-genererad illustration för The Unfolding Universe",
          kind: "illustration",
        },
      },
      {
        id: "ackretion",
        heading: "Från stoftkorn till planet",
        paragraphs: [
          "Planetbildning sker i flera steg. Små partiklar kan fastna vid varandra, medan större kroppar påverkas allt mer av gravitationen. Genom kollisioner och sammanslagningar växer planetesimaler till planetembryon och till slut planeter.",
          "Processen var inte alltid lugn: vissa kollisioner byggde upp nya kroppar medan andra slog sönder dem. Diagrammet är en förenklad förklaring och visar inte exakta storlekar eller tidsintervall.",
        ],
        image: {
          src: "/images/timeline/earth/accretion.webp",
          alt: "Pedagogiskt diagram över stoftpartiklar, planetesimaler och en växande planet.",
          caption:
            "Ackretion, förenklat: små partiklar blir till allt större kroppar.",
          credit: "Originaldiagram för The Unfolding Universe",
          kind: "diagram",
        },
      },
      {
        id: "hetta",
        heading: "En värld som blev oerhört varm",
        paragraphs: [
          "När stora kroppar slog samman frigjordes rörelseenergi som värme. Även radioaktivt sönderfall och att material sjönk mot jordens inre bidrog till uppvärmningen. Under delar av jordens tidigaste historia kan omfattande områden ha varit smälta.",
          "Tyngre ämnen, framför allt järn, sjönk mot centrum och bidrog till att bilda kärnan. Lättare silikatmaterial blev en del av manteln och den yttre berggrunden. Den här uppdelningen kallas differentiering.",
          "Det finns inga bevarade fotografier av den unga jorden, och nästan alla bergarter från dess första tid har omvandlats eller försvunnit. Därför bygger bilder av ett globalt magmahav på modeller och indirekta spår.",
        ],
        image: {
          src: "/images/timeline/earth/magma-world.webp",
          alt: "Konstnärlig rekonstruktion av en mycket het ung jord med lava, vulkaniska berg och glödande horisont.",
          caption:
            "En tänkbar bild av delar av den tidiga jordens yta. Exakt utseende är osäkert.",
          credit: "AI-genererad illustration för The Unfolding Universe",
          kind: "illustration",
        },
      },
      {
        id: "inre",
        heading: "Jordens inre tar form",
        paragraphs: [
          "När den unga planeten var mycket varm kunde material röra sig och sorteras efter densitet. Järn och andra täta ämnen sjönk inåt och bidrog till kärnan, medan silikater bildade mantel och senare jordskorpa.",
          "Det här kallas differentiering. Jordens lager är viktiga för att förstå hur planeten utvecklades, men diagrammet visar dagens förenklade struktur och inte ett exakt ögonblick under Hadeikum.",
        ],
        image: {
          src: "/images/timeline/earth/interior.webp",
          alt: "Förenklad genomskärning med jordens yttersta skal, mantel och kärna.",
          caption: "Jordens lager, förenklade och inte skalenliga.",
          credit: "Originaldiagram för The Unfolding Universe",
          kind: "diagram",
        },
      },
      {
        id: "manen",
        heading: "En våldsam händelse kan ha bildat månen",
        paragraphs: [
          "Den mest etablerade förklaringsfamiljen till månens uppkomst bygger på en jättelik kollision mellan den unga jorden och en annan stor himlakropp. Material från händelsen kan ha samlats i bana runt jorden och så småningom bildat månen.",
          "Forskare diskuterar fortfarande hur kollisionen gick till och exakt hur månen växte fram. Månstenarnas kemi och datorsimuleringar är viktiga pusselbitar.",
        ],
      },
      {
        id: "vatten",
        heading: "När kunde vatten finnas på ytan?",
        paragraphs: [
          "När planetens yta svalnade kunde vattenånga kondensera och flytande vatten samlas där förhållandena tillät det. Vattnet kan ha kommit från flera källor, bland annat material som byggde upp jorden.",
          "Mycket gamla zirkonkristaller har kemiska signaturer som kan tyda på samspel mellan berggrund och flytande vatten redan för ungefär 4,4 miljarder år sedan. Tolkningen är betydelsefull, men forskarna kan inte rekonstruera exakt hur stora de tidiga haven var.",
        ],
      },
      {
        id: "datering",
        heading: "Hur vet vi att jorden är 4,54 miljarder år gammal?",
        paragraphs: [
          "Forskare använder radiometrisk datering: vissa radioaktiva isotoper omvandlas till andra ämnen i en känd takt. Genom att mäta förhållandet mellan dessa ämnen i mineral och meteoriter kan man beräkna hur lång tid som gått.",
          "Jordens äldsta bergarter är yngre än planeten själv eftersom jordskorpan ständigt förändras. Därför kombineras dateringar av mycket gamla jordiska mineral med meteoriter och material från andra delar av solsystemet.",
          "Den vedertagna åldern är ungefär 4,54 miljarder år, med en vetenskaplig osäkerhet på tiotals miljoner år. Det är en uppskattning grundad i flera oberoende mätningar, inte ett exakt födelsedatum.",
        ],
      },
    ],
    facts: [
      "Jorden bildades ungefär 9 miljarder år efter universums början.",
      "De äldsta kända zirkonkristallerna på jorden är omkring 4,4 miljarder år gamla.",
      "Jordens inre skiktning uppstod delvis eftersom tätt järn sjönk inåt när planeten var varm.",
      "Meteoriter hjälper oss att datera solsystemets tidigaste fasta material.",
    ],
    evidence: [
      "Radiometrisk datering av meteoriter och mycket gamla mineral.",
      "Isotopmätningar i zirkonkristaller som kan ge ledtrådar om tidig jordskorpa och vatten.",
      "Laboratorieexperiment och datormodeller av kollisioner och planetbildning.",
      "Jämförelser med månen och andra stenplaneter.",
    ],
    uncertainties: [
      "Exakt hur långvarigt och utbrett jordens tidiga magmahav var.",
      "Detaljerna kring den kollision som kan ha bildat månen.",
      "När stabila hav först bildades och hur jordens allra första atmosfär såg ut.",
    ],
    relatedIds: ["solar-nebula", "moon", "early-oceans"],
    sources: [
      {
        label: "USGS – Age of the Earth",
        url: "https://pubs.usgs.gov/gip/geotime/age.html",
      },
      {
        label: "NASA Science – Earth facts",
        url: "https://science.nasa.gov/earth/facts/",
      },
      {
        label: "NASA Science – Moon formation",
        url: "https://science.nasa.gov/moon/formation/",
      },
    ],
  },
};
