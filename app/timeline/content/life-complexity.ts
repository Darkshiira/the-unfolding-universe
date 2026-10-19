import type { MilestoneArticleData } from "./types";

const credit = "Konstnärlig rekonstruktion för The Unfolding Universe";

export const lifeComplexityArticles: Record<string, MilestoneArticleData> = {
  eukaryotes: {
    id: "eukaryotes",
    kicker: "PROTEROZOIKUM · CELLER MED EN NY INRE VÄRLD",
    lead: "Under livets långa historia utvecklades celler med en ny sorts organisation. Ett cellkärneliknande rum för arvsmassan, inre membran och avancerade samarbeten mellan mikroorganismer lade grunden för alla dagens djur, växter och svampar.",
    hero: {
      src: "/images/timeline/life-complexity/eukaryotes-hero.png",
      alt: "Konstnärlig vetenskaplig närbild av en tidig eukaryot cell i vatten, med cellmembran, cellkärna och inre strukturer synliga.",
      caption: "De första eukaryoterna var mikroskopiska. Bilden är en tolkning, eftersom deras exakta utseende inte är känt.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "en-annan-cell",
        heading: "En cell med rum inuti",
        paragraphs: [
          "Under miljarder år bestod livet av mikroorganismer utan cellkärna. Bakterier och arkéer är fortfarande oerhört framgångsrika och varierade livsformer. Men någon gång utvecklades också eukaryoter: celler där arvsmassan i regel är innesluten i en cellkärna.",
          "Eukaryota celler har dessutom ett inre membransystem som delar upp olika uppgifter. Sådana avgränsade miljöer gör det möjligt att samordna många kemiska processer inom samma cell.",
          "De första eukaryoterna var inte små versioner av dagens djur eller växter. De var encelliga organismer vars tidiga utveckling bara kan rekonstrueras bit för bit.",
        ],
        image: {
          src: "/images/timeline/life-complexity/cell-types-comparison.png",
          alt: "Pedagogiskt jämförelsediagram med bakterie, arké och eukaryot cell, där DNA, cellmembran, cellkärna och organeller är markerade.",
          caption: "Bakterier och arkéer saknar cellkärna. Eukaryoter har en cellkärna och flera typer av membranavgränsade strukturer; bilden visar förenklade exempel.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "tre-grenar",
        heading: "Bakterier, arkéer och eukaryoter",
        paragraphs: [
          "Alla kända organismer tillhör någon av tre stora grupper i en vanlig översikt av livets släktskap: bakterier, arkéer och eukaryoter. Men grupperna är inte tre helt fristående uppfinningar. Genetiska analyser visar att eukaryoternas historia är nära förbunden med arkéer.",
          "Eukaryota celler bär dessutom spår av en gammal symbios med en bakterie, som blev ursprunget till mitokondrierna. Därför är deras evolutionära historia snarare ett möte mellan olika släktlinjer än en enkel förgrening.",
          "Hur detta samarbete började, och i vilken ordning cellens olika egenskaper utvecklades, är fortfarande aktiva forskningsfrågor.",
        ],
      },
      {
        id: "organeller",
        heading: "Små avdelningar med stora uppgifter",
        paragraphs: [
          "Cellkärnan omsluter större delen av arvsmassan. Andra delar av cellen hjälper till att tillverka, bearbeta och transportera molekyler. Ett nätverk av proteintrådar, cellskelettet, bidrar till cellens form, rörelse och organisation.",
          "Mitokondrier är viktiga för energiomsättningen hos de flesta eukaryoter. Vissa eukaryoter har dessutom kloroplaster, som utvecklades senare genom en annan endosymbios och möjliggör fotosyntes hos bland annat alger och växter.",
          "Alla eukaryota celler ser inte likadana ut. Deras inre strukturer varierar med släktskap, livsmiljö och sätt att leva.",
        ],
        image: {
          src: "/images/timeline/life-complexity/eukaryotic-cell-anatomy.png",
          alt: "Pedagogiskt tvärsnitt av en generell eukaryot cell med cellkärna, cellmembran, mitokondrier, endoplasmatiskt nätverk, golgiapparat och cellskelett.",
          caption: "En förenklad modell av en eukaryot cell. Olika eukaryoter har olika organeller och cellstrukturer.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "spar",
        heading: "Hur gamla är cellerna med cellkärna?",
        paragraphs: [
          "Fossil som tolkas som eukaryoter finns i bergarter som är minst omkring 1,6 miljarder år gamla. Vissa äldre fynd och kemiska spår har också diskuterats, men de är inte alltid entydiga.",
          "Forskare kombinerar fossilers former med geokemi och jämförelser av arvsmassa hos nu levande organismer. Molekylära släktträd kan ge ledtrådar till när grupper skildes åt, men resultaten beror på antaganden och dateringsmetoder.",
          "Det finns därför inget enda årtal som säkert markerar när den första eukaryota cellen uppstod.",
        ],
      },
      {
        id: "framtiden",
        heading: "Grunden för en ny mångfald",
        paragraphs: [
          "Eukaryoterna öppnade nya evolutionära möjligheter. Många fortsatte att leva som encelliga organismer, medan andra med tiden utvecklade stora kroppar och specialiserade celltyper.",
          "Det betyder inte att bakterier och arkéer är primitiva eller oförändrade. De fortsatte att utvecklas och är fortfarande avgörande för planetens ekosystem.",
          "Nästa kapitel tar oss närmare en av de viktigaste händelserna bakom eukaryoternas uppkomst: det gamla samarbetet som gav oss mitokondrier.",
        ],
      },
    ],
    facts: [
      "Eukaryoter omfattar bland annat djur, växter, svampar och många encelliga organismer.",
      "Bakterier och arkéer saknar cellkärna, men kan ändå ha avancerad cellorganisation.",
      "Eukaryoternas ursprung är nära kopplat till både arkéer och bakterier.",
      "De tidigaste eukaryoterna var encelliga.",
    ],
    evidence: [
      "Mikrofossil med drag som kan knytas till eukaryoter.",
      "Jämförelser av gener och proteiner hos nu levande organismer.",
      "Studier av cellkärnans, membransystemens och mitokondriernas uppbyggnad.",
      "Geologisk datering av fossilförande sediment.",
    ],
    uncertainties: [
      "Exakt när de första eukaryoterna utvecklades.",
      "I vilken ordning cellkärna, mitokondrier och andra cellstrukturer uppstod.",
      "Hur de tidigaste eukaryoterna levde och såg ut.",
    ],
    relatedIds: ["mitochondria", "multicellular", "oxygen", "microbes"],
    sources: [
      { label: "Encyclopaedia Britannica – Eukaryote", url: "https://www.britannica.com/science/eukaryote" },
      { label: "Nature – Eukaryote evolution research", url: "https://www.nature.com/subjects/eukaryote-evolution" },
    ],
  },

  mitochondria: {
    id: "mitochondria",
    kicker: "PROTEROZOIKUM · ETT SAMARBETE INUTI CELLEN",
    lead: "En gång i livets tidiga historia uppstod en nära relation mellan två mikroorganismer. Den ena blev så småningom en del av den andra. Spåren av denna gamla symbios finns kvar i mitokondrierna i våra celler.",
    hero: {
      src: "/images/timeline/life-complexity/mitochondria-hero.png",
      alt: "Konstnärlig mikroskopisk rekonstruktion av en tidig värdcell och en bakterie som inleder en långvarig symbios.",
      caption: "Mitokondrierna har sitt ursprung i en bakterie som blev en bestående del av en annan cells evolutionära historia.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "motet",
        heading: "Ett möte som förändrade livet",
        paragraphs: [
          "De flesta eukaryota celler har mitokondrier, små strukturer som spelar en central roll i cellens energiomsättning. Deras ursprung är ovanligt: de härstammar från bakterier.",
          "Enligt den väl underbyggda endosymbiosteorin inledde en bakterie från den grupp som är besläktad med dagens alfaproteobakterier ett långvarigt samarbete med en värdcell. Med tiden blev bakterien en integrerad del av värdens cellorganisation.",
          "Vi vet inte exakt hur de första stegen såg ut. Det kan ha handlat om olika former av nära samlevnad och ämnesutbyte, inte nödvändigtvis en enkel händelse där en färdig cell svalde en annan.",
        ],
        image: {
          src: "/images/timeline/life-complexity/endosymbiosis-steps.png",
          alt: "Stegvis pedagogisk modell över hur en bakteriell symbiont kan ha blivit mitokondrie i en tidig eukaryot cell.",
          caption: "Endosymbiosen är väl belagd, men diagrammets steg är en förenklad modell. Den exakta ordningen är omdiskuterad.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "varfor",
        heading: "Vad kunde cellerna vinna på samarbetet?",
        paragraphs: [
          "I ett nära samarbete kan två organismer utnyttja varandras kemiska förmågor. Bakterien som gav upphov till mitokondrien bidrog med ämnesomsättning som så småningom blev en viktig del av värdcellens energisystem.",
          "Hos många nutida eukaryoter använder mitokondrier syre för att frigöra energi ur näringsämnen och bilda ATP, en molekyl som cellen använder i många processer.",
          "Men de tidiga miljöerna och de ursprungliga fördelarna med symbiosen är inte helt klarlagda. Vissa nutida eukaryoter har också mitokondrier som är starkt omvandlade och fungerar i syrefattiga miljöer.",
        ],
      },
      {
        id: "eget-dna",
        heading: "En organell med ett bakteriellt förflutet",
        paragraphs: [
          "Mitokondrier har vanligtvis ett eget litet genom. De har också membran och molekylära maskiner med tydliga likheter med bakteriers.",
          "Under evolutionen förlorade den ursprungliga symbionten många gener. En del gener överfördes till värdcellens arvsmassa, och många av de proteiner som mitokondrier behöver tillverkas numera utanför organellen och transporteras in.",
          "Detta gör mitokondrien till ett särskilt tydligt exempel på hur två tidigare självständiga evolutionära linjer kan bli beroende av varandra.",
        ],
        image: {
          src: "/images/timeline/life-complexity/mitochondria-evidence.png",
          alt: "Pedagogiskt diagram som jämför en bakterie med en mitokondrie och visar dubbla membran, eget DNA och genöverföring till cellkärnan.",
          caption: "Mitokondriernas DNA, membran och släktskap med bakterier är starka belägg för deras endosymbiotiska ursprung.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "tidpunkt",
        heading: "När uppstod mitokondrierna?",
        paragraphs: [
          "Mitokondriernas ursprung hör till de tidigaste stegen i eukaryoternas evolution. Det är därför missvisande att tänka sig att fullt moderna eukaryota celler först uppstod och långt senare fick mitokondrier.",
          "Forskarna är inte överens om exakt när symbiosen började eller vilka cellstrukturer värden redan hade utvecklat. Fossil ger få direkta ledtrådar till en händelse som ägde rum på mikroskopisk nivå.",
          "Tidslinjens placering är därför en ungefärlig visningspunkt, inte en säker datering av den första mitokondrien.",
        ],
      },
      {
        id: "arvet",
        heading: "Ett samarbete som lever vidare",
        paragraphs: [
          "Mitokondrier finns i olika former hos nästan alla undersökta eukaryota släktlinjer. Även organismer som länge ansågs sakna dem har ofta specialiserade mitokondrierelaterade organeller.",
          "Samarbetet har förändrats under enorma tidsrymder, men det bakteriella ursprunget är fortfarande synligt i cellernas biologi.",
          "Det är ett av evolutionens mest slående exempel på att ny komplexitet inte bara uppstår genom konkurrens, utan också genom varaktiga partnerskap.",
        ],
      },
    ],
    facts: [
      "Mitokondrier har utvecklats från en bakteriell endosymbiont.",
      "Mitokondrier har vanligtvis eget DNA.",
      "Många gener som behövs i mitokondrier finns numera i cellkärnan.",
      "Vissa eukaryoter har kraftigt omvandlade mitokondrier för syrefattiga miljöer.",
    ],
    evidence: [
      "Släktskap mellan mitokondriella gener och bakteriegener.",
      "Mitokondriernas membran, ribosomer och genetiska system.",
      "Genöverföring från den gamla symbionten till värdcellens genom.",
      "Mitokondrierelaterade organeller hos olika eukaryoter.",
    ],
    uncertainties: [
      "Den exakta tidpunkten för endosymbiosen.",
      "Hur den ursprungliga värdcellen såg ut.",
      "Vilken ämnesomsättning som först gjorde samarbetet fördelaktigt.",
    ],
    relatedIds: ["eukaryotes", "oxygen", "multicellular"],
    sources: [
      { label: "Encyclopaedia Britannica – Mitochondrion", url: "https://www.britannica.com/science/mitochondrion" },
      { label: "Nature – Endosymbiosis research", url: "https://www.nature.com/subjects/endosymbiosis" },
    ],
  },

  multicellular: {
    id: "multicellular",
    kicker: "PROTEROZOIKUM · NÄR CELLER BÖRJADE SAMARBETA",
    lead: "En enda cell kan leva ett helt liv på egen hand. Men under evolutionen uppstod också organismer där många celler höll samman, delade upp arbetet och blev delar av en större helhet. Det hände mer än en gång.",
    hero: {
      src: "/images/timeline/life-complexity/multicellular-hero.png",
      alt: "Konstnärlig rekonstruktion av tidiga flercelliga algliknande organismer som svävar och växer i ett förhistoriskt hav.",
      caption: "Flercellighet utvecklades i flera släktlinjer. De tidigaste flercelliga organismerna såg inte nödvändigtvis ut som dagens växter eller djur.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "flera-celler",
        heading: "När en cell inte längre var ensam",
        paragraphs: [
          "Många mikroorganismer lever i kolonier eller täta samhällen. Men flercellighet innebär mer än att flera celler råkar finnas nära varandra: cellerna kan vara varaktigt förenade, kommunicera och ibland utveckla olika uppgifter.",
          "I vissa släktlinjer började celler stanna tillsammans efter delning. I andra sammanhang kunde separata celler samlas till gemensamma strukturer. Evolutionen har prövat flera vägar till samarbete.",
          "Det finns ingen enda tidpunkt då allt liv plötsligt blev flercelligt. Enkla och komplexa former av flercellighet utvecklades vid olika tillfällen.",
        ],
      },
      {
        id: "arbetsfordelning",
        heading: "När cellerna fick olika uppgifter",
        paragraphs: [
          "I en flercellig organism kan vissa celler bidra till rörelse eller näringsupptag medan andra främst sköter fortplantningen. Sådan arbetsfördelning kan göra hela organismen mer effektiv i sin miljö.",
          "För att samarbetet ska fungera måste celler kunna fästa vid varandra, skicka signaler och reglera vilka gener som används. Dessa förmågor utvecklades stegvis ur mekanismer som redan fanns hos encelliga förfäder.",
          "Flercellighet medför också nya problem. Celler behöver få resurser, samordna sin tillväxt och ibland avstå från att föröka sig för helhetens skull.",
        ],
        image: {
          src: "/images/timeline/life-complexity/from-one-to-many-cells.png",
          alt: "Pedagogiskt diagram som visar en ensam cell, en enkel koloni, sammanhängande celler och en organism med specialiserade celltyper.",
          caption: "Från ensam cell till samarbete och specialisering: en förenklad modell, inte en enda utvecklingskedja som alla organismer följt.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "flera-ganger",
        heading: "En uppfinning som evolutionen gjorde om",
        paragraphs: [
          "Flercellighet har uppstått oberoende i flera stora grupper, bland annat bland djur, växter, svampar och olika alger. Gruppernas lösningar liknar ibland varandra, men de har skilda evolutionära historier.",
          "Hos vissa organismer är cellerna nästan likvärdiga. Hos andra finns många specialiserade celltyper och vävnader som samverkar.",
          "Det är därför viktigt att skilja mellan enkel flercellighet och den mer komplexa organisation som exempelvis ett djur eller en landväxt har.",
        ],
      },
      {
        id: "fossil",
        heading: "Spår av tidiga flercelliga organismer",
        paragraphs: [
          "Fossil från proterozoikum visar att större och mer organiserade livsformer fanns långt före den kambriska perioden. Ett välkänt exempel är den rödalgliknande fossilen Bangiomorpha, som ger viktiga ledtrådar om tidiga eukaryota organismer.",
          "Att tolka mycket gamla fossil är svårt. En rad av celler eller ett förgrenat avtryck kan ge information om formen, men avslöjar inte automatiskt hur cellerna fungerade tillsammans.",
          "Forskare jämför fossilens struktur med levande organismer och daterar bergarterna för att förstå när olika former av flercellighet hade uppstått.",
        ],
        image: {
          src: "/images/timeline/life-complexity/early-multicellular-fossils.png",
          alt: "Pedagogisk jämförelse mellan en konstnärlig rekonstruktion av en tidig flercellig alg och ett fossilavtryck i bergart.",
          caption: "Fossil av tidiga eukaryoter hjälper forskare att studera flercellighet, men deras biologiska detaljer är inte alltid möjliga att avgöra.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "nya-mojligheter",
        heading: "Grunden för större kroppar",
        paragraphs: [
          "När celler kunde samarbeta på nya sätt öppnades möjligheter för större kroppar, nya former av rörelse och specialiserade strukturer.",
          "Det betyder inte att flercellighet alltid är en fördel. Encelliga organismer är fortfarande bland jordens mest framgångsrika livsformer och dominerar många viktiga kretslopp.",
          "Flercelligheten blev ändå en avgörande förutsättning för de stora variationer av växter, svampar och djur som utvecklades långt senare.",
        ],
      },
    ],
    showcase: {
      src: "/images/timeline/showcases/bangiomorpha-fossil-v2.png",
      title: "Bangiomorpha – spår av tidigt flercelligt liv",
      description: "Bangiomorpha är ett fossil som brukar tolkas som en tidig rödalgsbesläktad eukaryot. Dess bevarade struktur ger ledtrådar om flercelligt liv under proterozoikum. Konstnärlig illustration av ett fossilförande bergartsprov, inte ett autentiskt exemplar.",
      alt: "Konstnärlig museiillustration av en mörk sedimentär stenplatta med tunna förgrenade fossiltrådar, placerad på en rund, polerad träplattform.",
    },
    facts: [
      "Flercellighet har utvecklats flera gånger oberoende av varandra.",
      "Enkla kolonier och komplexa flercelliga organismer är inte samma sak.",
      "Bangiomorpha är ett viktigt fossil i studier av tidiga eukaryoter.",
      "Encelligt liv fortsatte att frodas även efter flercellighetens uppkomst.",
    ],
    evidence: [
      "Fossil av flercelliga eller kolonibildande organismer från proterozoikum.",
      "Cellstrukturer och utvecklingsmekanismer hos levande alger, svampar och djur.",
      "Genetiska jämförelser som visar oberoende ursprung för flercellighet.",
      "Dateringar av sedimentära bergarter med mikrofossil.",
    ],
    uncertainties: [
      "När de olika formerna av flercellighet först uppstod.",
      "Hur mycket specialisering de allra tidigaste flercelliga organismerna hade.",
      "Hur vissa mycket gamla fossil ska placeras i livets släktträd.",
    ],
    relatedIds: ["eukaryotes", "sexual-reproduction", "ediacaran", "algae"],
    sources: [
      { label: "Encyclopaedia Britannica – Multicellular organism", url: "https://www.britannica.com/science/multicellular-organism" },
      { label: "Nature – Multicellularity research", url: "https://www.nature.com/subjects/multicellularity" },
    ],
  },

  "sexual-reproduction": {
    id: "sexual-reproduction",
    kicker: "PROTEROZOIKUM · NÄR ARVSMASSAN BÖRJADE BLANDAS",
    lead: "Evolutionen handlar inte bara om nya organismer, utan också om nya sätt att föra livet vidare. Hos eukaryoter utvecklades processer som blandar genetisk information mellan generationer och skapar nya kombinationer av ärftliga egenskaper.",
    hero: {
      src: "/images/timeline/life-complexity/sexual-reproduction-hero.png",
      alt: "Konstnärlig mikroskopisk visualisering av två encelliga eukaryoter och lysande kromosomliknande strukturer som symboliserar genetisk rekombination.",
      caption: "Sexuell fortplantning utvecklades långt före djur och blommor. Bilden är symbolisk och visar inte en bestämd fossil organism.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "genetisk-blandning",
        heading: "När gener kunde kombineras på nya sätt",
        paragraphs: [
          "Vid vanlig celldelning kan en organism bilda genetiskt mycket lika dotterceller. Men evolutionen utvecklade också sätt att blanda och omfördela arvsanlag.",
          "Sexuell fortplantning hos eukaryoter innefattar i regel en växling mellan sammanslagning av celler eller cellkärnor och en särskild celldelning som kallas meios.",
          "Det betyder inte att all genetisk variation kommer från sex. Mutationer och genetiskt utbyte mellan mikroorganismer har också stor betydelse, men eukaryoternas sexuella processer skapar särskilda möjligheter att kombinera gener.",
        ],
      },
      {
        id: "meios",
        heading: "Meios – när kromosomerna blandas",
        paragraphs: [
          "Under meiosen parar sig motsvarande kromosomer och kan byta DNA-avsnitt genom överkorsning. Därefter fördelas kromosomerna så att de bildade cellerna får en reducerad uppsättning.",
          "När två könsceller eller andra kompatibla celler senare förenas kan en ny kombination av arvsanlag uppstå. Exakt hur livscykeln ser ut varierar kraftigt mellan olika eukaryoter.",
          "Meiosens ursprung är en stor evolutionär fråga. Dess molekylära maskineri har kopplingar till äldre system för DNA-reparation och rekombination.",
        ],
        image: {
          src: "/images/timeline/life-complexity/meiosis-recombination.png",
          alt: "Pedagogiskt diagram som visar kromosompar, överkorsning, meios och bildning av celler med olika genetiska kombinationer.",
          caption: "Meios och rekombination kan skapa nya kombinationer av arvsanlag. Diagrammet är en förenklad modell av en eukaryot livscykel.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "varfor-sex",
        heading: "Varför utvecklades sexuell fortplantning?",
        paragraphs: [
          "Genetisk omblandning kan hjälpa populationer att förena gynnsamma varianter och förändras när miljön skiftar. Den kan också bidra till att skadliga mutationer inte alltid följer samma kombinationer genom generationerna.",
          "Men sexuell fortplantning har kostnader. Det kan krävas tid och energi för att hitta en partner, och en organism för vidare bara en del av sina gener till varje avkomma.",
          "Därför finns flera vetenskapliga förklaringar till varför sexuell fortplantning uppstod och varför den har blivit så vanlig. Ingen enkel förklaring passar alla organismer.",
        ],
      },
      {
        id: "tidigt",
        heading: "En mycket gammal innovation",
        paragraphs: [
          "Sexuella processer finns hos vitt skilda eukaryoter, vilket tyder på att viktiga delar av systemet har mycket gamla rötter.",
          "Fossil kan sällan visa själva fortplantningen. Ett känt undantag som diskuteras är Bangiomorpha, där vissa forskare tolkat utvecklingsstadier som möjliga tecken på sexuell fortplantning.",
          "Vi kan inte ange ett säkert datum för när den första meiosen eller den första sexuella livscykeln uppstod. Tidslinjens datering är en ungefärlig orientering.",
        ],
        image: {
          src: "/images/timeline/life-complexity/variation-inheritance.png",
          alt: "Pedagogiskt diagram som jämför genetiskt lika avkomma vid klonal förökning med nya kombinationer av alleler vid sexuell fortplantning.",
          caption: "Sexuell fortplantning kan skapa nya kombinationer av befintliga genvarianter. Mutationer är fortfarande den yttersta källan till nya varianter.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "framtida-liv",
        heading: "En grund för livets fortsatta variation",
        paragraphs: [
          "Sexuell fortplantning kom att spela stor roll i många av de grupper som senare utvecklade stora kroppar och komplexa livscykler.",
          "Men naturen följer ingen enda modell. Många organismer kan växla mellan sexuell och asexuell förökning, och andra förökar sig huvudsakligen utan sex.",
          "Tillsammans med mutationer, naturligt urval och andra evolutionära processer bidrar genetisk omblandning till den variation som präglar livet än i dag.",
        ],
      },
    ],
    facts: [
      "Meios kan skapa nya kombinationer av genetiskt material.",
      "Sexuella processer utvecklades långt före de första människorna, djuren och blommorna.",
      "Mutationer skapar nya genvarianter; rekombination blandar redan existerande varianter.",
      "Många eukaryoter kan föröka sig både sexuellt och asexuellt.",
    ],
    evidence: [
      "Likheter mellan meiosens gener hos vitt skilda eukaryoter.",
      "Studier av rekombination och fortplantning hos nutida encelliga organismer.",
      "Möjliga fossilspår av tidiga eukaryota livscykler.",
      "Evolutionära modeller av genetisk variation och fortplantning.",
    ],
    uncertainties: [
      "När meios och sexuell fortplantning först utvecklades.",
      "Vilka evolutionära fördelar som var viktigast från början.",
      "Hur tidiga eukaryoters fortplantningscykler såg ut.",
    ],
    relatedIds: ["eukaryotes", "multicellular", "ediacaran"],
    sources: [
      { label: "Encyclopaedia Britannica – Meiosis", url: "https://www.britannica.com/science/meiosis" },
      { label: "Nature – Meiosis research", url: "https://www.nature.com/subjects/meiosis" },
    ],
  },
};
