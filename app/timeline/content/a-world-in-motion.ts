import type { MilestoneArticleData } from "./types";

const credit =
  "AI-genererad konstnärlig illustration för The Unfolding Universe";
const diagramCredit =
  "AI-genererad pedagogisk illustration för The Unfolding Universe";

/** Pangea, den perm–triassiska massutrotningen och superkontinentens uppsprickning. */
export const worldInMotionArticles: Record<string, MilestoneArticleData> = {
  pangaea: {
    id: "pangaea",
    kicker: "KARBON–PERM · EN VÄRLD FÖRE VÅR",
    lead: "Tänk dig en jord där nästan alla stora landmassor sitter ihop. För omkring 300 miljoner år sedan växte superkontinenten Pangea fram. Bergskedjor reste sig där kontinenter möttes, medan enorma områden långt från havet fick ett klimat som skilde sig från dagens.",

    hero: {
      src: "/images/timeline/world-in-motion/pangaea-hero.webp",
      alt: "Konstnärlig vy från hög höjd över en enorm uråldrig landmassa med bergskedjor, torra slätter, floder och omgivande hav.",
      caption:
        "För omkring 300 miljoner år sedan hade stora delar av jordens kontinenter förenats till superkontinenten Pangea. Bilden är en konstnärlig rekonstruktion, inte en exakt geografisk karta.",
      credit:
        "AI-genererad konstnärlig rekonstruktion för The Unfolding Universe",
      kind: "illustration",
    },

    sections: [
      {
        id: "en-sammanhangande-varld",
        heading: "När nästan alla kontinenter möttes",
        paragraphs: [
          "Pangea var en superkontinent som omfattade merparten av jordens stora landmassor. Den växte fram stegvis under sen karbon och perm, genom rörelser som pågick under många miljoner år.",
          "I norr låg det område som brukar kallas Laurasien, medan Gondwana utgjorde en stor sydlig del. Dessa namn beskriver stora landmassor som ingick i den växande helheten, men gränser och tidpunkter varierar mellan rekonstruktioner.",
          "Pangea var inte den första superkontinenten. Jorden hade tidigare haft andra stora kontinentala samlingar, bland annat Rodinia, och kontinenterna skulle fortsätta att förändras långt efter Pangeas tid.",
        ],
      },
      {
        id: "bergskedjorna",
        heading: "Kollisioner byggde väldiga bergskedjor",
        paragraphs: [
          "När kontinentalplattor pressas mot varandra kan berggrunden veckas, förtjockas och lyftas upp. Under Pangeas sammanslagning bildades omfattande bergskedjor längs flera gamla kollisionszoner.",
          "Appalacherna i Nordamerika och bergsområden på andra sidan Atlanten bär fortfarande spår av sådana händelser. I dag ligger resterna långt ifrån varandra, men bergarternas ålder och uppbyggnad visar på gamla samband.",
          "De mäktiga bergen såg inte ut som de gör i dag. Hundratals miljoner år av vittring och erosion har förändrat landskapet och blottlagt delar av den gamla berggrunden.",
        ],
      },
      {
        id: "pangeas-karta",
        heading: "Ett enda stort pussel av land och hav",
        paragraphs: [
          "Runt Pangea bredde det stora världshavet Panthalassa ut sig. Öster om superkontinentens delar låg Tethyshavets föregångare och senare havsområden som fick betydelse för jordens geografi.",
          "Forskare rekonstruerar Pangeas form genom att jämföra kontinenternas geologi, fossil, gamla bergskedjor och magnetiska signaler i bergarter. Kustlinjernas utseende är mindre tillförlitligt än kontinenternas underliggande berggrund.",
          "Kartor över Pangea är därför vetenskapliga modeller. De visar en möjlig geografisk situation vid en bestämd tidpunkt, inte en oföränderlig kontinent under hela dess existens.",
        ],
        image: {
          src: "/images/timeline/world-in-motion/pangaea-reconstruction.webp",
          alt: "Pedagogisk infografik om superkontinenten Pangea med en schematisk rekonstruktion, dagens kontinenter, fossilfynd, bergskedjor och en tidslinje över kontinenternas rörelser.",
          caption:
            "Pangea bildades när äldre kontinenter förenades. Forskare rekonstruerar superkontinenten genom att jämföra fossil, bergarter, bergskedjor och paleomagnetiska data. Bildens kartor är schematiska och visar inte exakta kontinentgränser.",
          credit:
            "AI-genererad pedagogisk illustration för The Unfolding Universe",
          kind: "diagram",
        },
      },
      {
        id: "klimatet",
        heading: "Ett annorlunda klimat på en jättelik kontinent",
        paragraphs: [
          "När land sträcker sig långt från kusterna får stora områden mindre direkt påverkan av havens temperaturutjämnande effekt. Delar av Pangeas inland var torra och kunde uppleva kraftiga årstidsvariationer.",
          "Samtidigt var inte hela superkontinenten öken. Klimatet skiftade mellan olika breddgrader och under olika perioder. Det fanns både fuktigare regioner och torra landskap.",
          "Pangeas storlek och läge påverkade också havsströmmar, vindmönster och fördelningen av livsmiljöer. Klimatet förändrades medan kontinenterna fortsatte att röra sig.",
        ],
      },
      {
        id: "spar-idag",
        heading: "Hur vet vi att Pangea verkligen fanns?",
        paragraphs: [
          "Liknande fossil har hittats på kontinenter som i dag skiljs åt av stora hav. När dessa områden förs samman i en rekonstruktion blir flera av fossilens utbredningsmönster lättare att förstå.",
          "Geologer kan också följa gamla bergskedjor och bergarter med motsvarande åldrar över dagens kontinentsgränser. Paleomagnetism ger ytterligare ledtrådar om var kontinenter låg i förhållande till jordens dåtida magnetfält.",
          "Bevisen kommer alltså inte från en enda karta eller ett enda fynd. De bygger på flera oberoende metoder som tillsammans visar att landmassorna en gång satt ihop.",
        ],
      },
    ],
    facts: [
      "Pangea började samlas under sen karbon och var i huvudsak sammanfogad under perm.",
      "Panthalassa var det enorma hav som omgav stora delar av Pangea.",
      "Appalacherna bevarar spår av kontinentkollisioner från Pangeas uppbyggnad.",
      "Pangea var inte den första superkontinenten i jordens historia.",
    ],
    evidence: [
      "Geologiska samband mellan bergskedjor på olika nutida kontinenter.",
      "Fossil som förekommer i berglager på numera åtskilda landmassor.",
      "Paleomagnetiska data och radiometriska dateringar.",
      "Rekonstruktioner av kontinentplattornas rörelser och gamla havsbassänger.",
    ],
    uncertainties: [
      "Exakt hur snabbt olika delar av Pangea sammanfogades.",
      "Detaljerna i kustlinjer och mindre kontinentalblocks placering vid olika tidpunkter.",
      "Hur regionala klimatförhållanden varierade över superkontinenten.",
    ],
    relatedIds: ["gondwana", "permian-extinction-earth", "pangaea-breakup"],
    sources: [
      {
        label: "USGS – This Dynamic Earth: The Story of Plate Tectonics",
        url: "https://pubs.usgs.gov/gip/dynamic/dynamic.html",
      },
      {
        label: "Encyclopaedia Britannica – Pangea",
        url: "https://www.britannica.com/place/Pangea",
      },
    ],
  },

  "permian-extinction-earth": {
    id: "permian-extinction-earth",
    kicker: "PERM–TRIAS · LIVETS STÖRSTA KRIS",
    lead: "För omkring 252 miljoner år sedan genomgick jorden den största kända massutrotningen i sin historia. Enorma vulkanutbrott, stigande temperaturer och förändrade havsmiljöer sammanföll med att en mycket stor del av arterna försvann. Hur kunde så många ekosystem bryta samman?",
    hero: {
      src: "/images/timeline/world-in-motion/permian-extinction-hero.webp",
      alt: "Dramatisk konstnärlig rekonstruktion av enorma vulkanutbrott med glödande lavaflöden, askmoln och en mörk himmel.",
      caption:
        "För omkring 252 miljoner år sedan sammanföll enorm vulkanisk aktivitet i det som idag är Sibirien med jordens största kända massutrotning. Bilden är en dramatisk konstnärlig tolkning, inte en exakt rekonstruktion.",
      credit:
        "AI-genererad konstnärlig rekonstruktion för The Unfolding Universe",
      kind: "illustration",
    },
    atmosphere: {
      mode: "embers",
      intensity: "dramatic",
    },
    showcase: {
      src: "/images/timeline/showcases/siberian-basalt.webp",
      title: "Basalt – spår av enorm vulkanism",
      description:
        "Basalt är en vulkanisk bergart som bildas när lava stelnar. Enorma basaltutbrott i det som idag är Sibirien sammanföll med den största kända massutrotningen för omkring 252 miljoner år sedan. Konstnärlig illustration, inte ett autentiskt prov från Sibirien.",
      alt: "Mörkgrå, nästan svart vulkanisk basalt med skrovlig yta, små håligheter och rostbruna mineraltoner, placerad på en rund polerad träplattform.",
    },
    sections: [
      {
        id: "krisen",
        heading: "När livets mångfald rasade",
        paragraphs: [
          "Vid gränsen mellan perm och trias, för ungefär 252 miljoner år sedan, försvann en mycket stor andel av jordens marina arter. Även ekosystem på land drabbades hårt.",
          "Massutrotningen kallas ibland 'det stora utdöendet'. Den var allvarligare än den händelse som långt senare innebar slutet för de icke-flygande dinosaurierna.",
          "Förändringarna skedde inte nödvändigtvis samtidigt överallt. Genom fossil och daterade berglager försöker forskare förstå hur snabbt krisen utvecklades och vilka miljöer som drabbades först.",
        ],
      },
      {
        id: "sibiriska-trapporna",
        heading: "Vulkanism i en enorm skala",
        paragraphs: [
          "I det som i dag är Sibirien inträffade mycket omfattande vulkanism. Stora mängder magma trängde fram och bildade lavaflöden och magmatiska gångar över ett vidsträckt område.",
          "När magma värmde upp sediment och andra bergarter kunde ytterligare gaser frigöras. Tillsammans med vulkanernas egna utsläpp kan detta ha förändrat atmosfärens sammansättning kraftigt.",
          "Forskare ser ett starkt samband mellan den sibiriska vulkanismen och massutrotningen, men undersöker fortfarande hur olika utsläpp och återkopplingar bidrog till krisens förlopp.",
        ],
      },
      {
        id: "varmare-hav",
        heading: "När haven blev varmare och syrefattigare",
        paragraphs: [
          "Ökade halter av växthusgaser kan ha drivit en kraftig global uppvärmning. Varmare havsvatten kan hålla mindre löst syre, samtidigt som förändrad cirkulation påverkar hur syre transporteras till djupare vatten.",
          "Syrefattiga miljöer gjorde livet svårt för många marina organismer. Förändringar i havens kemi, däribland försurning, kan också ha påverkat arter som byggde skal och skelett.",
          "Det var sannolikt flera samverkande påfrestningar snarare än en enda enkel orsak. Hur betydelsefull varje mekanism var varierade mellan olika havsområden och organismgrupper.",
        ],
        image: {
          src: "/images/timeline/world-in-motion/permian-ocean-crisis.webp",
          alt: "Pedagogisk infografik om perm–trias-utrotningen, med sibirisk vulkanism, växthusgaser, global uppvärmning, syrebrist i haven och omfattande förluster av arter.",
          caption:
            "Omfattande vulkanism vid de sibiriska trapporna sammanföll med perm–trias-utrotningen för omkring 252 miljoner år sedan. Uppvärmning, syrebrist och förändrad havskemi tros ha bidragit till den ekologiska krisen. Bilden är en förenklad modell.",
          credit:
            "AI-genererad pedagogisk illustration för The Unfolding Universe",
          kind: "diagram",
        },
      },
      {
        id: "pa-land",
        heading: "Även livet på land förändrades",
        paragraphs: [
          "På land drabbades växter och djur av förändrade temperaturer, nederbördsmönster och livsmiljöer. Fossil visar stora förändringar i vilka grupper som dominerade före och efter gränsen mellan perm och trias.",
          "Bränder, torka och kraftiga miljösvängningar kan ha bidragit till påfrestningarna i vissa områden. Men forskarna kan inte utgå från att samma förhållanden rådde över hela Pangea.",
          "Massutrotningen förändrade de ekologiska sammanhangen. De grupper som överlevde mötte en värld med många tomma livsmiljöer, men återhämtningen tog lång tid.",
        ],
      },
      {
        id: "aterhamtningen",
        heading: "En långsam väg tillbaka",
        paragraphs: [
          "Efter massutrotningen återhämtade sig ekosystemen stegvis under trias. Vissa grupper ökade snabbt i antal, medan komplexa och artrika samhällen på många håll tog betydligt längre tid att återbildas.",
          "De förändrade miljöerna skapade också förutsättningar för nya evolutionära förlopp. Senare under trias utvecklades bland annat de tidiga dinosaurierna, men det skedde inte omedelbart efter katastrofen.",
          "Genom att studera denna kris får forskare kunskap om hur klimat, havskemi och biologisk mångfald kan påverka varandra över geologiska tidsrymder.",
        ],
      },
    ],
    facts: [
      "Massutrotningen inträffade för ungefär 252 miljoner år sedan, vid gränsen mellan perm och trias.",
      "Den räknas som den största kända massutrotningen i jordens historia.",
      "Sibiriska trapporna är namnet på ett enormt vulkaniskt område från ungefär samma tid.",
      "Återhämtningen av många ekosystem tog miljontals år.",
    ],
    evidence: [
      "Fossilserier som visar stora förluster av arter vid perm–triasgränsen.",
      "Radiometriska dateringar av vulkaniska bergarter och sedimentära lager.",
      "Kol- och syreisotoper samt andra geokemiska indikatorer på miljöförändringar.",
      "Sedimentära tecken på syrebrist och förändringar i marina ekosystem.",
    ],
    uncertainties: [
      "Vilka utsläpp och återkopplingar som hade störst betydelse för utdöendet.",
      "Hur snabbt olika miljöförändringar spreds mellan land och hav.",
      "Varför vissa organismgrupper klarade krisen bättre än andra.",
    ],
    relatedIds: ["pangaea", "pangaea-breakup", "cretaceous-impact"],
    sources: [
      {
        label: "Encyclopaedia Britannica – Permian extinction",
        url: "https://www.britannica.com/science/Permian-extinction",
      },
      {
        label:
          "International Commission on Stratigraphy – Chronostratigraphic Chart",
        url: "https://stratigraphy.org/chart",
      },
      {
        label:
          "Burgess et al. (2014) – High-precision timeline for Earth's most severe extinction",
        url: "https://doi.org/10.1073/pnas.1317692111",
      },
    ],
  },

  "pangaea-breakup": {
    id: "pangaea-breakup",
    kicker: "TRIAS–JURA · KONTINENTERNA SKILJS ÅT",
    lead: "Pangea var inte för evigt. Under trias och jura började den väldiga superkontinenten spricka upp. Sprickzoner växte, magma trängde fram och nya havsbassänger började öppnas. Det var början på den långvariga process som formade Atlanten och vår moderna världskarta.",
    hero: {
      src: "/images/timeline/world-in-motion/pangaea-breakup-hero.webp",
      alt: "Konstnärlig vy över en superkontinent som spricker upp, med en lång sprickdal, vulkanism och ett begynnande hav.",
      caption:
        "Pangeas uppsprickning skedde stegvis under många miljoner år. Bilden visar en tänkbar sprickzon, inte en exakt historisk plats.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "sprickorna",
        heading: "Sprickor i en superkontinent",
        paragraphs: [
          "När jordens litosfär sträcks kan stora spricksystem utvecklas. Berggrunden sjunker på vissa platser och bildar långsträckta sänkor, så kallade riftdalar.",
          "Under slutet av trias och början av jura uppstod omfattande sprickzoner i delar av Pangea. Men uppsprickningen var ingen enda händelse: olika områden började separera vid olika tidpunkter.",
          "Alla sprickdalar blir inte hav. Vissa stannar av och bevaras som gamla förkastningssystem, medan andra fortsätter att öppnas när kontinentalplattorna glider isär.",
        ],
      },
      {
        id: "vulkanismen",
        heading: "När magma trängde genom sprickorna",
        paragraphs: [
          "När kontinentskorpan tänjs ut kan magma tränga upp längs sprickor och förkastningar. I samband med Pangeas tidiga uppsprickning förekom omfattande magmatisk aktivitet.",
          "Den centralatlantiska magmatiska provinsen, ofta förkortad CAMP, bildades kring gränsen mellan trias och jura för omkring 201 miljoner år sedan. Vulkanismen sammanföll med stora miljöförändringar och en massutrotning.",
          "Forskare undersöker hur magmatiska processer, utsläpp av gaser och plattektonisk sträckning hängde samman. En sprickzon och ett vulkanutbrott är inte samma sak, även om de kan vara kopplade.",
        ],
      },
      {
        id: "atlanten",
        heading: "Ett nytt hav börjar födas",
        paragraphs: [
          "När två kontinentalplattor fortsätter att röra sig isär kan ny oceanisk jordskorpa bildas mellan dem. Det sker när magma stiger upp vid en spridningsrygg och stelnar.",
          "Den centrala delen av Atlanten började öppnas under tidig jura. Andra delar av Atlanten bildades senare, vilket betyder att hela havet inte uppstod på en gång.",
          "När havsbottnen fortsätter att bildas ökar avståndet mellan kontinenterna. Det är en av anledningarna till att Afrika och Amerika i dag ligger på var sin sida av Atlanten.",
        ],
        image: {
          src: "/images/timeline/world-in-motion/pangaea-rifting.webp",
          alt: "Pedagogisk infografik som visar hur superkontinenten Pangea spricker upp genom kontinental sprickbildning, vulkanism och bildandet av ny oceanbotten.",
          caption:
            "Pangeas uppsprickning började för omkring 200 miljoner år sedan. När kontinentalplattor drogs isär bildades sprickzoner och så småningom nya havsbassänger. Illustrationen visar en förenklad modell av processen.",
          credit:
            "AI-genererad pedagogisk illustration för The Unfolding Universe",
          kind: "diagram",
        },
      },
      {
        id: "nya-miljoer",
        heading: "Nya kuster, hav och livsmiljöer",
        paragraphs: [
          "När kontinenterna gled isär förändrades kuster, havsströmmar och förbindelser mellan landmassor. Nya grunda hav och kustmiljöer kunde uppstå, medan andra områden förändrades eller försvann.",
          "De geografiska förändringarna påverkade hur organismer kunde sprida sig. Populationer som tidigare haft kontakt kunde skiljas åt, samtidigt som nya havsmiljöer skapade andra möjligheter för livet.",
          "Kontinenternas uppdelning förändrade också klimatets förutsättningar. Men effekterna berodde på många faktorer och såg inte likadana ut över hela planeten.",
        ],
      },
      {
        id: "bevisen",
        heading: "Havsbottnen avslöjar hur kontinenterna flyttat sig",
        paragraphs: [
          "På havsbottnen finns magnetiska mönster som bildas när ny basalt stelnar och registrerar jordens magnetfält. Dessa mönster kan användas för att rekonstruera hur havsbottnen spridits åt olika håll.",
          "Åldern på oceanisk skorpa, gamla sprickbassänger och motsvarande bergarter på skilda kontinenter ger ytterligare ledtrådar. Moderna satellitmätningar visar dessutom att kontinentalplattorna fortfarande rör sig.",
          "Tillsammans berättar dessa spår om hur en sammanhängande landmassa långsamt delades upp till de kontinenter och hav vi känner i dag.",
        ],
      },
    ],
    facts: [
      "Pangeas uppsprickning började i olika områden vid olika tidpunkter.",
      "Den centralatlantiska magmatiska provinsen bildades kring 201 miljoner år sedan.",
      "Den centrala Atlanten började öppnas under tidig jura; andra delar bildades senare.",
      "Magnetiska mönster på havsbottnen hjälper forskare att kartlägga plattektoniska rörelser.",
    ],
    evidence: [
      "Förkastningar och sediment i gamla sprickbassänger.",
      "Daterade magmatiska bergarter kopplade till tidig uppsprickning.",
      "Havsbottnens ålder och symmetriska magnetiska anomalier.",
      "Geologiska samband mellan kontinentmarginaler och nutida GPS-mätningar av plattrörelser.",
    ],
    uncertainties: [
      "Exakt hur de olika sprickzonerna påverkade varandra under uppsprickningen.",
      "Hur vulkanism och växthusgasutsläpp bidrog till miljökrisen vid trias–juragränsen.",
      "Tidpunkter och förlopp för separationen av vissa mindre kontinentalblock.",
    ],
    relatedIds: ["pangaea", "permian-extinction-earth", "cretaceous-impact"],
    sources: [
      {
        label: "USGS – This Dynamic Earth: The Story of Plate Tectonics",
        url: "https://pubs.usgs.gov/gip/dynamic/dynamic.html",
      },
      {
        label: "Encyclopaedia Britannica – Atlantic Ocean: Geology",
        url: "https://www.britannica.com/place/Atlantic-Ocean/Geology",
      },
      {
        label:
          "International Commission on Stratigraphy – Chronostratigraphic Chart",
        url: "https://stratigraphy.org/chart",
      },
    ],
  },
};
