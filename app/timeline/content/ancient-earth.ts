import type { MilestoneArticleData } from "./types";

const credit = "AI-genererad illustration för The Unfolding Universe";

export const ancientEarthArticles: Record<string, MilestoneArticleData> = {
  "first-rocks": {
    id: "first-rocks",
    kicker: "ARKEIKUM · SPÅR FRÅN DEN UNGA JORDEN",
    lead: "Hur kan en sten berätta vad som hände för nästan fyra miljarder år sedan? I några av världens äldsta bergarter finns spår av en jord som redan hade börjat bilda fast mark, trots att planeten fortfarande var ung och mycket annorlunda än i dag.",
    hero: {
      src: "/images/timeline/ancient-earth/first-rocks-hero.png",
      alt: "Konstnärlig närbild av uråldrig, veckad gnejs med mörka och ljusa mineralband.",
      caption:
        "Mycket gamla bergarter kan ha omvandlats flera gånger sedan de bildades. Konstnärlig rekonstruktion.",
      credit,
      kind: "illustration",
    },
    showcase: {
      src: "/images/timeline/showcases/acasta-gneiss.png",
      title: "Acastagnejsen",
      description:
        "En av jordens äldsta kända bergarter, omkring fyra miljarder år gammal. Dess veckade mineralband berättar om en lång historia av värme, tryck och geologiska förändringar. Konstnärlig rekonstruktion.",
      alt: "Illustrerad bit av bandad gnejs med ljusa och mörka mineralband, placerad på en rund träplattform.",
    },
    sections: [
      {
        id: "acasta",
        heading: "En bergart nästan lika gammal som jorden",
        paragraphs: [
          "I nordvästra Kanada finns Acastagnejsen, en av de äldsta kända bevarade bergarterna. Delar av den är omkring fyra miljarder år gamla.",
          "Gnejs är en bergart som har förändrats av höga temperaturer och tryck. Acastagnejsen har alltså inte legat orörd sedan den bildades – dess mineral bär spår av en lång och komplicerad historia.",
          "När forskare studerar dessa bergarter får de en ovanlig inblick i hur jordskorpan såg ut under planetens tidigaste utveckling.",
        ],

        image: {
          src: "/images/timeline/ancient-earth/first-rocks-gneiss.png",
          alt: "Vetenskaplig illustration av Acastagnejsen med ljusa och mörka mineralband, närbilder av mineral och en genomskärning som visar bergartens omvandling.",
          caption:
            "Acastagnejsen i nordvästra Kanada hör till jordens äldsta kända bergarter. Dess mineral och strukturer hjälper forskarna att undersöka en nästan fyra miljarder år gammal geologisk historia.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "bergarter-och-mineral",
        heading: "Vad är skillnaden mellan en bergart och ett mineral?",
        paragraphs: [
          "Ett mineral har en bestämd kemisk sammansättning och kristallstruktur. En bergart består vanligen av flera olika mineral.",
          "Det är därför viktigt att skilja mellan mycket gamla bergarter och enskilda uråldriga mineralkorn. Zirkoner från Jack Hills i Australien kan vara omkring 4,4 miljarder år gamla, även om bergarten de hittades i är betydligt yngre.",
          "De gamla zirkonerna och Acastagnejsen berättar olika delar av samma historia: mineral visar att jordskorpan började bildas tidigt, medan hela bergarter kan avslöja hur större områden utvecklades.",
        ],
      },
      {
        id: "datering",
        heading: "Hur kan forskare åldersbestämma en sten?",
        paragraphs: [
          "Vissa radioaktiva ämnen sönderfaller till andra ämnen i en förutsägbar takt. Genom att mäta deras förhållanden i mineral kan forskare beräkna när mineralen bildades eller när en geologisk händelse inträffade.",
          "Uran–bly-datering av zirkon är en viktig metod. Forskarna jämför ofta flera mineral och undersöker om bergarten senare har värmts upp eller förändrats.",
          "En gammal bergart kan innehålla både ursprungliga mineral och yngre spår av omvandling. Därför krävs noggranna analyser för att förstå vilken ålder en mätning faktiskt visar.",
        ],

        image: {
          src: "/images/timeline/ancient-earth/first-rocks-dating.png",
          alt: "Vetenskaplig infografik om datering av uråldriga bergarter, med zirkonkristaller, uran–bly-analys och en tidslinje över bergartens geologiska historia.",
          caption:
            "En bergart kan innehålla mineral som bildats eller förändrats vid olika tidpunkter. Genom att undersöka deras åldrar kan forskare återskapa delar av bergartens långa historia.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "jordens-arkiv",
        heading: "Varför är jordens äldsta arkiv så ofullständigt?",
        paragraphs: [
          "Vind, vatten, värme och rörelser i jordskorpan bryter ned och omvandlar bergarter. En del smälter helt och blir till nya bergarter.",
          "Därför är det mycket ovanligt att hitta sammanhängande berggrund från jordens första hundratals miljoner år.",
          "Varje bevarat fragment är värdefullt, men forskarna måste vara försiktiga: en liten bit berggrund kan inte ensam visa hur hela planeten såg ut.",
        ],
      },
      {
        id: "betydelse",
        heading: "Vad berättar de äldsta bergarterna?",
        paragraphs: [
          "Bergarternas kemi kan avslöja vilka typer av smältor de bildades ur och hur jordskorpan förändrades.",
          "Vissa mycket gamla bergarter visar att jordens yttre delar redan tidigt kunde genomgå avancerade geologiska processer.",
          "Men hur mycket stabil jordskorpa som fanns, och hur den rörde sig, är fortfarande öppna forskningsfrågor.",
        ],
      },
    ],
    facts: [
      "Acastagnejsen i Kanada är omkring fyra miljarder år gammal.",
      "En bergart kan vara yngre än mineralen som finns inuti den.",
      "Gnejs är en bergart som har omvandlats av tryck och värme.",
      "De äldsta bergarterna är sällsynta eftersom jordens yta ständigt förändras.",
    ],
    evidence: [
      "Uran–bly-datering av zirkon och andra mineral.",
      "Kemiska analyser av bergarternas mineral och grundämnen.",
      "Studier av veckning, omvandling och andra geologiska strukturer.",
      "Jämförelser mellan gamla berggrundsområden på olika kontinenter.",
    ],
    uncertainties: [
      "Hur utbredd den första stabila jordskorpan var.",
      "Hur representativa de få bevarade bergarterna är för den unga jorden.",
      "Vilka geologiska processer som dominerade när bergarterna bildades.",
    ],
    relatedIds: ["oldest-zircons", "early-crust", "continents"],
    sources: [
      {
        label: "USGS – The Age of the Earth",
        url: "https://pubs.usgs.gov/gip/geotime/age.html",
      },
      {
        label: "Geological Survey of Canada – Natural Resources Canada",
        url: "https://natural-resources.canada.ca/",
      },
    ],
  },

  continents: {
    id: "continents",
    kicker: "ARKEIKUM · KONTINENTERNAS BÖRJAN",
    lead: "De kontinenter vi känner i dag fanns inte från början. Under miljarder år bildades nya bergarter, äldre delar av jordskorpan omvandlades och allt större områden av relativt lätt kontinental skorpa växte fram.",
    hero: {
      src: "/images/timeline/ancient-earth/continents-hero.png",
      alt: "Konstnärlig vy över uråldriga klippiga landmassor omgivna av ett stort hav.",
      caption:
        "Hur de första kontinenterna såg ut är osäkert. Bilden är en konstnärlig rekonstruktion.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "forsta-landmassorna",
        heading: "Från små områden till stora landmassor",
        paragraphs: [
          "Jordens tidigaste fasta skorpa bildades när smält berg svalnade. Men den var inte nödvändigtvis lik dagens kontinenter.",
          "Med tiden kunde nya bergarter bildas och äldre skorpa omvandlas. Vissa områden blev mer långlivade och fungerade som kärnor kring vilka kontinental skorpa kunde växa.",
          "Det här skedde inte på en gång. Kontinenternas tillväxt var en lång process med både nybildning och förstörelse av berggrund.",
        ],
      },
      {
        id: "skillnaden",
        heading: "Varför flyter kontinenterna högre?",
        paragraphs: [
          "Kontinental jordskorpa är i genomsnitt tjockare och mindre tät än oceanisk jordskorpa. Därför ligger kontinenterna oftast högre än havsbottnen.",
          "Oceanisk skorpa består till stor del av basaltiska bergarter, medan kontinental skorpa har en mer varierad sammansättning och ofta innehåller bergarter med högre halt av kisel.",
          "Skillnaderna är viktiga för hur jordens yta formas, men de första kontinentliknande områdena kan ha varit annorlunda än dagens.",
        ],
      },
      {
        id: "kratoner",
        heading: "Kratoner – kontinenternas uråldriga hjärtan",
        paragraphs: [
          "En kraton är en mycket gammal och relativt stabil del av en kontinent. Många kratoner innehåller bergarter från arkeikum, alltså tiden för ungefär fyra till 2,5 miljarder år sedan.",
          "Sådana områden finns bland annat i Kanada, Australien och södra Afrika.",
          "Genom att studera kratoner kan forskare undersöka hur kontinental jordskorpa byggdes upp och varför vissa delar överlevde medan andra försvann.",
        ],

        image: {
          src: "/images/timeline/ancient-earth/continents-cratons.png",
          alt: "Vetenskaplig genomskärning av en kontinent med en uråldrig kraton, djup litosfärisk rot, kontinental jordskorpa och omgivande oceanisk jordskorpa. Nederdelen visar hur mindre landmassor kan växa samman.",
          caption:
            "Kratoner är mycket gamla och relativt stabila delar av kontinenterna. Deras djupa rötter i litosfären kan hjälpa dem att överleva i miljarder år. Illustrationen visar också en förenklad modell av hur kontinenter kan växa fram.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "hur-vaxte-de",
        heading: "Hur växte kontinenterna?",
        paragraphs: [
          "Ny kontinental skorpa kan bildas när bergarter delvis smälter och nya magmor stelnar. Äldre skorpa kan också förändras, byggas på eller sammanfogas med andra områden.",
          "I dagens värld spelar plattektonik en central roll. För den mycket unga jorden är det osäkert om samma processer fungerade på samma sätt.",
          "Forskare använder mineralens åldrar och bergarternas kemi för att skilja mellan verklig nybildning av skorpa och omvandling av redan befintligt material.",
        ],
      },
      {
        id: "forandring",
        heading: "Kontinenterna är aldrig färdiga",
        paragraphs: [
          "Kontinenter kan kollidera och bilda bergskedjor, men de kan också spricka upp och skiljas åt när nya hav öppnas.",
          "Under jordens historia har landmassor flera gånger samlats i superkontinenter och sedan delats upp igen.",
          "De första stabila delarna av kontinenterna blev därför början på en historia som fortfarande pågår under våra fötter.",
        ],
      },
    ],
    facts: [
      "Kontinental skorpa är i genomsnitt tjockare och mindre tät än oceanisk skorpa.",
      "Kratoner är mycket gamla och relativt stabila delar av kontinenter.",
      "Kontinenter har både vuxit och återbildats under miljarder år.",
      "Hur mycket kontinental skorpa som fanns under arkeikum är omdiskuterat.",
    ],
    evidence: [
      "Datering av zirkoner och andra mineral i gamla bergarter.",
      "Kemiska och isotopiska analyser som spårar jordskorpans ursprung.",
      "Kartläggning av gamla kratoner och berggrundsområden.",
      "Geologiska modeller av smältning, omvandling och skorptillväxt.",
    ],
    uncertainties: [
      "När de första långlivade kontinenterna bildades.",
      "Hur snabbt mängden kontinental jordskorpa ökade.",
      "Hur mycket de tidigaste processerna liknade modern plattektonik.",
    ],
    relatedIds: ["first-rocks", "plate-tectonics", "rodinia"],
    sources: [
      {
        label: "USGS – This Dynamic Earth",
        url: "https://pubs.usgs.gov/gip/dynamic/dynamic.html",
      },
      {
        label: "British Geological Survey – Discovering Geology",
        url: "https://www.bgs.ac.uk/discovering-geology/",
      },
    ],
  },

  "plate-tectonics": {
    id: "plate-tectonics",
    kicker: "JORDENS HISTORIA · EN PLANET I RÖRELSE",
    lead: "Marken känns stilla under våra fötter. Men jordens yttersta skal är uppdelat i stora plattor som rör sig långsamt. Deras rörelser bygger bergskedjor, öppnar hav och orsakar jordbävningar – och har förändrat vår planet under en mycket lång tid.",
    hero: {
      src: "/images/timeline/ancient-earth/plate-tectonics-hero.png",
      alt: "Konstnärlig genomskärning av två jordskorpeplattor som möts vid en vulkanisk kust.",
      caption:
        "Plattektonik formar jordens yta. Bilden är en förenklad konstnärlig rekonstruktion.",
      credit,
      kind: "illustration",
    },

    sections: [
      {
        id: "plattorna",
        heading: "Jordens yta är ett pussel som rör sig",
        paragraphs: [
          "Jordens yttersta styva skal kallas litosfären. Det består av jordskorpan och den översta fasta delen av manteln.",
          "Litosfären är uppdelad i tektoniska plattor. De rör sig vanligen några centimeter per år i förhållande till varandra.",
          "Rörelserna är små från dag till dag, men över miljontals år kan de flytta hela kontinenter och förändra havens form.",
        ],
      },
      {
        id: "granser",
        heading: "Vad händer där plattor möts?",
        paragraphs: [
          "Där plattor glider isär kan magma stiga upp och bilda ny havsbotten. Sådana områden finns bland annat längs mittoceaniska ryggar.",
          "Där plattor närmar sig varandra kan en oceanisk platta sjunka ned under en annan platta. Processen kallas subduktion och kan bidra till vulkanism och djuphavsgravar.",
          "När två kontinenter kolliderar kan bergskedjor bildas. Plattor kan också glida längs varandra och orsaka jordbävningar.",
        ],

        image: {
          src: "/images/timeline/ancient-earth/plate-boundaries.png",
          alt: "Vetenskaplig infografik som visar tre typer av plattgränser: divergerande, konvergerande och transformförkastningar, med genomskärningar och exempel från jorden.",
          caption:
            "Jordens tektoniska plattor kan glida isär, röra sig mot varandra eller förskjutas längs varandra. Rörelserna formar havsbottnar, bergskedjor och vulkaner och orsakar många jordbävningar.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "drivkrafter",
        heading: "Vad får plattorna att röra sig?",
        paragraphs: [
          "Jordens inre avger värme, och material i manteln deformeras mycket långsamt över geologisk tid.",
          "En viktig drivkraft i dagens plattektonik är att kalla, täta delar av oceaniska plattor sjunker ned i manteln och drar med sig resten av plattan.",
          "Flera processer samverkar, och forskare undersöker fortfarande hur deras betydelse varierar mellan olika delar av jorden.",
        ],

        image: {
          src: "/images/timeline/ancient-earth/seafloor-spreading.png",
          alt: "Vetenskaplig infografik som visar en mittoceanisk rygg, symmetriska magnetiska band på havsbotten och hur ny oceanisk jordskorpa bildas när plattorna glider isär.",
          caption:
            "När ny oceanisk jordskorpa bildas registrerar magnetiska mineral riktningen på jordens magnetfält. Eftersom magnetfältet har växlat riktning genom historien finns matchande magnetiska mönster på båda sidor om mittoceaniska ryggar. Det är ett viktigt bevis för havsbottenspridning.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "nar-borjade-det",
        heading: "När började plattektoniken?",
        paragraphs: [
          "Det finns inget enkelt datum då jordens plattor började röra sig som de gör i dag.",
          "Vissa geologiska spår tyder på mycket gamla rörelser och återvinning av jordskorpa. Men enstaka tecken på rörelse behöver inte betyda att ett globalt system av modern plattektonik redan fanns.",
          "Forskare föreslår därför olika tidpunkter för när dagens typ av plattektonik etablerades. Frågan är fortfarande omdiskuterad.",
        ],
      },
      {
        id: "betydelse",
        heading: "Varför är plattektonik så viktig?",
        paragraphs: [
          "Plattektoniken hjälper till att förklara var jordbävningar och många vulkaner uppstår, varför bergskedjor bildas och hur oceaner öppnas och stängs.",
          "När bergarter bildas, vittrar och återvinns påverkas också kretsloppet av bland annat kol mellan jordens inre, hav och atmosfär.",
          "Genom att förstå plattornas rörelser kan forskare återskapa kontinenternas historia och undersöka hur planetens miljö förändrats.",
        ],
      },
    ],
    facts: [
      "Litosfären omfattar både jordskorpan och den översta fasta manteln.",
      "Tektoniska plattor rör sig vanligen några centimeter per år.",
      "Ny havsbotten bildas där vissa plattor glider isär.",
      "Exakt när modern plattektonik började är fortfarande omdiskuterat.",
    ],
    evidence: [
      "GPS-mätningar av dagens plattrörelser.",
      "Jordbävningars lägen och djup samt kartläggning av havsbottnen.",
      "Magnetiska mönster och åldrar hos oceanisk berggrund.",
      "Gamla bergarters strukturer, mineral och kemiska sammansättning.",
    ],
    uncertainties: [
      "När ett globalt system av modern plattektonik etablerades.",
      "Vilka processer som dominerade jordens tidigaste skorprörelser.",
      "Hur övergången till dagens typ av plattrörelser gick till.",
    ],
    relatedIds: ["continents", "rodinia", "pangaea"],
    sources: [
      {
        label: "USGS – This Dynamic Earth",
        url: "https://pubs.usgs.gov/gip/dynamic/dynamic.html",
      },
      {
        label: "USGS – Understanding Plate Motions",
        url: "https://pubs.usgs.gov/gip/dynamic/understanding.html",
      },
    ],
  },
};
