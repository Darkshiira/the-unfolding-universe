import type { MilestoneArticleData } from "./types";

const credit = "Konstnärlig rekonstruktion för The Unfolding Universe";

export const lifeOxygenArticles: Record<string, MilestoneArticleData> = {
  photosynthesis: {
    id: "photosynthesis",
    kicker: "ARKAIKUM · NÄR LIVET FÅNGADE SOLLJUSET",
    lead: "Långt innan det fanns växter använde mikroorganismer ljus som energikälla. Så småningom utvecklades fotosyntes som frigör syre – en biologisk innovation som skulle förändra jordens hav, atmosfär och framtida liv.",
    hero: {
      src: "/images/timeline/life-oxygen/photosynthesis-hero.png",
      alt: "Konstnärlig rekonstruktion av ett grunt urhav där solljus tränger genom vattnet och lyser upp mikrobiella mattor på havsbottnen.",
      caption:
        "Ljusdrivna mikroorganismer fanns långt innan landväxterna. När syreproducerande fotosyntes utvecklades började livet förändra planetens kemi.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "solljus-som-energi",
        heading: "När solljuset blev en energikälla",
        paragraphs: [
          "Allt levande behöver energi. Tidiga mikroorganismer kunde utnyttja kemiska reaktioner i sin omgivning, men någon gång under livets tidiga historia utvecklades också förmågan att fånga ljus och använda dess energi.",
          "Fotosyntes är inte en enda process. Vissa bakterier använder ljus utan att bilda syrgas. Sådan syrefri fotosyntes kan använda andra ämnen än vatten som elektronkällor, exempelvis svavelföreningar.",
          "När den första fotosyntesen uppstod vet vi inte säkert. Spåren är gamla och svåra att tolka, och dagens organismer berättar bara en del av den långa evolutionära historien.",
        ],
      },
      {
        id: "cyanobakterier",
        heading: "Mikroorganismer som kunde bilda syre",
        paragraphs: [
          "Cyanobakterier är mikroorganismer som utför syreproducerande fotosyntes. De använder ljusenergi för att omvandla vatten och koldioxid till organiska ämnen, samtidigt som syrgas frigörs.",
          "Det var en avgörande skillnad jämfört med fotosyntes som inte producerar syre. Vatten fanns i stora mängder, och syre blev en ny, kemiskt reaktiv produkt i omgivningen.",
          "Cyanobakteriernas förfäder utvecklade denna förmåga långt före växternas uppkomst. Exakt när det skedde är fortfarande omdiskuterat, men syreproducerande fotosyntes fanns före den stora syresättningen för omkring 2,4 miljarder år sedan.",
        ],
      },
      {
        id: "sa-fungerar-det",
        heading: "Från vatten och ljus till syrgas",
        paragraphs: [
          "I syreproducerande fotosyntes fångar pigment upp ljusenergi. Energin driver en kedja av reaktioner där vattenmolekyler spjälkas, elektroner förs vidare och syrgas bildas.",
          "Samtidigt används energin till att bygga organiska ämnen med kol från koldioxid. Dessa ämnen kan ge både byggmaterial och lagrad kemisk energi till organismen.",
          "Det är viktigt att skilja på syreproduktionen och syrets senare ansamling i atmosfären. Under lång tid kunde nybildat syre förbrukas i reaktioner med ämnen i hav och bergarter.",
        ],
        image: {
          src: "/images/timeline/life-oxygen/photosynthesis-process.png",
          alt: "Pedagogiskt diagram som jämför syrefri fotosyntes med syreproducerande fotosyntes hos cyanobakterier och visar hur solljus, vatten och koldioxid används medan syrgas frigörs.",
          caption:
            "All fotosyntes bildar inte syrgas. Vid syreproducerande fotosyntes används vatten och syrgas frigörs som en produkt.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "havens-kemi",
        heading: "Först förändrades haven",
        paragraphs: [
          "Den tidiga jordens hav innehöll ämnen som kunde reagera med syre, bland annat löst tvåvärt järn. Därför behövde syrgas som producerades lokalt inte omedelbart samlas i luften.",
          "När syre reagerar med järn kan järnoxider bildas. Vissa mycket gamla järnrika bergarter ger forskare ledtrådar om samspelet mellan mikroorganismer, havskemi och jordens förändrade miljö.",
          "Syreproduktionen var alltså inte en strömbrytare som plötsligt gjorde hela planeten syrerik. Förändringen skedde över lång tid och påverkades av både biologiska och geologiska processer.",
        ],
      },
      {
        id: "en-ny-framtid",
        heading: "En innovation med följder för hela planeten",
        paragraphs: [
          "Syreproducerande fotosyntes skapade förutsättningar för en ny sorts global kemi. Men många tidiga organismer var anpassade till syrefattiga miljöer, och syrgas kunde vara skadligt för dem.",
          "Långt senare skulle syre också möjliggöra effektiv energianvändning hos många organismer och bidra till de förutsättningar där komplext liv utvecklades.",
          "Nästa kapitel handlar om den tid då syrgas började bli en bestående del av jordens atmosfär: den stora syresättningen.",
        ],
      },
    ],
    facts: [
      "Fotosyntes utvecklades långt innan de första landväxterna.",
      "Vissa former av fotosyntes producerar ingen syrgas.",
      "Cyanobakterier använder vatten vid syreproducerande fotosyntes.",
      "Syre kunde reagera med ämnen i haven innan det började ansamlas i atmosfären.",
    ],
    evidence: [
      "Geokemiska spår i gamla sediment och järnrika bergarter.",
      "Jämförelser av fotosyntesens molekylära system hos nu levande mikroorganismer.",
      "Experiment och observationer av cyanobakteriers fotosyntes.",
      "Isotopstudier som belyser jordens tidiga kol- och syrecykler.",
    ],
    uncertainties: [
      "När den första ljusdrivna fotosyntesen utvecklades.",
      "När syreproducerande fotosyntes först uppstod.",
      "Hur stor syreproduktionen var i olika havsmiljöer före den stora syresättningen.",
    ],
    relatedIds: ["stromatolites", "microbes", "oxygen"],
    sources: [
      {
        label: "Encyclopaedia Britannica – Photosynthesis",
        url: "https://www.britannica.com/science/photosynthesis",
      },
      { label: "NASA Astrobiology", url: "https://astrobiology.nasa.gov/" },
      {
        label: "Nature Education – Photosynthesis",
        url: "https://www.nature.com/scitable/",
      },
    ],
  },
  oxygen: {
    id: "oxygen",
    kicker: "PALEOPROTEROZOIKUM · DEN STORA SYRESÄTTNINGEN",
    lead: "För omkring 2,4 miljarder år sedan förändrades jordens atmosfär i grunden. Syrgas som producerades av mikroorganismer började få ett mer bestående genomslag – med enorma följder för hav, bergarter och liv.",
    hero: {
      src: "/images/timeline/life-oxygen/oxygen-hero.png",
      alt: "Konstnärlig rekonstruktion av den tidiga jordens hav och karga kust när atmosfärens syrehalt började öka, med solbelysta moln och järnrika röda sediment.",
      caption:
        "Den stora syresättningen förändrade jordens kemi. Atmosfären blev inte omedelbart lika syrerik som i dag.",
      credit,
      kind: "illustration",
    },

    showcase: {
      src: "/images/timeline/showcases/banded-iron-formation.png",
      title: "Bandad järnformation – när haven förändrades",
      description:
        "Bandade järnformationer består av växlande järnrika och kiseldioxidrika lager som bildades i forntida hav. Deras mineral och kemiska sammansättning hjälper forskare att förstå hur järn och syre samspelade under jordens tidiga historia. Många bildades långt före den stora syresättningen. Konstnärlig illustration av ett bergartsprov, inte ett autentiskt exemplar.",
      alt: "Konstnärlig museiillustration av en bandad järnformation med böljande lager av röd hematit, mörka järnmineral och grå kiseldioxidrik bergart, placerad på en rund, polerad träplattform.",
    },

    sections: [
      {
        id: "syret-okar",
        heading: "När atmosfären började förändras",
        paragraphs: [
          "Under jordens tidiga historia innehöll atmosfären mycket lite fritt syre jämfört med i dag. Ändå kunde mikroorganismer redan producera syrgas genom fotosyntes.",
          "Under den stora syresättningen, som tog fart för omkring 2,4 miljarder år sedan, började syre få en mer varaktig närvaro i atmosfären. Förändringen skedde inte nödvändigtvis jämnt eller snabbt, och syrehalten var fortfarande långt under dagens nivåer.",
          "Händelsen kallas ofta Great Oxidation Event, GOE. Den är en av de mest betydelsefulla kemiska förändringarna i jordens historia.",
        ],
      },
      {
        id: "varfor-da",
        heading: "Varför samlades syret just då?",
        paragraphs: [
          "Att organismer bildar syrgas räcker inte för att atmosfären ska bli syrerik. Syret kan förbrukas när det reagerar med järn, vulkaniska gaser och andra ämnen som lätt oxideras.",
          "Hur mycket syre som blir kvar beror därför på balansen mellan produktion och förbrukning. Begravning av organiskt kol, förändrad vulkanism och andra långsamma geologiska processer kan ha bidragit till att förändra denna balans.",
          "Forskare diskuterar fortfarande vilka mekanismer som var viktigast och varför jordens syresättning skedde i flera steg under mycket lång tid.",
        ],
      },

      {
        id: "haven-rostar",
        heading: "När haven började rosta",
        paragraphs: [
          "Långt innan jordens atmosfär blev syrerik fanns stora mängder löst järn i delar av urhaven. Järnet förekom bland annat som järnjoner, Fe²⁺, som kunde transporteras med vattnet i syrefattiga miljöer.",

          "När syreproducerande mikroorganismer frigjorde syrgas kunde den reagera med det lösta järnet. Järnet oxiderades och kunde så småningom bilda svårlösliga järnmineral som sjönk mot havsbottnen. På så sätt bidrog syre till att förändra både havens kemi och de sediment som bildades.",

          "Under långa perioder av jordens tidiga historia avsattes järnrika sediment som senare blev bandade järnformationer. Dessa bergarter innehåller ofta omväxlande järnrika och kiseldioxidrika lager, ibland med vackra röda, grå och nästan svarta färger.",

          "Men jorden rostade inte överallt samtidigt. Bandade järnformationer började bildas långt före den stora syresättningen, och forskare undersöker fortfarande hur olika biologiska och kemiska processer bidrog till deras uppkomst. De är därför viktiga ledtrådar till havens utveckling, inte ett enkelt mått på atmosfärens syrehalt.",
        ],
        image: {
          src: "/images/timeline/life-oxygen/oceans-begin-to-rust.png",
          alt: "Pedagogiskt tvärsnitt av ett urhav där syre från fotosyntetiserande mikroorganismer reagerar med löst järn, så att järnmineral bildas och avsätts i sediment på havsbottnen.",
          caption:
            "Syre från mikroorganismer kunde reagera med löst järn i urhaven. Under lång tid bidrog järnmineral till sediment som senare bildade bandade järnformationer. Processerna varierade mellan olika miljöer och tidsperioder.",
          credit,
          kind: "diagram",
        },
      },

      {
        id: "sparen-i-stenen",
        heading: "Bergarter avslöjar en osynlig förändring",
        paragraphs: [
          "Vi kan inte mäta luften från för 2,4 miljarder år sedan direkt. I stället undersöker forskare kemiska spår i bergarter som bildades då.",
          "Ett särskilt viktigt bevis kommer från svavelisotoper. I äldre bergarter finns ett isotopmönster som kan bildas genom fotokemiska reaktioner i en mycket syrefattig atmosfär. När detta mönster i stort sett försvinner visar det att atmosfärens kemi hade förändrats.",
          "Även rödfärgade sediment, järnmineral och andra geokemiska indikatorer hjälper forskare att rekonstruera syrets historia. Varje signal måste tolkas i sitt geologiska sammanhang.",
        ],
        image: {
          src: "/images/timeline/life-oxygen/great-oxidation-evidence.png",
          alt: "Pedagogiskt diagram över jordens syresättning med en tidslinje, förändrade svavelisotopsignaler och exempel på järnrika sediment som geologiska ledtrådar.",
          caption:
            "Förändrade svavelisotoper och andra geokemiska spår visar att atmosfärens syrehalt började förändras för omkring 2,4 miljarder år sedan.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "livets-kris",
        heading: "Syre: en fara och en möjlighet",
        paragraphs: [
          "Syrgas är kemiskt reaktiv. För organismer som levde i syrefattiga miljöer kunde ökande syrehalter innebära stress och skador på cellernas molekyler.",
          "Samtidigt kunde organismer med förmåga att hantera och utnyttja syre få nya möjligheter. Med tiden blev syreberoende cellandning en viktig energikälla för många livsformer.",
          "Det är svårt att avgöra exakt hur den stora syresättningen påverkade den tidens biologiska mångfald, eftersom fossilmaterialet från perioden är begränsat. Vi bör därför vara försiktiga med att beskriva den som en säkert belagd global massutrotning.",
        ],
      },
      {
        id: "klimat-och-framtid",
        heading: "En ny planet, men ännu inte vår",
        paragraphs: [
          "Förändringar i atmosfärens kemi kan också påverka klimatet. En möjlig koppling är att ökande syre bidrog till att minska mängden metan, en kraftfull växthusgas, men sambanden och deras betydelse diskuteras fortfarande.",
          "Jorden genomgick stora klimatförändringar under paleoproterozoikum, bland annat omfattande nedisningar. Forskare undersöker hur dessa händelser hängde samman med förändringar i atmosfären och kolcykeln.",
          "Trots syresättningen dröjde det mycket länge innan atmosfären nådde syrehalter som liknar dagens. Livets och jordens historia fortsatte att forma varandra under miljarder år.",
        ],
      },
    ],
    facts: [
      "Den stora syresättningen inleddes för omkring 2,4 miljarder år sedan.",
      "Syreproducerande mikroorganismer fanns före atmosfärens stora syreökning.",
      "Svavelisotoper i mycket gamla bergarter är viktiga bevis för atmosfärens förändring.",
      "Syrehalten nådde inte dagens nivåer direkt efter den stora syresättningen.",
      "Syre från mikroorganismer kunde reagera med löst järn i urhaven och bidra till bildningen av järnrika sediment.",
    ],
    evidence: [
      "Förändringar i massoberoende fraktionering av svavelisotoper i sedimentära bergarter.",
      "Järnmineral, rödfärgade sediment och andra indikatorer på oxiderande miljöer.",
      "Geokemiska modeller av syrets källor och förbrukning.",
      "Dateringar av bergarter från paleoproterozoikum.",
      "Bandade järnformationer med järnoxider och kiseldioxidrika lager, som ger ledtrådar till urhavens kemiska utveckling.",
    ],
    uncertainties: [
      "Varför atmosfärens syre började ansamlas just under denna period.",
      "Hur snabbt och hur jämnt syrehalterna förändrades.",
      "Hur syresättningen påverkade tidiga ekosystem och klimatet i detalj.",
    ],
    relatedIds: ["photosynthesis", "huronian", "eukaryotes", "stromatolites"],
    sources: [
      {
        label: "Encyclopaedia Britannica – Great Oxidation Event",
        url: "https://www.britannica.com/science/Great-Oxidation-Event",
      },
      { label: "NASA Astrobiology", url: "https://astrobiology.nasa.gov/" },
      {
        label: "Nature – Earth and planetary science research",
        url: "https://www.nature.com/subjects/earth-and-planetary-sciences",
      },
    ],
  },
};
