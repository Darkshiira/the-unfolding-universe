import type { MilestoneArticleData } from "./types";

const credit = "AI-genererad konstnärlig illustration för The Unfolding Universe";

/** När livet blev synligt: ediacarafaunan och den kambriska diversifieringen. */
export const lifeVisibleArticles: Record<string, MilestoneArticleData> = {
  ediacaran: {
    id: "ediacaran",
    kicker: "EDIACARA · LIVETS FRÄMMANDE VÄRLD",
    lead: "Långt före dinosaurier, fiskar och skogar täcktes delar av havsbottnen av mjuka, märkliga organismer. Några liknade blad eller fjädrar, andra låg som mönstrade skivor mot sedimentet. Deras fossil visar en värld där större livsformer redan hade börjat ta plats – men där mycket fortfarande är ett mysterium.",
    hero: {
      src: "/images/timeline/life-visible/ediacaran-hero.webp",
      alt: "Konstnärlig rekonstruktion av en havsbotten under ediacara med Dickinsonia, fjäderliknande rangeomorfer och mikrobiella mattor, utan moderna fiskar eller koraller.",
      caption: "Ediacaras havsbottnar hyste ovanliga mjukkroppade organismer. Bilden är en tolkning: deras färger, livssätt och släktskap är inte helt kända.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "en-frammande-havsbotten",
        heading: "En havsbotten som ingen annan",
        paragraphs: [
          "Under ediacaraperioden, för cirka 635–539 miljoner år sedan, levde en mångfald av organismer som i dag är svåra att känna igen. Särskilt välkända är fossil från omkring 575 miljoner år sedan och framåt.",
          "Vissa hade platta, segmentliknande mönster. Andra var upprätta och förgrenade, med former som påminner om fjädrar eller blad. Många levde på eller nära havsbottnen, där mikrobiella mattor kunde täcka sedimenten.",
          "Det är frestande att se dem som tidiga växter eller djur. Men likheten i form är inte alltid ett bevis på släktskap. Flera grupper kan ha representerat evolutionära experiment utan nära motsvarigheter i dagens hav.",
        ],
      },
      {
        id: "markliga-former",
        heading: "Dickinsonia, Charnia och andra gåtor",
        paragraphs: [
          "Dickinsonia var en platt, oval organism med ett regelbundet mönster av upprepade enheter. Kemiska analyser av vissa fossil har gett stöd för att den hörde till djurriket, men dess exakta plats i djurens släktträd är fortfarande osäker.",
          "Charnia och andra rangeomorfer hade förgrenade kroppar som kunde stå upp från havsbottnen. Hur de tog upp näring och hur deras kroppar fungerade diskuteras fortfarande.",
          "Ediacarabiotan var inte en enda biologisk grupp. Den omfattade organismer med olika former, livssätt och sannolikt olika evolutionärt ursprung.",
        ],
        image: {
          src: "/images/timeline/life-visible/ediacaran-organisms.webp",
          alt: "Pedagogisk jämförelse av Dickinsonia, Charnia och en annan rangeomorf med deras ungefärliga kroppsformer och skala.",
          caption: "Några typiska ediacaraformer. Rekonstruktionerna är förenklade och deras biologiska släktskap är delvis omdiskuterade.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "avtryck-i-sand",
        heading: "Hur bevaras en mjuk kropp som fossil?",
        paragraphs: [
          "Mjuka kroppar bryts vanligtvis ner innan de kan bevaras. Men i vissa miljöer kunde organismer täckas av sediment och lämna avtryck eller avgjutningar i sandsten och andra bergarter.",
          "Mikrobiella mattor kan ha bidragit till att stabilisera havsbottnens yta och göra det lättare för avtryck att bevaras. Forskare studerar både fossilens form och sedimentlagrens struktur för att förstå hur de uppstod.",
          "Ett fossil kan visa storlek, symmetri och ibland spår av rörelse. Däremot berättar det sällan direkt om färg, inre organ eller exakt hur organismen fick sin energi.",
        ],
        image: {
          src: "/images/timeline/life-visible/ediacaran-fossilization.webp",
          alt: "Pedagogiskt tvärsnitt i fyra steg: mjukkroppad organism på mikrobiell matta, övertäckning av sand, nedbrytning och bevarat avtryck i bergart.",
          caption: "Så kan mjuka organismer lämna fossilavtryck. Förhållandena varierade och inte alla ediacarafossil bildades på samma sätt.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "ett-liv-i-forandring",
        heading: "När havsbottnens ekosystem förändrades",
        paragraphs: [
          "Mot slutet av ediacara förändrades de marina ekosystemen. Spårfossil visar att vissa organismer rörde sig i och på sedimenten, och att samspelet mellan djur och havsbotten blev allt mer omfattande.",
          "När fler djur började gräva och bearbeta sedimenten kan det ha förändrat livsmiljöerna för organismer som var beroende av stabila mikrobiella mattor. Förändringar i miljö och konkurrens kan också ha spelat in.",
          "Varför många klassiska ediacaraformer försvann är fortfarande omdiskuterat. Deras tillbakagång bör inte beskrivas som en enda säkert belagd global massutrotning.",
        ],
      },
      {
        id: "fore-den-kambriska",
        heading: "Livet hade redan en lång historia",
        paragraphs: [
          "Ediacarafossilen påminner oss om att större och mer komplexa organismer inte uppstod ur tomma intet vid kambriums början. Evolutionen hade redan pågått i miljarder år.",
          "Vissa djurlinjer kan ha funnits innan de blev vanliga i fossilmaterialet. Molekylära jämförelser och fossil ger olika typer av ledtrådar, men dateringar och släktskapsförhållanden har osäkerheter.",
          "När vi går vidare till kambrium möter vi ett rikare fossilmaterial med många fler tydligt igenkännbara djurgrupper. Det är nästa kapitel – inte livets första kapitel.",
        ],
      },
    ],
    showcase: {
      src: "/images/timeline/showcases/dickinsonia-fossil.webp",
      title: "Dickinsonia – ett avtryck från en främmande värld",
      description: "Dickinsonia var en platt organism som levde under ediacara. Dess karakteristiska mönster har bevarats som avtryck i sedimentära bergarter. Fynden hjälper forskare att undersöka tidiga djur och deras släktingar. Konstnärlig illustration av ett fossilförande bergartsprov, inte ett autentiskt exemplar.",
      alt: "Konstnärlig museiillustration av en gråbrun sedimentär stenplatta med ett tydligt ovalt, segmentliknande Dickinsonia-avtryck, på en rund polerad träplattform mot transparent bakgrund.",
    },
    facts: [
      "Ediacaraperioden varade ungefär 635–539 miljoner år sedan.",
      "Många välkända ediacarafossil är omkring 575–539 miljoner år gamla.",
      "Dickinsonia och Charnia hade kroppsformer som saknar enkla motsvarigheter bland dagens organismer.",
      "Alla ediacaraorganismer tillhörde inte nödvändigtvis samma evolutionära grupp.",
    ],
    evidence: [
      "Avtryck och avgjutningar av mjukkroppade organismer i sedimentära bergarter.",
      "Spårfossil som visar rörelse och samspel med havsbottnen.",
      "Sedimentologiska studier av mikrobiella mattor och fossilens bevarande.",
      "Organiska biomarkörer i vissa fossil, tillsammans med jämförande morfologi.",
    ],
    uncertainties: [
      "Vilka ediacaraformer som var djur och vilka som tillhörde andra linjer.",
      "Hur många av organismerna fick näring, växte och fortplantade sig.",
      "Varför flera klassiska ediacaraformer försvann mot periodens slut.",
    ],
    relatedIds: ["ediacaran-earth", "multicellular", "cambrian", "animals"],
    sources: [
      { label: "Encyclopaedia Britannica – Ediacaran Period", url: "https://www.britannica.com/science/Ediacaran-Period" },
      { label: "University of California Museum of Paleontology – Ediacaran", url: "https://ucmp.berkeley.edu/vendian/vendian.php" },
      { label: "Smithsonian National Museum of Natural History", url: "https://naturalhistory.si.edu/" },
    ],
  },
  cambrian: {
    id: "cambrian",
    kicker: "KAMBRIUM · NÄR DJURENS VÄRLD VIDGADES",
    lead: "I de kambriska haven blev många djurgrupper allt tydligare i fossilmaterialet. Rovdjur, grävande organismer, hårda skal och nya sätt att röra sig förändrade samspelet mellan livsformerna. Den så kallade kambriska explosionen var ingen ögonblicklig händelse, utan en utdragen evolutionär omvandling.",
    hero: {
      src: "/images/timeline/life-visible/cambrian-hero.webp",
      alt: "Konstnärlig rekonstruktion av ett kambriskt hav med trilobiter, tidiga leddjur, Anomalocaris-liknande rovdjur, svampdjur och andra tidiga marina organismer.",
      caption: "Kambriums hav rymde en snabbt växande mångfald av djurformer. Bilden är en konstnärlig rekonstruktion av organismer som inte nödvändigtvis levde på samma plats eller vid samma tidpunkt.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "ingen-plotslig-explosion",
        heading: "En explosion som tog miljontals år",
        paragraphs: [
          "Kambrium började för omkring 539 miljoner år sedan. Under periodens tidiga delar blir många större djurgrupper och deras spår tydligare i fossilmaterialet. Denna utveckling kallas den kambriska explosionen.",
          "Namnet kan låta som om alla djur uppstod samtidigt. I själva verket handlar det om en lång process som sträckte sig över miljontals år, med rötter i tidigare evolution under ediacara och ännu äldre tid.",
          "Det rikare fossilmaterialet beror både på biologiska förändringar och på att fler organismer utvecklade delar som lättare kunde fossiliseras, exempelvis mineraliserade skal och skelett.",
        ],
      },
      {
        id: "ett-hav-av-former",
        heading: "Rovdjur, trilobiter och märkliga kroppar",
        paragraphs: [
          "Trilobiter blev en framgångsrik grupp av marina leddjur med hårda yttre skal. Andra djur simmade, kröp, filtrerade vatten eller grävde i havsbottnen.",
          "Radiodonter, däribland Anomalocaris-liknande former, hade gripande främre utskott och levde som aktiva konsumenter. Organismer som Opabinia och Hallucigenia visar hur annorlunda vissa tidiga djur såg ut jämfört med dagens välbekanta former.",
          "Alla dessa organismer levde inte samtidigt eller på samma plats. Fossil från olika kambriska lager ger tillsammans en bild av en föränderlig och allt mer komplex marin värld.",
        ],
        image: {
          src: "/images/timeline/life-visible/cambrian-creatures.webp",
          alt: "Pedagogisk jämförelse av en trilobit, en radiodont, Opabinia och Hallucigenia med namn, kroppsformer och ungefärlig storlek.",
          caption: "Några av kambriums ovanliga djur. De visas tillsammans för jämförelse, inte som en exakt ögonblicksbild av ett ekosystem.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "nya-satt-att-leva",
        heading: "När djuren förändrade varandras värld",
        paragraphs: [
          "När fler organismer började jaga, försvara sig och gräva förändrades havens ekosystem. Rovdjur och bytesdjur påverkade varandras evolution, medan grävande djur omarbetade sedimenten.",
          "Skal, taggar, bättre sinnesorgan och nya rörelsesätt kan ha gett fördelar i vissa miljöer. Men ingen enskild förklaring räcker för hela den kambriska diversifieringen.",
          "Forskare undersöker hur ekologiska samspel, utvecklingsbiologi, syretillgång och miljöförändringar tillsammans kan ha bidragit till förändringarna.",
        ],
      },
      {
        id: "fossilens-fonster",
        heading: "De ovanliga fossil som bevarade mjuka kroppar",
        paragraphs: [
          "Vanliga fossil bevarar ofta hårda delar bäst. Därför är fyndplatser där även mjuka vävnader fossiliserats särskilt värdefulla för att förstå kambriums djur.",
          "Burgesskiffern i Kanada och Chengjiangfynden i Kina har gett detaljerade fossil av organismer som annars skulle ha lämnat mycket få spår. Sådana fynd hjälper forskare att undersöka kroppsbyggnad, rörelse och släktskap.",
          "Men även dessa fantastiska fossil visar bara vissa miljöer och tidpunkter. Fossilmaterialet är alltid ett ofullständigt urval av det liv som en gång fanns.",
        ],
        image: {
          src: "/images/timeline/life-visible/cambrian-fossil-preservation.webp",
          alt: "Pedagogiskt diagram som jämför ett vanligt fossil med hårda skal och ett ovanligt välbevarat kambriskt fossil där även mjukdelar syns i skiffer.",
          caption: "Exceptionella fossilfynd visar mjuka kroppsdelar som annars sällan bevaras och ger en rikare bild av kambriums djurliv.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "grunden-for-framtiden",
        heading: "En ny mångfald – inte evolutionens slutmål",
        paragraphs: [
          "Under kambrium blev många av de stora grenarna i djurens släktträd tydligare. Samtidigt fanns också evolutionära linjer som senare dog ut eller förändrades så mycket att de ser främmande ut för oss.",
          "Dagens djur härstammar inte från en enda typisk kambrisk organism. De är resultatet av många förgrenade släktlinjer och hundratals miljoner år av fortsatt evolution.",
          "Kambrium markerar därför inte när livet började, utan en viktig period då nya kroppsformer och ekologiska relationer blev särskilt framträdande i havens fossilarkiv.",
        ],
      },
    ],
    showcase: {
      src: "/images/timeline/showcases/cambrian-trilobite.webp",
      title: "Trilobit – ett skal från kambriums hav",
      description: "Trilobiter var marina leddjur med ett hårt, segmenterat yttre skelett. Deras fossil är vanliga i många paleozoiska bergarter och ger viktiga ledtrådar om tidiga marina ekosystem. Konstnärlig illustration av ett fossilförande bergartsprov, inte ett autentiskt exemplar.",
      alt: "Konstnärlig museiillustration av en mörkgrå stenplatta med ett detaljerat, segmenterat trilobitfossil, placerad på en rund polerad träplattform mot transparent bakgrund.",
    },
    facts: [
      "Kambrium började för omkring 539 miljoner år sedan.",
      "Den kambriska explosionen var en utdragen diversifiering, inte en enda plötslig händelse.",
      "Trilobiter var leddjur som levde i havet och hade mineraliserade yttre skelett.",
      "Fossil från Burgesskiffern och Chengjiang bevarar även ovanliga mjuka kroppsdelar.",
    ],
    evidence: [
      "Trilobiter och andra mineraliserade fossil från kambriska sediment.",
      "Exceptionellt bevarade fossil från bland annat Burgesskiffern och Chengjiang.",
      "Spårfossil efter grävning, förflyttning och aktivitet på havsbottnen.",
      "Jämförelser av fossilens anatomi med levande djur och evolutionära släktträd.",
    ],
    uncertainties: [
      "Vilken kombination av ekologiska, genetiska och miljömässiga faktorer som drev diversifieringen.",
      "När de första företrädarna för olika djurlinjer faktiskt uppstod.",
      "Hur representativt det bevarade fossilmaterialet är för kambriums hela mångfald.",
    ],
    relatedIds: ["ediacaran", "trilobites", "sponges", "vertebrates", "ordovician-extinction"],
    sources: [
      { label: "Encyclopaedia Britannica – Cambrian explosion", url: "https://www.britannica.com/science/Cambrian-explosion" },
      { label: "Royal Ontario Museum – Burgess Shale", url: "https://burgess-shale.rom.on.ca/" },
      { label: "Smithsonian National Museum of Natural History", url: "https://naturalhistory.si.edu/" },
    ],
  },
};
