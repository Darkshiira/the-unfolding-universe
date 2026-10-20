import type { MilestoneArticleData } from "./types";

// Add artwork under public/images/timeline/early/ using the filenames below.
// The article renderer is unchanged: it reads these objects using getArticle(id).
export const earlyUniverseArticles: Record<string, MilestoneArticleData> = {
  "big-bang": {
    id: "big-bang",
    kicker: "UNIVERSUMS HISTORIA · DEN TIDIGA EXPANSIONEN",
    lead: "För omkring 13,8 miljarder år sedan var det observerbara universum mycket hett och tätt. Sedan dess har rymden expanderat och svalnat. Genom att studera ljuset från avlägsna galaxer och universums äldsta ljus kan forskare återskapa stora delar av den här berättelsen.",
    hero: {
      src: "/images/timeline/early/big-bang-hero-v2.webp",
      alt: "Konstnärlig visualisering av det tidiga, heta universum och dess expansion, utan en central explosionspunkt.",
      caption:
        "Konstnärlig visualisering av universums tidiga expansion, inte ett fotografi av den stora smällen.",
      credit: "Illustration för The Unfolding Universe",
      kind: "illustration",
    },
    sections: [
      {
        id: "expansionen",
        heading: "Inte en explosion i tom rymd",
        paragraphs: [
          "Den stora smällen beskriver hur universum utvecklades från ett extremt hett och tätt tillstånd. Det betyder inte att materia exploderade från en punkt in i en redan existerande tom rymd. I stället är det avstånden i själva rymden som har ökat.",
          "När vi ser långt ut i rymden ser vi också tillbaka i tiden, eftersom ljuset behöver tid för att nå oss. Det ger astronomer möjlighet att undersöka hur universum har förändrats under miljarder år.",
        ],
        image: {
          src: "/images/timeline/early/expanding-space.webp",
          alt: "Pedagogisk illustration av hur avstånd mellan galaxer ökar när rymden expanderar.",
          caption:
            "Rymdens expansion ökar avstånden mellan galaxer som inte hålls samman av gravitationen.",
          credit: "Pedagogisk illustration för The Unfolding Universe",
          kind: "diagram",
        },
      },
      {
        id: "forsta-sekunderna",
        heading: "Ett universum av energi och partiklar",
        paragraphs: [
          "Under universums allra tidigaste kända utveckling var temperaturen så hög att vanliga atomer inte kunde existera. När universum svalnade kunde partiklar och antipartiklar bildas och växelverka. Kvarkar bands senare samman till bland annat protoner och neutroner.",
          "Fysiken kan beskriva många processer mycket tidigt i universums historia, men inte med säkerhet vad som hände vid själva början. Våra teorier är ännu ofullständiga under de mest extrema förhållandena.",
        ],
      },
      {
        id: "forsta-grundamnena",
        heading: "De första grundämnena",
        paragraphs: [
          "Under universums första minuter bildades kärnor av framför allt väte och helium samt små mängder litium. Processen kallas den ursprungliga nukleosyntesen.",
          "Tyngre grundämnen, som kol och syre, bildades huvudsakligen långt senare i stjärnor och genom andra kosmiska processer. Därför berättar grundämnenas förekomst både om universums första minuter och om generationer av stjärnor.",
        ],
        image: {
          src: "/images/timeline/early/primordial-elements.webp",
          alt: "Vetenskaplig illustration av väte- och heliumkärnor i det tidiga universum.",
          caption:
            "Väte och helium dominerade den materia som bildades i universums första minuter.",
          credit: "Illustration för The Unfolding Universe",
          kind: "illustration",
        },
      },
      {
        id: "aldsta-ljuset",
        heading: "Universums äldsta ljus",
        paragraphs: [
          "Ungefär 380 000 år efter den stora smällen hade universum svalnat så mycket att elektroner kunde bindas till atomkärnor. Ljuset kunde då färdas friare genom rymden.",
          "Detta ljus kan fortfarande observeras som den kosmiska mikrovågsbakgrunden. Små temperaturskillnader i strålningen visar hur materia var fördelad i det unga universum och hjälper forskare att förstå hur galaxer senare kunde bildas.",
        ],
        image: {
          src: "/images/timeline/early/cosmic-background.webp",
          alt: "Visualisering av små temperaturvariationer i den kosmiska mikrovågsbakgrunden.",
          caption:
            "Mikrovågsbakgrunden är ett av de viktigaste spåren efter universums tidiga historia.",
          credit:
            "Vetenskapligt inspirerad visualisering för The Unfolding Universe",
          kind: "diagram",
        },
      },
      {
        id: "morka-tiden",
        heading: "Innan de första stjärnorna tändes",
        paragraphs: [
          "Efter att atomer hade bildats fanns ännu inga stjärnor som lyste upp rymden. Gravitationen drog långsamt samman gas i områden som var något tätare än omgivningen.",
          "Efter tiotals till hundratals miljoner år kunde de första stjärnorna börja lysa. Deras ljus och senare explosioner förändrade gasen omkring dem och bidrog till utvecklingen av galaxer.",
        ],
      },
      {
        id: "hur-vet-vi",
        heading: "Hur mäter vi universums ålder?",
        paragraphs: [
          "Astronomer mäter bland annat hur snabbt universum expanderar, hur galaxer är fördelade och hur mikrovågsbakgrunden varierar. Tillsammans med fysikaliska modeller ger detta en ålder på ungefär 13,8 miljarder år.",
          "Olika mätmetoder ger inte alltid helt överensstämmande resultat. Särskilt skillnaden mellan vissa mätningar av dagens expansionshastighet och uppskattningar från det tidiga universum är ett aktivt forskningsområde.",
        ],
      },
    ],
    facts: [
      "Den stora smällen beskriver rymdens expansion, inte en explosion från en särskild plats.",
      "Den kosmiska mikrovågsbakgrunden kommer från en tid då universum var ungefär 380 000 år gammalt.",
      "Väte och helium bildades till stor del under universums första minuter.",
      "Vi kan observera ljus från universums barndom, men inte se själva början direkt.",
    ],
    evidence: [
      "Rödförskjutning hos avlägsna galaxer visar att rymden expanderar.",
      "Den kosmiska mikrovågsbakgrundens temperatur och små variationer.",
      "Mängdförhållandena mellan lätta grundämnen, särskilt väte och helium.",
      "Observationer av galaxernas fördelning och utveckling över kosmisk tid.",
    ],
    uncertainties: [
      "Vad som föregick den tidigaste fas som våra teorier kan beskriva.",
      "Vad mörk materia och mörk energi består av.",
      "Varför olika metoder för att mäta universums expansionshastighet inte alltid ger samma resultat.",
    ],
    relatedIds: ["solar-nebula", "earth"],
    sources: [
      {
        label: "NASA Science – Big Bang",
        url: "https://science.nasa.gov/universe/overview/",
      },
      {
        label: "ESA – Planck mission",
        url: "https://www.esa.int/Science_Exploration/Space_Science/Planck",
      },
      {
        label: "NASA – Cosmic microwave background",
        url: "https://science.nasa.gov/mission/wmap/",
      },
    ],
  },
  "solar-nebula": {
    id: "solar-nebula",
    kicker: "SOLSYSTEMETS HISTORIA · EN UNG STJÄRNA",
    lead: "För ungefär 4,6 miljarder år sedan började vårt solsystem ta form ur ett moln av gas och stoft. I mitten växte solen fram. Runt den snurrade en skiva av material som så småningom blev planeter, månar, asteroider och kometer.",
    hero: {
      src: "/images/timeline/early/solar-nebula-hero-v3.webp",
      alt: "Konstnärlig rekonstruktion av den unga solen omgiven av en skiva med gas, stoft och växande planetkroppar.",
      caption:
        "Så kan det unga solsystemet ha sett ut när planeterna började bildas.",
      credit: "Konstnärlig rekonstruktion för The Unfolding Universe",
      kind: "illustration",
    },
    sections: [
      {
        id: "molnet",
        heading: "Ett moln börjar falla samman",
        paragraphs: [
          "Solsystemets historia började i ett kallt moln av gas och stoft i Vintergatan. Gravitationen fick en del av molnet att dra ihop sig. När materialet samlades ökade temperaturen och tätheten i mitten.",
          "Vi vet inte exakt vilken händelse som satte igång sammanfallet. Närliggande stjärnbildning och tryckvågor är möjliga faktorer, men detaljerna om just vårt ursprungliga moln är inte kända.",
        ],
      },
      {
        id: "skivan",
        heading: "En skiva runt den unga solen",
        paragraphs: [
          "När molnet drog ihop sig roterade det snabbare och plattades till en skiva. Det mesta av materialet samlades i mitten där solen bildades, medan en mindre del blev kvar i skivan.",
          "Astronomer kan idag fotografera skivor runt andra unga stjärnor. Vissa visar ringar och luckor som kan vara tecken på pågående planetbildning.",
        ],
        image: {
          src: "/images/timeline/early/protoplanetary-disk.webp",
          alt: "Illustration av en ung stjärna med en roterande skiva av gas och stoft.",
          caption:
            "Planeter växer fram ur materialet i en protoplanetär skiva.",
          credit: "Illustration för The Unfolding Universe",
          kind: "illustration",
        },
      },
      {
        id: "stoft-till-sten",
        heading: "Från stoft till större kroppar",
        paragraphs: [
          "Små korn kolliderade och kunde fastna vid varandra. Med tiden bildades större ansamlingar och planetesimaler, kroppar som kunde växa vidare genom gravitation och kollisioner.",
          "Hur de första stenblocken snabbt blev kilometerstora kroppar är fortfarande ett viktigt forskningsproblem. Rörelser i gasen och ansamlingar av partiklar kan ha spelat stor roll.",
        ],
        image: {
          src: "/images/timeline/earth/accretion.webp",
          alt: "Diagram som visar hur stoft, planetesimaler och större planetkroppar bildas genom ackretion.",
          caption:
            "Ackretion: mindre partiklar och kroppar samlas till större objekt.",
          credit: "Illustration för The Unfolding Universe",
          kind: "diagram",
        },
      },
      {
        id: "inre-yttre",
        heading: "Varför blev planeterna så olika?",
        paragraphs: [
          "Nära solen var temperaturen hög och lättflyktiga ämnen svårare att behålla i fast form. Där växte de steniga planeterna fram: Merkurius, Venus, jorden och Mars.",
          "Längre ut var det kallare, så is och andra ämnen kunde bidra till större planetkärnor. Där bildades jätteplaneterna, som kunde samla på sig stora mängder gas eller isrika material. Deras utveckling var mer komplicerad än en enkel uppdelning i varmt och kallt.",
        ],
      },
      {
        id: "rester",
        heading: "Asteroider och kometer berättar historien",
        paragraphs: [
          "Allt material blev inte planeter. Små kroppar blev kvar som bland annat asteroider och kometer. Vissa meteoriter innehåller mycket gamla mineral som bildades när solsystemet var ungt.",
          "Genom att datera sådant material kan forskare uppskatta solsystemets ålder till ungefär 4,57 miljarder år. Meteoriter fungerar som tidskapslar från tiden innan jorden var färdigbildad.",
        ],
      },
      {
        id: "fortsatt-rorelse",
        heading: "Ett solsystem som fortsatte förändras",
        paragraphs: [
          "De unga planeterna påverkade varandra genom gravitation. Vissa kroppar kan ha flyttat sig betydligt från sina ursprungliga banor. Kollisioner fortsatte också efter att de största planeterna hade bildats.",
          "En sådan jättelik kollision är en viktig del av de ledande modellerna för hur vår måne uppstod. Solsystemets historia är därför inte bara en berättelse om hur planeter föddes, utan också om hur de förändrades.",
        ],
      },
    ],
    facts: [
      "Solen innehåller mer än 99 procent av solsystemets totala massa.",
      "Vi kan observera planetbildande skivor runt andra unga stjärnor.",
      "Meteoriter bevarar material från solsystemets allra första tid.",
      "Alla planeterna bildades inte nödvändigtvis på exakt de platser där de kretsar idag.",
    ],
    evidence: [
      "Radiometrisk datering av mycket gamla meteoriter.",
      "Observationer av protoplanetära skivor kring andra stjärnor.",
      "Datorsimuleringar av gravitation, gasrörelser och kollisioner.",
      "Kemiska och isotopiska jämförelser mellan planeter, månar och meteoriter.",
    ],
    uncertainties: [
      "Vilken händelse som utlöste sammanfallet av just vårt ursprungliga gasmoln.",
      "Exakt hur stoft blev till kilometerstora planetesimaler.",
      "Hur mycket de stora planeterna flyttade sig under solsystemets första tid.",
    ],
    relatedIds: ["earth", "moon", "oldest-zircons"],
    sources: [
      {
        label: "NASA Science – Solar System Facts",
        url: "https://science.nasa.gov/solar-system/solar-system-facts/",
      },
      {
        label: "NASA Science – Our Solar System",
        url: "https://science.nasa.gov/solar-system/",
      },
      {
        label: "ESO – ALMA observatory",
        url: "https://www.eso.org/public/teles-instr/alma/",
      },
    ],
  },
  moon: {
    id: "moon",
    kicker: "HADEIKUM · MÅNENS URSPRUNG",
    lead: "Månen är jordens närmaste stora följeslagare. De ledande teorierna beskriver hur en enorm kollision tidigt i solsystemets historia kastade material i bana runt jorden. Därifrån kan månen ha vuxit fram — men många detaljer är fortfarande öppna frågor.",
    hero: {
      src: "/images/timeline/early/moon-formation-hero-v3.webp",
      alt: "Konstnärlig rekonstruktion av en jättelik kollision mellan den unga jorden och en annan planetkropp.",
      caption:
        "En möjlig bild av den kollision som kan ha lett till månens bildning.",
      credit: "Konstnärlig rekonstruktion för The Unfolding Universe",
      kind: "illustration",
    },
    atmosphere: {
      mode: "embers",
      intensity: "normal",
    },
    showcase: {
      src: "/images/timeline/showcases/moon-rock.webp",
      title: "Månsten – anortosit",
      description:
        "Månens ljusa högland består till stor del av anortosit. Bergarten ger forskare ledtrådar om hur månens tidiga skorpa bildades när smält berg svalnade. Konstnärlig rekonstruktion, inte ett verkligt månprov.",
      alt: "Konstnärlig illustration av en ljusgrå, kristallin månsten med mörka mineralinslag, placerad på en polerad träplattform.",
    },

    sections: [
      {
        id: "kollisionen",
        heading: "En kollision som förändrade jorden",
        paragraphs: [
          "Enligt den ledande gruppen av modeller kolliderade den unga jorden med en annan stor himlakropp, ibland kallad Theia. Kollisionen kan ha kastat stora mängder material ut i omloppsbana.",
          "Det är viktigt att skilja modellen från ett observerat historiskt faktum: ingen vet exakt hur stor den andra kroppen var, vilken bana den hade eller hur kollisionen utvecklades.",
        ],
        image: {
          src: "/images/timeline/early/giant-impact.webp",
          alt: "Vetenskapligt inspirerad illustration av två unga planetkroppar som kolliderar och kastar ut material.",
          caption:
            "Jättenedslagshypotesen kan förklara flera egenskaper hos jorden och månen.",
          credit: "Illustration för The Unfolding Universe",
          kind: "illustration",
        },
      },
      {
        id: "spillrorna",
        heading: "Från utslungat material till måne",
        paragraphs: [
          "Efter kollisionen kan en skiva eller ett moln av stenmaterial ha kretsat runt jorden. Genom gravitation och sammanstötningar kunde materialet samlas till en större kropp.",
          "Olika simuleringar ger olika förlopp. Vissa modeller låter månen växa fram ur en skiva, medan andra undersöker om en stor måne kan ha bildats mycket snabbt efter själva nedslaget.",
        ],
      },
      {
        id: "magmahav",
        heading: "En glödande ung måne",
        paragraphs: [
          "Månen kan ha varit till stor del smält efter sin bildning. När den svalnade kunde lättare mineral stiga uppåt och bidra till att skapa en tidig skorpa.",
          "Månens ljusa högland består till stor del av anortosit, en bergart som ger ledtrådar om en tidig period då smälta bergarter separerades efter densitet.",
        ],
        image: {
          src: "/images/timeline/early/young-moon.webp",
          alt: "Konstnärlig rekonstruktion av den tidiga månens heta yta och begynnande skorpa.",
          caption: "Den unga månen kan ha haft ett omfattande magmahav.",
          credit: "Konstnärlig rekonstruktion för The Unfolding Universe",
          kind: "illustration",
        },
      },
      {
        id: "manstenar",
        heading: "Månstenarna är viktiga ledtrådar",
        paragraphs: [
          "Stenprover från månen och analyser av månmeteoriter visar att jorden och månen har ovanligt lika isotopsignaturer för flera grundämnen. Det är ett viktigt krav som teorier om månens bildning måste kunna förklara.",
          "Provernas ålder hjälper forskare att förstå när månen och dess skorpa bildades. Olika dateringar och tolkningar ger fortfarande utrymme för forskning om den exakta tidslinjen.",
        ],
      },
      {
        id: "tidvatten",
        heading: "Månen förändrar också jorden",
        paragraphs: [
          "Månens gravitation bidrar till tidvattnet i jordens hav. Genom tidvattenväxelverkan överförs rörelsemängd, vilket gör att månens bana långsamt förändras och jordens rotation bromsas på mycket lång sikt.",
          "Mätningar visar att månen idag rör sig bort från jorden med i genomsnitt ungefär 3,8 centimeter per år. Hastigheten har inte varit densamma under hela jordens historia.",
        ],
      },
      {
        id: "forskning",
        heading: "Hur testar vi teorierna?",
        paragraphs: [
          "Forskare kombinerar laboratorieanalyser av månstenar, observationer av månens inre och avancerade datorsimuleringar av jättelika kollisioner.",
          "En bra modell måste inte bara skapa en måne. Den behöver också förklara månens massa, bana, kemiska sammansättning och relation till jorden. Därför utvecklas modellerna när nya data blir tillgängliga.",
        ],
      },
    ],
    facts: [
      "Månen är ovanligt stor i förhållande till sin planet jämfört med många andra planet-måne-system.",
      "Månstenar är centrala för att förstå både månens och jordens tidigaste historia.",
      "Månen rör sig idag bort från jorden med i genomsnitt cirka 3,8 centimeter per år.",
      "Månens ljusa högland ger ledtrådar om dess tidiga skorpa.",
    ],
    evidence: [
      "Isotopiska likheter och skillnader mellan jordiska bergarter och månprover.",
      "Radiometriska dateringar av månstenar och månmeteoriter.",
      "Datorsimuleringar av kollisioner och material i omloppsbana.",
      "Mätningar av månens rörelse, gravitation och inre struktur.",
    ],
    uncertainties: [
      "Exakt när månen bildades och hur snabbt processen gick.",
      "Vilken storlek, sammansättning och bana den kolliderande kroppen hade.",
      "Hur den kemiska likheten mellan jorden och månen uppstod.",
    ],
    relatedIds: ["earth", "solar-nebula", "oceans"],
    sources: [
      {
        label: "NASA Science – Moon Formation",
        url: "https://science.nasa.gov/moon/formation/",
      },
      {
        label: "NASA Science – Moon Facts",
        url: "https://science.nasa.gov/moon/facts/",
      },
      {
        label: "NASA – Apollo Lunar Sample Laboratory",
        url: "https://curator.jsc.nasa.gov/lunar/",
      },
    ],
  },
};
