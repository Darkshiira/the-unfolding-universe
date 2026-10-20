import type { MilestoneArticleData } from "./types";

const credit = "AI-genererad illustration för The Unfolding Universe";

export const earlyEarthArticles: Record<string, MilestoneArticleData> = {
  "oldest-zircons": {
    id: "oldest-zircons",
    kicker: "HADEIKUM · JORDENS ÄLDSTA SPÅR",
    lead: "Hur kan vi veta något om en värld som fanns för 4,4 miljarder år sedan? Svaret finns i några av jordens allra minsta och mest motståndskraftiga kristaller. De fungerar som tidskapslar från vår planets första tid.",
    hero: {
      src: "/images/timeline/early-earth/zircons-hero.webp",
      alt: "Närbild av gyllene zirkonkristaller i uråldrig berggrund.",
      caption:
        "Zirkonkristaller kan bevara spår från jordens tidigaste historia. Konstnärlig illustration.",
      credit,
      kind: "illustration",
    },
    showcase: {
      src: "/images/timeline/showcases/zircon.webp",
      title: "Zirkon – en uråldrig tidskapsel",
      description:
        "I Jack Hills i Australien har forskare hittat zirkonkristaller som är omkring 4,4 miljarder år gamla. De verkliga kristallerna är ofta mindre än ett sandkorn. Här visas en konstnärligt förstorad modell.",
      alt: "Konstnärlig museimodell av gyllene zirkonkristaller på en polerad träplattform.",
    },

    sections: [
      {
        id: "tidskapslar",
        heading: "Små kristaller som överlevt miljarder år",
        paragraphs: [
          "Zirkon är ett mineral som kan bildas när smält berg svalnar. Det är ovanligt motståndskraftigt mot kemisk förändring och kan därför överleva även när den ursprungliga bergarten bryts ned.",
          "I Jack Hills i västra Australien har forskare hittat zirkonkristaller som är omkring 4,4 miljarder år gamla. De är äldre än nästan alla bevarade bergarter på jorden.",
          "Kristallerna är ofta mindre än ett sandkorn. Ändå innehåller de information om förhållanden som rådde mycket tidigt i jordens historia.",
        ],
      },
      {
        id: "datering",
        heading: "Hur mäter forskarna kristallernas ålder?",
        paragraphs: [
          "När zirkon bildas kan uran byggas in i dess kristallstruktur. Med tiden sönderfaller uran till bly i en välkänd takt.",
          "Genom att mäta mängden uran och bly kan forskare beräkna när kristallen bildades. Metoden kallas uran–bly-datering.",
          "Forskare undersöker också kristallernas inre struktur för att upptäcka förändringar som kan påverka dateringen.",
        ],

        image: {
          src: "/images/timeline/early-earth/zircon-dating.webp",
          alt: "Infografik som visar hur uran-238 sönderfaller till bly-206 och hur forskare använder processen för att åldersbestämma zirkonkristaller.",
          caption:
            "Uran–bly-datering fungerar som en geologisk klocka. Genom att mäta uran och bly i en zirkonkristall kan forskare beräkna när den bildades.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "vatten",
        heading: "Fanns det vatten redan då?",
        paragraphs: [
          "Vissa mycket gamla zirkoner innehåller syreisotoper som kan tyda på att materialet de bildades ur tidigare hade reagerat med flytande vatten.",
          "Det kan betyda att delar av jordens yta hade svalnat tillräckligt för att vatten skulle kunna finnas redan för omkring 4,4 miljarder år sedan.",
          "Det betyder däremot inte att forskarna vet hur stora de tidiga haven var. Kristallerna ger ledtrådar, inte en fullständig bild.",
        ],
      },
      {
        id: "jordskorpan",
        heading: "Vad berättar de om jordskorpan?",
        paragraphs: [
          "Zirkonernas kemiska sammansättning ger information om de smältor där kristallerna bildades.",
          "Vissa resultat antyder att jordskorpan redan mycket tidigt kunde smälta, stelna och omvandlas flera gånger.",
          "Men det är fortfarande osäkert hur stora och stabila de första områdena med fast jordskorpa var.",
        ],
      },
      {
        id: "betydelse",
        heading: "Varför är fynden så viktiga?",
        paragraphs: [
          "Jorden är en aktiv planet. Bergarter bryts ned, omvandlas och återvinns genom geologiska processer. Därför finns mycket få direkta spår kvar från planetens första hundratals miljoner år.",
          "De gamla zirkonerna ger forskarna en sällsynt möjlighet att undersöka denna nästan försvunna tid.",
          "Varje ny analys kan hjälpa oss att förstå när jordens yta svalnade och hur tidiga miljöer utvecklades.",
        ],
      },
    ],
    facts: [
      "Vissa zirkoner från Jack Hills är omkring 4,4 miljarder år gamla.",
      "En zirkonkristall kan vara mycket äldre än bergarten där den hittas.",
      "Uran–bly-datering gör det möjligt att undersöka kristallernas ålder.",
      "Kemiska spår i zirkoner kan ge ledtrådar om mycket tidigt vatten.",
    ],
    evidence: [
      "Radiometrisk uran–bly-datering.",
      "Analyser av syreisotoper och spårämnen.",
      "Mikroskopiska undersökningar av kristallstrukturer.",
      "Jämförelser med experiment och geologiska modeller.",
    ],
    uncertainties: [
      "Hur stor del av jordens yta som var fast för 4,4 miljarder år sedan.",
      "Hur mycket flytande vatten som fanns.",
      "Hur den första jordskorpan bildades och förändrades.",
    ],
    relatedIds: ["earth", "oceans", "early-crust"],
    sources: [
      {
        label: "USGS – The Age of the Earth",
        url: "https://pubs.usgs.gov/gip/geotime/age.html",
      },
      {
        label: "NASA Science – Earth Facts",
        url: "https://science.nasa.gov/earth/facts/",
      },
    ],
  },

  oceans: {
    id: "oceans",
    kicker: "HADEIKUM · DE FÖRSTA HAVEN",
    lead: "I dag täcker vatten större delen av vår planet. Men varifrån kom det? Och när svalnade den unga jorden tillräckligt för att de första haven skulle kunna bildas? Svaret är en av de mest fascinerande frågorna om jordens tidiga historia.",
    hero: {
      src: "/images/timeline/early-earth/oceans-hero.webp",
      alt: "Ett urtida hav med vulkaniska öar under en dramatisk himmel.",
      caption:
        "En möjlig bild av jordens tidiga hav. Deras exakta utseende är okänt.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "ursprung",
        heading: "Varifrån kom jordens vatten?",
        paragraphs: [
          "En del av jordens vatten kan ha funnits bundet i de mineral och himlakroppar som byggde upp planeten.",
          "Vattenrikt material kan också ha tillförts genom nedslag under solsystemets tidiga historia.",
          "Forskare jämför bland annat olika väteisotoper i meteoriter och jordiskt vatten för att förstå vattnets ursprung. Det är möjligt att flera olika källor bidrog.",
        ],
      },
      {
        id: "regn",
        heading: "När började det regna?",
        paragraphs: [
          "Den mycket unga jorden var periodvis så varm att vatten kunde förekomma som ånga i atmosfären.",
          "När planetens yta svalnade kunde vattenångan kondensera och bilda flytande vatten där temperatur och tryck tillät det.",
          "Processen var sannolikt komplicerad. Stora nedslag och vulkanisk aktivitet kunde förändra miljön och värma upp ytan igen.",
        ],

        image: {
          src: "/images/timeline/early-earth/oceans-first-rain.webp",
          alt: "Konstnärlig rekonstruktion av den unga jorden med vulkaniska öar, vattenånga, mörka regnmoln och regn över ett tidigt hav.",
          caption:
            "När den unga jorden svalnade kunde vattenånga kondensera och falla som regn. Hur de allra första haven såg ut vet forskarna ännu inte.",
          credit,
          kind: "illustration",
        },
      },
      {
        id: "spar",
        heading: "Spåren efter ett försvunnet urhav",
        paragraphs: [
          "Vissa zirkonkristaller från omkring 4,4 miljarder år sedan har kemiska signaturer som kan tyda på kontakt med flytande vatten.",
          "Det är en viktig ledtråd om att vatten kan ha funnits på jordens yta mycket tidigt.",
          "Men fynden visar inte exakt om vattnet bildade små sjöar, regionala hav eller ett stort sammanhängande världshav.",
        ],
      },
      {
        id: "atmosfar",
        heading: "Haven och den tidiga atmosfären",
        paragraphs: [
          "Hav och atmosfär påverkar varandra. Vatten kan lösa upp gaser och mineralämnen, medan atmosfärens sammansättning påverkar temperaturen på planetens yta.",
          "Vulkanisk aktivitet släppte ut gaser som bidrog till att forma den tidiga atmosfären.",
          "Den innehöll inte samma stora mängd fritt syre som dagens luft. Det skulle dröja mycket länge innan syre blev vanligt i atmosfären.",
        ],
      },
      {
        id: "liv",
        heading: "Varför är vatten så viktigt för livet?",
        paragraphs: [
          "Flytande vatten gör det möjligt för många kemiska ämnen att lösas upp, transporteras och reagera med varandra.",
          "Allt liv vi känner till behöver vatten. Därför är frågan om jordens första hav nära kopplad till forskningen om livets uppkomst.",
          "Men vatten räcker inte ensamt för att skapa liv. Även energi, kemiska byggstenar och lämpliga miljöer behövs.",
        ],
      },
      {
        id: "forandring",
        heading: "Ett hav som aldrig står stilla",
        paragraphs: [
          "Jordens hav har förändrats genom hela planetens historia.",
          "Kontinenternas rörelser har skapat och stängt havsbassänger. Klimatförändringar har påverkat havsnivåer och temperaturer.",
          "Det vatten vi ser i dag ingår i ett kretslopp mellan hav, atmosfär, berggrund och jordens inre.",
        ],
      },
    ],
    facts: [
      "Omkring 71 procent av jordens yta täcks av vatten.",
      "Jordens vatten kan ha flera olika ursprung.",
      "Vissa 4,4 miljarder år gamla zirkoner kan bära spår av flytande vatten.",
      "Allt känt liv på jorden är beroende av vatten.",
    ],
    evidence: [
      "Isotopmätningar i meteoriter och vatten.",
      "Kemiska analyser av mycket gamla zirkonkristaller.",
      "Studier av gamla sedimentära bergarter.",
      "Modeller av jordens tidiga atmosfär och temperatur.",
    ],
    uncertainties: [
      "När de första bestående haven bildades.",
      "Hur stora de tidigaste haven var.",
      "Hur mycket vatten som kom från olika källor.",
    ],
    relatedIds: ["oldest-zircons", "earth", "early-crust"],
    sources: [
      {
        label: "NOAA – Ocean Facts",
        url: "https://oceanservice.noaa.gov/facts/oceanwater.html",
      },
      {
        label: "USGS – Where is Earth's Water?",
        url: "https://www.usgs.gov/special-topics/water-science-school/science/where-earths-water",
      },
    ],
  },

  "early-crust": {
    id: "early-crust",
    kicker: "HADEIKUM · JORDENS FÖRSTA BERGGRUND",
    lead: "Från en mycket het och delvis smält värld började jorden utveckla en fast yta. Men den första jordskorpan var inte som den vi känner i dag. Den bildades, förändrades och förstördes gång på gång.",
    hero: {
      src: "/images/timeline/early-earth/crust-hero.webp",
      alt: "Den unga jordens mörka, stelnande yta med sprickor av glödande lava.",
      caption:
        "En konstnärlig rekonstruktion av en ung planet där fast berg börjar bildas.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "svalnar",
        heading: "När den glödande ytan svalnade",
        paragraphs: [
          "Under jordens tidigaste historia frigjordes stora mängder värme genom kollisioner och radioaktivt sönderfall.",
          "När smält berg svalnar kristalliserar mineral och bildar fast berggrund.",
          "Men nya nedslag och värme från planetens inre kunde smälta delar av skorpan igen. Den första fasta ytan var därför sannolikt mycket föränderlig.",
        ],

        image: {
          src: "/images/timeline/early-earth/crust-formation.webp",
          alt: "Vetenskaplig illustration av hur den unga jordens smälta yta gradvis svalnar och bildar en tunn, tidig jordskorpa ovanför hetare berggrund.",
          caption:
            "När jordens yta svalnade kunde smält berg stelna till en tidig jordskorpa. Nedslag och vulkanisk aktivitet kunde sedan förändra eller smälta delar av den igen.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "bergarter",
        heading: "Olika slags jordskorpa",
        paragraphs: [
          "I dag skiljer forskare mellan oceanisk och kontinental jordskorpa.",
          "Oceanisk skorpa är vanligen tunnare och består till stor del av basaltiska bergarter. Kontinental skorpa är ofta tjockare och har en annan genomsnittlig kemisk sammansättning.",
          "Den allra första jordskorpan behöver inte ha sett ut eller fungerat på samma sätt som dagens.",
        ],
      },
      {
        id: "spar",
        heading: "Varför finns så få spår kvar?",
        paragraphs: [
          "Jorden är geologiskt aktiv. Bergarter kan brytas ned av erosion, omvandlas under högt tryck och smälta på nytt.",
          "Därför är mycket gamla bergarter ovanliga. Acastagnejsen i Kanada är ett exempel på berggrund som är omkring fyra miljarder år gammal.",
          "Ännu äldre enskilda zirkonkristaller visar att mineral kunde bildas långt tidigare.",
        ],
      },
      {
        id: "plattor",
        heading: "När började jordskorpans plattor röra sig?",
        paragraphs: [
          "I dag är jordens yttersta skal uppdelat i tektoniska plattor som rör sig långsamt.",
          "Plattornas rörelser påverkar bland annat jordbävningar, vulkaner och bergskedjor.",
          "Exakt när dagens typ av plattektonik började är omdiskuterat. Den unga jorden kan ha haft andra sätt att transportera värme och förändra sin skorpa.",
        ],
      },
      {
        id: "kontinenter",
        heading: "De första stegen mot kontinenter",
        paragraphs: [
          "Genom smältning, avsvalning och kemisk omvandling kunde nya typer av berggrund bildas.",
          "Med tiden utvecklades mer stabila delar av jordskorpan som blev byggstenar till kontinenterna.",
          "Det var början på en mycket lång historia av kontinenter som växte, kolliderade och bröts isär.",
        ],
      },
    ],
    facts: [
      "Jordskorpan är jordens yttersta fasta lager.",
      "Oceanisk och kontinental jordskorpa har olika egenskaper.",
      "Acastagnejsen är omkring fyra miljarder år gammal.",
      "När modern plattektonik började är fortfarande omdiskuterat.",
    ],
    evidence: [
      "Radiometrisk datering av gamla bergarter.",
      "Mineralanalyser och undersökningar av bergarters kemi.",
      "Geologiska strukturer som visar deformation.",
      "Datormodeller av jordens tidiga värmeutveckling.",
    ],
    uncertainties: [
      "Hur den allra första jordskorpan såg ut.",
      "Hur länge de första fasta områdena överlevde.",
      "När modern plattektonik etablerades.",
    ],
    relatedIds: ["earth", "oldest-zircons", "first-rocks"],
    sources: [
      {
        label: "USGS – This Dynamic Earth",
        url: "https://pubs.usgs.gov/gip/dynamic/dynamic.html",
      },
      {
        label: "NASA Science – Earth Facts",
        url: "https://science.nasa.gov/earth/facts/",
      },
    ],
  },

  "late-bombardment": {
    id: "late-bombardment",
    kicker: "HADEIKUM OCH ARKEIKUM · NEDSLAGENS HISTORIA",
    lead: "Under solsystemets första tid fanns mängder av mindre himlakroppar kvar mellan planeterna. Många kolliderade med jorden och månen. Nedslagen kunde smälta berggrund, skapa enorma kratrar och förändra hela planetens miljö.",
    hero: {
      src: "/images/timeline/early-earth/bombardment-hero.webp",
      alt: "Asteroider och ljusstarka nedslag mot den unga jordens yta.",
      caption:
        "Stora nedslag formade det tidiga solsystemet. Konstnärlig illustration.",
      credit,
      kind: "illustration",
    },
    atmosphere: {
      mode: "embers",
      intensity: "dramatic",
    },
    sections: [
      {
        id: "rester",
        heading: "Rester från planeternas födelse",
        paragraphs: [
          "När planeterna bildades fanns fortfarande många mindre himlakroppar kvar i solsystemet.",
          "Planeternas gravitation kunde förändra deras banor och skicka dem mot andra himlakroppar.",
          "När en asteroid träffar en planet frigörs mycket energi. Stora nedslag kan bilda kratrar, smälta berggrund och kasta ut material.",
        ],

        image: {
          src: "/images/timeline/early-earth/asteroid-impact-diagram.webp",
          alt: "Genomskärning av ett stort asteroidnedslag som visar hur en krater bildas, berggrund smälter och stötvågor sprider sig genom marken.",
          caption:
            "Ett stort asteroidnedslag frigör enorma mängder energi. Berggrund kan krossas och smälta, material kastas ut och en krater bildas. Illustrationens proportioner är förenklade.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "manen",
        heading: "Månen bevarar det förflutna",
        paragraphs: [
          "På jorden har erosion, vulkanism och plattektonik förstört många gamla nedslagskratrar.",
          "Månen saknar jordens aktiva vädersystem och har inte samma plattektonik. Därför finns många uråldriga kratrar kvar.",
          "Månstenar som samlades in under Apolloprogrammet hjälper forskarna att undersöka när olika nedslag inträffade.",
        ],
      },
      {
        id: "hypotes",
        heading: "Det sena tunga bombardemanget",
        paragraphs: [
          "En hypotes har varit att solsystemet genomgick en särskilt intensiv period av nedslag för omkring 3,9 miljarder år sedan.",
          "Den kallas ofta det sena tunga bombardemanget.",
          "Men forskningen har visat att historien kan vara mer komplicerad. Det är omdiskuterat om det verkligen fanns en kort och kraftig topp eller om nedslagen minskade mer gradvis över tid.",
        ],
      },
      {
        id: "hav",
        heading: "Vad hände med jordens hav?",
        paragraphs: [
          "Mycket stora nedslag kunde frigöra tillräckligt mycket värme för att påverka atmosfären och vatten på jordens yta.",
          "Samtidigt kan mindre himlakroppar ha tillfört vatten och andra kemiska ämnen.",
          "Hur nedslagen påverkade de tidigaste möjliga livsmiljöerna är en viktig fråga för forskare som studerar livets uppkomst.",
        ],
      },
      {
        id: "forskning",
        heading: "Hur undersöker forskarna nedslagen?",
        paragraphs: [
          "Forskare daterar månstenar, kartlägger kratrar och jämför olika himlakroppars ytor.",
          "De använder också datorsimuleringar för att undersöka hur planeternas gravitation påverkade asteroidernas banor.",
          "Nya prover från månen och andra delar av solsystemet kan hjälpa till att avgöra vilka teorier som stämmer bäst.",
        ],
      },
    ],
    facts: [
      "Månen har bevarat många gamla nedslagskratrar.",
      "Stora asteroidnedslag kan smälta berggrund.",
      "Det sena tunga bombardemanget är en omdiskuterad hypotes.",
      "Månstenar hjälper oss att undersöka solsystemets tidiga historia.",
    ],
    evidence: [
      "Radiometrisk datering av månstenar.",
      "Kartläggning av kratrar på månen.",
      "Datorsimuleringar av planeternas och asteroidernas banor.",
      "Geologiska spår efter nedslag.",
    ],
    uncertainties: [
      "Om en särskilt intensiv nedslagsperiod verkligen inträffade.",
      "Hur många stora nedslag den unga jorden utsattes för.",
      "Hur nedslagen påverkade tidiga hav och möjliga livsmiljöer.",
    ],
    relatedIds: ["moon", "earth", "first-rocks"],
    sources: [
      {
        label: "NASA Science – Moon Facts",
        url: "https://science.nasa.gov/moon/facts/",
      },
      {
        label: "NASA Science – Asteroids",
        url: "https://science.nasa.gov/solar-system/asteroids/",
      },
    ],
  },
};
