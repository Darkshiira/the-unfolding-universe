import type { MilestoneArticleData } from "./types";

const credit =
  "AI-genererad konstnärlig illustration för The Unfolding Universe";

/**
 * Earth Awakens: three milestones following the Cryogenian glaciations.
 * Hero and diagram files are placeholders until the artwork is created.
 */
export const earthAwakensArticles: Record<string, MilestoneArticleData> = {
  "ediacaran-earth": {
    id: "ediacaran-earth",
    kicker: "EDIACARA · EFTER ISEN",
    lead: "För omkring 635 miljoner år sedan började jorden återhämta sig efter en av sin historias mest extrema nedisningar. Isarna drog sig tillbaka, haven förändrades och nya miljöer växte fram. Men hur kunde en så nedkyld planet bli varm igen?",
    hero: {
      src: "/images/timeline/earth-awakens/ediacaran-earth-hero.webp",
      alt: "Konstnärlig rekonstruktion av smältande glaciärer, mörka uråldriga berg och öppet hav efter en global nedisning.",
      caption:
        "När den marinoiska nedisningen upphörde förändrades jordens hav och klimat kraftigt. Landskapet är en konstnärlig tolkning.",
      credit,
      kind: "illustration",
    },

    showcase: {
      src: "/images/timeline/showcases/cap-carbonate.webp",
      title: "Täckkarbonat – efter den stora isen",
      description:
        "Karbonatbergarter som avsatts ovanpå vissa glaciala sediment från kryogenium. De bevarar ledtrådar om hur havens kemi och miljöer förändrades efter omfattande nedisningar. Konstnärlig illustration av ett bergartsprov.",
      alt: "Konstnärlig museiillustration av en skiktad karbonatbergart i ljusgrå, beige och ockrafärgade toner på en rund, polerad träplattform.",
    },

    sections: [
      {
        id: "efter-snobollen",
        heading: "När en nästan frusen värld tinade",
        paragraphs: [
          "Under kryogenium drabbades jorden av omfattande nedisningar. Den senare av de två stora nedisningarna kallas den marinoiska och upphörde för ungefär 635 miljoner år sedan.",
          "När isen drog sig tillbaka kunde havsvatten åter cirkulera över stora områden. Kuster, havsbottnar och väderförhållanden förändrades samtidigt som smältvatten och vittring påverkade kemin i haven.",
          "Forskare vet inte exakt hur snabbt hela övergången gick eller hur mycket öppet vatten som hade funnits under de kallaste perioderna. Spåren visar ändå att övergången från is till varmare klimat var en omvälvande händelse.",
        ],
      },
      {
        id: "vaxthusgaser",
        heading: "Hur kunde jorden bli varm igen?",
        paragraphs: [
          "En viktig hypotes är att vulkaner fortsatte att släppa ut koldioxid medan stora delar av jordens yta var täckta av is. Om den vanliga kemiska vittringen på land samtidigt minskade kunde koldioxid ansamlas i atmosfären.",
          "Koldioxid är en växthusgas. Höga halter kan bidra till att mer värme stannar kvar, vilket i modeller kan driva en kraftig uppvärmning och få isen att smälta.",
          "Detta är inte en direkt mätning av atmosfären för 635 miljoner år sedan. Forskare testar förklaringen med klimatmodeller och kemiska spår i bergarter, och detaljerna om tidpunkter och halter är fortfarande osäkra.",
        ],
      },
      {
        id: "karbonatlagren",
        heading: "Märkliga berglager ovanpå istidens spår",
        paragraphs: [
          "På flera platser i världen ligger karbonatbergarter direkt ovanpå sediment som förknippas med de stora nedisningarna. De kallas ofta täckkarbonater, eller cap carbonates.",
          "Dessa lager är viktiga eftersom de markerar en period då havens kemi och avsättningsmiljöer förändrades kraftigt efter nedisningen. I vissa områden har lagren ovanliga sedimentära strukturer och kemiska signaturer.",
          "Forskarna diskuterar fortfarande hur snabbt lagren bildades och vilka processer som bäst förklarar deras olika egenskaper. De är ledtrådar till en förändrad planet, inte en enkel termometer över dåtidens klimat.",
        ],

        image: {
          src: "/images/timeline/earth-awakens/cap-carbonates-diagram.webp",
          alt: "Pedagogisk illustration i fyra steg av hur en global istid följs av uppvärmning, förändrad havskemi och avsättning av cap-karbonater ovanpå glaciala sediment.",
          caption:
            "Cap-karbonater är karakteristiska karbonatlager som förekommer ovanpå vissa glaciala avlagringar från kryogenium. De hjälper forskare att undersöka hur klimatet och havens kemi förändrades efter omfattande nedisningar.",
          credit:
            "AI-genererad pedagogisk illustration för The Unfolding Universe",
          kind: "diagram",
        },
      },
      {
        id: "haven-forandras",
        heading: "Haven fick nya förutsättningar",
        paragraphs: [
          "När klimatet förändrades påverkades också havens salthalt, näringsämnen och kemiska kretslopp. Smältande is, förändrad vittring och havscirkulation kan ha spelat olika roller.",
          "Geokemiska mätningar visar att haven genomgick betydande förändringar under övergången från kryogenium till ediacara. Det är däremot svårt att avgöra exakt hur dessa förändringar såg ut i varje havsområde.",
          "De nya förhållandena blev en del av bakgrunden till den senare utvecklingen av mer komplexa livsformer. Men det vore för enkelt att säga att isens avsmältning ensam orsakade denna biologiska förändring.",
        ],
      },
      {
        id: "en-ny-period",
        heading: "Början på ediacara",
        paragraphs: [
          "Gränsen vid omkring 635 miljoner år sedan markerar början på den geologiska perioden ediacara, som sträcker sig fram till kambriums början för ungefär 539 miljoner år sedan.",
          "Under ediacara förändrades både miljöer och liv. Mot slutet av perioden fanns organismer som lämnat efter sig märkliga fossil, ibland med former som skiljer sig från dagens djur.",
          "Historien om livet under ediacara hör till en annan del av tidslinjen. Här visar jordens bergarter hur dramatiska klimatförändringar kunde skapa nya förutsättningar för planetens fortsatta utveckling.",
        ],
      },
    ],
    facts: [
      "Den marinoiska nedisningen upphörde för omkring 635 miljoner år sedan.",
      "Täckkarbonater finns på flera kontinenter ovanpå sediment som förknippas med kryogeniska nedisningar.",
      "Ediacara är namnet på en geologisk period, inte bara på en grupp fossil.",
      "Koldioxid från vulkanism är en viktig del av flera modeller för hur en starkt nedisad jord kunde värmas upp.",
    ],
    evidence: [
      "Geologiska lagerföljder där glaciala sediment följs av täckkarbonater.",
      "Radiometriska dateringar som hjälper till att tidsbestämma övergången.",
      "Isotopmätningar och andra geokemiska analyser av sedimentära bergarter.",
      "Klimatmodeller av isutbredning, växthusgaser och havscirkulation.",
    ],
    uncertainties: [
      "Hur stor del av havsytan som var istäckt under nedisningens kallaste skeden.",
      "Hur snabbt avsmältningen skedde och vilka växthusgashalter som krävdes.",
      "Exakt hur täckkarbonaternas olika strukturer och kemiska signaturer bildades.",
    ],
    relatedIds: ["snowball", "gondwana", "ediacaran-life"],
    sources: [
      {
        label:
          "International Commission on Stratigraphy – International Chronostratigraphic Chart",
        url: "https://stratigraphy.org/chart",
      },
      {
        label:
          "Hoffman et al. (2017) – Snowball Earth climate dynamics and Cryogenian geology",
        url: "https://doi.org/10.1126/sciadv.1600983",
      },
    ],
  },
  gondwana: {
    id: "gondwana",
    kicker: "EDIACARA · KONTINENTER I RÖRELSE",
    lead: "För omkring 550 miljoner år sedan höll en enorm landmassa på att ta form. Genom långvariga kollisioner förenades gamla kontinentalblock till Gondwana – en superkontinent vars delar i dag ligger utspridda över flera världsdelar.",

    hero: {
      src: "/images/timeline/earth-awakens/gondwana-hero.webp",
      alt: "Konstnärlig vy från hög höjd över en uråldrig superkontinent med bergskedjor, vidsträckta kuster, hav och ett stort istäckt område.",
      caption:
        "Gondwana bildades genom en lång serie kollisioner mellan äldre kontinentalblock. Bilden är en konstnärlig tolkning och visar inte en exakt rekonstruktion av Gondwanas geografi vid 550 miljoner år sedan.",
      credit:
        "AI-genererad konstnärlig rekonstruktion för The Unfolding Universe",
      kind: "illustration",
    },

    sections: [
      {
        id: "vad-var-gondwana",
        heading: "En väldig landmassa före Pangea",
        paragraphs: [
          "Gondwana var en mycket stor sammanhängande landmassa som omfattade delar av det som senare skulle bli Afrika, Sydamerika, Antarktis, Australien, Indien och Arabiska halvön.",
          "Den var inte identisk med Pangea. Gondwana existerade långt tidigare och blev senare den södra delen av Pangea när ännu fler kontinenter samlades.",
          "Gondwanas konturer och läge förändrades under hundratals miljoner år. En karta över superkontinenten måste därför alltid knytas till en viss tidpunkt.",
        ],
      },
      {
        id: "kontinentkollisioner",
        heading: "När kontinenterna kolliderade",
        paragraphs: [
          "Gondwana bildades inte på en enda dag eller ens under en enda kort geologisk episod. Flera gamla kontinentalblock rörde sig mot varandra och fogades samman under sen neoproterozoisk och tidig paleozoisk tid.",
          "När kontinenter kolliderar kan berggrunden pressas ihop, veckas och omvandlas. Sådana processer skapar bergskedjor och lämnar geologiska spår som kan bevaras långt efter att bergen har eroderat ned.",
          "En viktig del av Gondwanas sammansättning kopplas till de bergsbildande processer som ofta kallas den panafrikanska orogenesen. Det namnet täcker flera händelser i olika regioner.",
        ],
      },
      {
        id: "geologiska-pusslet",
        heading: "Hur kan forskarna lägga pusslet?",
        paragraphs: [
          "Forskare jämför bergarter på kontinenter som i dag ligger långt ifrån varandra. Om bergskedjor, mineral och geologiska åldrar passar ihop kan det tyda på att områdena en gång satt samman.",
          "Paleomagnetiska undersökningar kan ge ledtrådar om en bergarts tidigare läge i förhållande till jordens magnetfält. Sådana data kombineras med dateringar och strukturer i berggrunden.",
          "Resultatet är rekonstruktioner som blir bättre när nya data tillkommer. Vissa samband är väl belagda, medan andra delar av Gondwanas tidiga historia fortfarande diskuteras.",
        ],

        image: {
          src: "/images/timeline/earth-awakens/gondwana-reconstruction.webp",
          alt: "Pedagogisk infografik om superkontinenten Gondwana, med en schematisk karta, jämförelse med dagens kontinenter, geologiska bevis och en tidslinje över kontinenternas sammanslagning.",
          caption:
            "Gondwana bildades genom långvariga kollisioner mellan äldre kontinentalblock. Forskare använder bland annat bergarter, fossil och paleomagnetiska data för att rekonstruera dess historia. Bilden är schematisk och innehåller även exempel från senare perioder i Gondwanas historia.",
          credit:
            "AI-genererad pedagogisk illustration för The Unfolding Universe",
          kind: "diagram",
        },
      },
      {
        id: "land-och-hav",
        heading: "Nya kuster och förändrade hav",
        paragraphs: [
          "När stora landmassor förenas förändras jordens geografi. Havsområden kan krympa, bergskedjor växa fram och nya kustlinjer bildas.",
          "Sådana förändringar kan påverka havsströmmar, sedimenttransport och klimat över långa tidsrymder. Effekterna beror bland annat på var landmassorna ligger och hur höga bergskedjorna är.",
          "Under Gondwanas långa historia flyttade sig superkontinenten i förhållande till jordens poler. Därför skiftade också de klimatzoner som olika delar av landmassan låg i.",
        ],
      },
      {
        id: "spar-i-nutiden",
        heading: "En försvunnen kontinent lever kvar i kartan",
        paragraphs: [
          "Gondwana började långt senare brytas sönder. Under mesozoikum öppnades nya hav när de stora landmassorna långsamt gled isär.",
          "Att Sydamerika och Afrika verkar passa ihop längs sina kuster är en välkänd ledtråd, men de starkaste bevisen finns i bergarter, fossil, havsbottnens struktur och plattektoniska mätningar.",
          "När vi ser dagens kontinenter ser vi alltså inte ett färdigt, oföränderligt pussel. Vi ser en tillfällig ögonblicksbild av en planet där kontinenterna fortfarande rör sig.",
        ],
      },
    ],
    facts: [
      "Gondwana omfattade bland annat stora delar av dagens Afrika, Sydamerika, Antarktis, Australien och Indien.",
      "Superkontinenten byggdes upp genom flera kollisioner, inte en enda händelse.",
      "Gondwana blev senare en stor del av Pangea.",
      "Gamla bergskedjor kan fortfarande spåras på kontinenter som i dag skiljs åt av hav.",
    ],
    evidence: [
      "Likheter mellan bergarter, geologiska åldrar och bergskedjor på skilda kontinenter.",
      "Radiometrisk datering av mineral från gamla kollisionszoner.",
      "Paleomagnetiska data som ger ledtrådar om kontinentalblockens tidigare positioner.",
      "Strukturella och geofysiska undersökningar av gamla kontinentgränser.",
    ],
    uncertainties: [
      "Exakt när alla delar av Gondwana blev sammanfogade.",
      "Hur vissa mindre kontinentalblock rörde sig före sammanslagningen.",
      "Detaljerna i superkontinentens geografi vid olika tidpunkter.",
    ],
    relatedIds: ["rodinia", "ediacaran-earth", "pangaea"],
    sources: [
      {
        label: "Encyclopaedia Britannica – Gondwana",
        url: "https://www.britannica.com/place/Gondwana",
      },
      {
        label: "USGS – This Dynamic Earth: The Story of Plate Tectonics",
        url: "https://pubs.usgs.gov/gip/dynamic/dynamic.html",
      },
    ],
  },
  "ordovician-ice": {
    id: "ordovician-ice",
    kicker: "SEN ORDOVICIUM · IS OCH FÖRÄNDRING",
    lead: "För omkring 445 miljoner år sedan kyls jorden åter kraftigt. Stora inlandsisar växer över delar av Gondwana, havsnivån sjunker och livet i haven utsätts för snabba miljöförändringar. Det är början på en av jordens stora biologiska kriser.",
    hero: {
      src: "/images/timeline/earth-awakens/ordovician-ice-hero.webp",
      alt: "Konstnärlig rekonstruktion av stora glaciärer på en karg uråldrig kontinent under sen ordovicium.",
      caption:
        "Under sen ordovicium bredde is ut sig över delar av Gondwana. Bilden visar en möjlig miljö och är inte en exakt rekonstruktion av en specifik plats.",
      credit,
      kind: "illustration",
    },
    atmosphere: {
      mode: "frost",
      intensity: "dramatic",
    },
    sections: [
      {
        id: "varlden-under-ordovicium",
        heading: "En värld där livet fanns i haven",
        paragraphs: [
          "Under ordovicium fanns ett rikt och varierat liv i haven. Bland djuren fanns trilobiter, armfotingar, koraller och andra ryggradslösa organismer, medan fiskarnas tidiga släktingar också utvecklades.",
          "Kontinenterna låg annorlunda än i dag. Den stora landmassan Gondwana sträckte sig mot höga sydliga breddgrader, vilket blev betydelsefullt när klimatet förändrades.",
          "Ordovicium var inte genomgående kallt. Den stora nedisningen kom sent i perioden, efter en lång tid då många havsmiljöer varit relativt varma.",
        ],
      },
      {
        id: "isen-vaxer",
        heading: "När isen bredde ut sig över Gondwana",
        paragraphs: [
          "Mot slutet av ordovicium utvecklades stora glaciärer på delar av Gondwana. Geologiska spår visar att isen påverkade områden som då låg nära sydpolen.",
          "När vatten binds i stora inlandsisar minskar mängden vatten i haven. Därför kan havsnivån sjunka, även om den exakta förändringen beror på flera samtidiga geologiska processer.",
          "Det är fortfarande en forskningsfråga hur omfattande isarna var och hur snabbt de växte och drog sig tillbaka under den relativt korta nedisningsperioden.",
        ],
      },
      {
        id: "havsnivan",
        heading: "När grunda hav försvann",
        paragraphs: [
          "Många ordoviciska organismer levde i grunda hav som täckte stora delar av kontinenterna. När havsnivån sjönk förändrades eller försvann viktiga livsmiljöer.",
          "Samtidigt kunde temperatur, havscirkulation och syreförhållanden förändras. Olika grupper av organismer påverkades på olika sätt.",
          "Forskare undersöker sedimentlager och fossil för att förstå hur miljöförändringarna sammanföll med förlusterna av arter.",
        ],
        image: {
          src: "/images/timeline/earth-awakens/ordovician-sea-level.webp",
          alt: "Pedagogiskt diagram som visar hur vatten binds i växande inlandsisar och hur havsnivån kan sjunka över grunda kontinentalsocklar.",
          caption:
            "När inlandsisar växer kan den globala havsnivån sjunka och grunda havsområden minska. Diagrammet förenklar ett komplext geologiskt förlopp.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "massutrotningen",
        heading: "En av jordens stora massutrotningar",
        paragraphs: [
          "Den sena ordoviciska massutrotningen räknas till de fem stora massutrotningarna i den fanerozoiska historien. Den drabbade framför allt organismer i haven, där nästan allt känt djurliv vid tiden fanns.",
          "Forskare brukar skilja mellan flera pulser av utdöenden kring övergången mellan ordovicium och silur. Nedkylning, förändrad havsnivå och senare förändringar i havsmiljöerna är viktiga delar av förklaringen.",
          "Det går inte att peka ut en enda mekanism som säkert förklarar alla förluster. Flera miljöförändringar kan ha samverkat och påverkat olika organismer vid olika tidpunkter.",
        ],
      },
      {
        id: "spar-av-en-istid",
        heading: "Hur kan vi se isen hundratals miljoner år senare?",
        paragraphs: [
          "Glaciärer kan lämna efter sig osorterade sediment, repor i berggrunden och andra spår. När sådana avlagringar bevaras i berglager kan forskare undersöka hur isen rörde sig.",
          "Fossil och kemiska signaler i sediment ger dessutom information om hur haven förändrades. Genom att jämföra fynd från olika platser går det att bygga en bild av en global klimatkris.",
          "Det är en påminnelse om att jordens klimat och livets historia hänger ihop: förändringar i is, hav och atmosfär kan få konsekvenser som syns i fossil långt senare.",
        ],
      },
    ],
    facts: [
      "Den sena ordoviciska nedisningen inträffade för omkring 445 miljoner år sedan.",
      "Gondwana låg delvis nära sydpolen när de stora inlandsisarna växte.",
      "När vatten binds i glaciärer kan den globala havsnivån sjunka.",
      "Den sena ordoviciska massutrotningen drabbade främst livet i haven.",
    ],
    evidence: [
      "Glaciala sediment och andra spår efter is på delar av det forntida Gondwana.",
      "Sedimentära lagerföljder som visar förändringar i havsnivå.",
      "Fossilserier som dokumenterar förändringar i marina ekosystem.",
      "Geokemiska mätningar som ger ledtrådar om temperatur och havsmiljö.",
    ],
    uncertainties: [
      "Hur snabbt nedisningen började och hur stor isutbredningen var.",
      "Vilka kombinationer av klimat- och havsförändringar som orsakade de olika utdöendepulserna.",
      "Hur lokala förändringar i havsmiljöerna varierade mellan olika delar av världen.",
    ],
    relatedIds: ["gondwana", "snowball", "permian-extinction-earth"],
    sources: [
      {
        label:
          "International Commission on Stratigraphy – International Chronostratigraphic Chart",
        url: "https://stratigraphy.org/chart",
      },
      {
        label: "Encyclopaedia Britannica – Ordovician extinction",
        url: "https://www.britannica.com/science/Ordovician-extinction",
      },
    ],
  },
};
