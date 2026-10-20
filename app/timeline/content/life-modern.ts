import type { MilestoneArticleData } from "./types";

const credit = "Konstnärlig illustration skapad med AI.";

export const lifeModernArticles: Record<string, MilestoneArticleData> = {
  "paleocene-eocene-warming": {
    id: "paleocene-eocene-warming",
    kicker: "PALEOCEN–EOCEN · LIVET I EN VÄXTHUSVÄRLD",
    lead: "För omkring 56 miljoner år sedan steg jordens temperatur kraftigt under en geologiskt kort period. Haven förändrades, ekosystem omorganiserades och många arter fick nya livsvillkor. Denna händelse, känd som PETM, visar hur nära sammanflätade klimatet och livet på jorden är.",
    hero: {
      src: "/images/timeline/life-modern/petm-hero.webp",
      alt: "Konstnärlig rekonstruktion av ett varmt landskap under paleocen–eocen med tät subtropisk vegetation, floder och tidiga däggdjur.",
      caption:
        "Under PETM blev jorden betydligt varmare. Många växt- och djursamhällen förändrades när klimat och livsmiljöer skiftade.",
      credit,
      kind: "illustration",
    },
    showcase: {
      src: "/images/timeline/showcases/petm-fossil-leaf.webp",
      title: "Fossilt löv – ett spår av en varmare värld",
      description:
        "Fossila blad från tiden kring övergången mellan paleocen och eocen hjälper forskare att förstå hur jordens växtlighet förändrades under en period av kraftig global uppvärmning för omkring 56 miljoner år sedan. Bladens form, storlek och nervmönster kan ge ledtrådar om forntida växtsamhällen och klimatförhållanden. Konstnärlig illustration av ett fossilförande bergartsprov, inte ett autentiskt exemplar från PETM.",
      alt: "Konstnärlig museiillustration av ett stort fossilt löv med tydliga bladnerver och fint tandad kant, bevarat som ett mörkbrunt avtryck i en ljus beige sedimentär stenplatta, placerad på en polerad träplattform mot transparent bakgrund.",
    },
    sections: [
      {
        id: "en-varmare-varld",
        heading: "När jordens temperatur steg",
        paragraphs: [
          "Under övergången mellan paleocen och eocen, för omkring 56 miljoner år sedan, inträffade en ovanligt kraftig uppvärmning. Händelsen kallas Paleocene–Eocene Thermal Maximum, förkortat PETM.",
          "Den globala medeltemperaturen steg uppskattningsvis med omkring 5–8 °C, även om exakta värden och regionala förändringar är osäkra. Uppvärmningen skedde under tusentals år och den efterföljande återhämtningen tog betydligt längre tid.",
          "Jorden var redan varm jämfört med i dag, och stora permanenta inlandsisar saknades. PETM innebar därför ytterligare uppvärmning av en redan utpräglad växthusvärld.",
        ],
      },
      {
        id: "kolets-roll",
        heading: "En stor förändring i kolets kretslopp",
        paragraphs: [
          "Ett av de tydligaste spåren efter PETM är en kraftig förändring i förhållandet mellan olika kolisotoper i sediment. Signalen visar att stora mängder kol med en särskild isotopsammansättning tillfördes jordens aktiva kolkretslopp.",
          "Detta kol kan ha kommit från flera källor, exempelvis vulkaniskt påverkade sediment, organiskt material eller metanrika reservoarer. Forskare diskuterar fortfarande hur stor betydelse varje möjlig källa hade.",
          "Ökade halter av växthusgaser bidrog till uppvärmningen. Samtidigt kunde ett varmare klimat påverka kolets kretslopp ytterligare och därmed förstärka förändringarna.",
        ],
        image: {
          src: "/images/timeline/life-modern/petm-carbon-cycle.webp",
          alt: "Pedagogiskt diagram som visar hur ett stort tillskott av kol till atmosfär och hav kan förstärka växthuseffekten och påverka havens kemi.",
          caption:
            "PETM förknippas med en stor störning i kolets kretslopp. Forskare undersöker fortfarande vilka kolkällor som var viktigast.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "haven-forandras",
        heading: "När haven blev varmare och surare",
        paragraphs: [
          "När mer koldioxid löser sig i havsvatten förändras havets karbonatkemi. Under PETM finns geologiska belägg för omfattande försurning i delar av världshaven.",
          "Många bottenlevande foraminiferer, små encelliga organismer med skal, drabbades hårt. En betydande utdöendehändelse bland djuphavens bottenlevande foraminiferer sammanfaller med PETM.",
          "Andra marina organismer reagerade genom att förändra sin geografiska utbredning eller sammansättningen av sina samhällen. Effekterna varierade mellan havsområden och organismgrupper.",
        ],
        image: {
          src: "/images/timeline/life-modern/petm-ocean-changes.webp",
          alt: "Pedagogisk jämförelse av havsmiljöer före och under PETM, med förändrad temperatur, havsförsurning och bottenlevande foraminiferer.",
          caption:
            "Uppvärmning och förändrad havskemi påverkade marina ekosystem. Särskilt tydliga förluster syns bland vissa djuphavslevande foraminiferer.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "livet-pa-land",
        heading: "När växter och däggdjur flyttade",
        paragraphs: [
          "På land förändrades temperaturer, nederbörd och växtlighet. Fossil av blad och pollen visar att växtsamhällen reagerade på det nya klimatet, men förändringarna såg olika ut i olika regioner.",
          "Däggdjurens utbredning förändrades också. Kring denna tid framträder flera däggdjursgrupper tydligare i fossilmaterialet på norra halvklotet, bland annat tidiga släktingar till hästar och primater.",
          "I vissa fossilserier finns tecken på att kroppsstorleken minskade hos vissa däggdjur under den varma perioden. Orsakerna kan ha varit flera, och mönstret gällde inte alla arter.",
        ],
        image: {
          src: "/images/timeline/life-modern/petm-ecosystems.webp",
          alt: "Pedagogisk illustration av förändrade växtmiljöer och däggdjurens geografiska spridning under PETM.",
          caption:
            "Under PETM förändrades livsmiljöer och flera däggdjursgrupper spreds till nya områden. Illustrationens landskap är förenklade rekonstruktioner.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "hur-vet-vi",
        heading: "Hur kan forskarna upptäcka en värmeperiod?",
        paragraphs: [
          "Havssediment innehåller mikroskopiska fossil och kemiska ämnen som bevarar information om tidigare miljöer. Forskare analyserar bland annat syre- och kolisotoper för att undersöka temperaturer och förändringar i kolets kretslopp.",
          "Även fossila blad, pollen och däggdjur hjälper forskare att förstå hur livet reagerade. Genom att jämföra fynd från olika delar av världen kan de skilja lokala förändringar från mer omfattande mönster.",
          "PETM används ofta som ett forskningsfall för att förstå kopplingar mellan kolutsläpp, klimat och ekosystem. Men händelsen är inte en exakt motsvarighet till dagens klimatförändringar, eftersom utgångsläget, tidsförloppen och andra förhållanden skiljer sig åt.",
        ],
      },
    ],
    facts: [
      "PETM inträffade för omkring 56 miljoner år sedan.",
      "Den globala uppvärmningen uppskattas till ungefär 5–8 °C.",
      "Kol- och syreisotoper i sediment hjälper forskare att rekonstruera händelsen.",
      "Många bottenlevande foraminiferer i djuphaven dog ut.",
      "Flera däggdjursgrupper förändrade sin utbredning under perioden.",
    ],
    evidence: [
      "En tydlig negativ förändring i kolisotopsignalen i marina och terrestra sediment.",
      "Temperaturindikatorer från syreisotoper och andra geokemiska analyser.",
      "Förändringar i karbonatbevarande och foraminiferernas fossilmaterial.",
      "Fossila växter och däggdjur som visar förändrade ekosystem och utbredningsområden.",
    ],
    uncertainties: [
      "Vilka kolkällor som bidrog mest till uppvärmningen.",
      "Hur snabbt olika faser av PETM utvecklades.",
      "Hur klimatförändringarna varierade geografiskt.",
      "Vilka faktorer som låg bakom förändringar i olika organismgrupper.",
    ],
    relatedIds: [
      "cretaceous-extinction",
      "biodiversity",
      "himalayas",
      "mammals",
      "primates",
    ],
    sources: [
      {
        label: "Encyclopaedia Britannica – Paleocene-Eocene Thermal Maximum",
        url: "https://www.britannica.com/science/Paleocene-Eocene-Thermal-Maximum",
      },
      {
        label: "NOAA Paleoclimatology",
        url: "https://www.ncei.noaa.gov/products/paleoclimatology",
      },
      {
        label: "Nature – Palaeoclimate research",
        url: "https://www.nature.com/subjects/palaeoclimate",
      },
    ],
  },

  biodiversity: {
    id: "biodiversity",
    kicker: "KENOZOIKUM · NYA EKOSYSTEM VÄXER FRAM",
    lead: "När kritaperioden tog slut försvann många välbekanta livsformer, men livet upphörde inte. Under de följande 66 miljoner åren utvecklades nya ekologiska samhällen. Däggdjur, fåglar, blomväxter och otaliga mikroorganismer blev delar av den föränderliga värld som så småningom skulle bli vår.",
    hero: {
      src: "/images/timeline/life-modern/biodiversity-hero.webp",
      alt: "Konstnärlig rekonstruktion av ett artrikt kenozoiskt landskap med skog, blommande växter, fåglar, däggdjur och ett vattendrag.",
      caption:
        "Efter massutrotningen vid kritas slut förändrades ekosystemen under miljontals år. Dagens biologiska mångfald har formats av denna långa historia.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "efter-katastrofen",
        heading: "Livet efter katastrofen",
        paragraphs: [
          "För 66 miljoner år sedan förändrade massutrotningen vid kritas slut livets förutsättningar. Många grupper dog ut, men andra överlevde och fortsatte att utvecklas.",
          "När vissa ekologiska roller blev lediga kunde överlevande grupper spridas och utveckla nya levnadssätt. Denna process kallas ibland adaptiv radiation när en evolutionär linje förgrenas till många former anpassade till olika miljöer.",
          "Återhämtningen skedde inte över en natt. Ekosystem byggdes upp på nytt under långa tidsperioder, och utvecklingen såg olika ut i olika delar av världen.",
        ],
      },
      {
        id: "nya-djurvarldar",
        heading: "Däggdjur och fåglar tar nya roller",
        paragraphs: [
          "Däggdjur fanns redan under dinosauriernas tidsålder. Efter kritas slut utvecklades många nya former, från små marklevande djur till stora växtätare och rovdjur.",
          "Fåglarna, som är den överlevande dinosauriegruppen, fortsatte också att utvecklas. Med tiden uppstod många av de ekologiska specialiseringar vi känner igen hos dagens fåglar.",
          "Utvecklingen var inte en rak väg mot dagens arter. Många framgångsrika grupper från kenozoikum har själva dött ut, och evolutionens förlopp har påverkats av klimat, geografi och slumpmässiga händelser.",
        ],
        image: {
          src: "/images/timeline/life-modern/cenozoic-diversification.webp",
          alt: "Pedagogiskt diagram som visar hur flera grupper av däggdjur och fåglar utvecklade olika ekologiska roller under kenozoikum.",
          caption:
            "Efter kritas slut diversifierades flera överlevande grupper. Diagrammet visar utvalda exempel, inte ett fullständigt evolutionärt släktträd.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "vaxternas-samarbeten",
        heading: "Blommor, frukter och nya samarbeten",
        paragraphs: [
          "Blomväxter hade redan utvecklats under krita och var en viktig del av många ekosystem före massutrotningen. Under kenozoikum fortsatte de att spridas och förändra landskapens växtlighet.",
          "Många växter samspelar med djur som transporterar pollen eller sprider frön. Sådana relationer kan påverka båda parternas evolution, även om de inte alltid utvecklas tillsammans på ett enkelt sätt.",
          "Under senare delar av kenozoikum fick gräsmarker stor utbredning i flera regioner. Det förändrade förutsättningarna för växtätare, rovdjur och marklevande organismer.",
        ],
      },
      {
        id: "ekosystemens-natverk",
        heading: "Livet bildar sammanhängande nätverk",
        paragraphs: [
          "Ett ekosystem består inte bara av de mest synliga djuren och växterna. Svampar, bakterier, arkéer och andra mikroorganismer bidrar till nedbrytning, näringsomsättning och relationer mellan organismer.",
          "Vissa arter lever av andra, medan andra samarbetar eller konkurrerar om resurser. Förändringar hos en art kan därför påverka många andra delar av ekosystemet.",
          "Under kenozoikum förändrades sådana nätverk när kontinenter flyttade sig, bergskedjor höjdes och klimatet växlade mellan varmare och kallare perioder.",
        ],
        image: {
          src: "/images/timeline/life-modern/ecosystem-food-web.webp",
          alt: "Pedagogiskt näringsvävsdiagram med växter, växtätare, rovdjur, svampar och mikroorganismer samt pilar som visar energiöverföring.",
          caption:
            "Ekosystem är nätverk av organismer och miljöfaktorer. Energi överförs genom näringsvävar medan ämnen återcirkuleras.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "standig-forandring",
        heading: "En värld som aldrig slutade förändras",
        paragraphs: [
          "Den biologiska mångfalden under kenozoikum formades av stora förändringar i jordens miljö. Kontinenternas lägen, havsströmmar, bergskedjor och klimat påverkade var organismer kunde leva.",
          "När livsmiljöer delades upp kunde populationer utvecklas i olika riktningar. När miljöer åter knöts samman kunde arter spridas och möta nya konkurrenter eller samarbetspartner.",
          "Dagens ekosystem är därför inte slutpunkten för en förutbestämd utveckling. De är tillfälliga resultat av en historia där evolution och miljö ständigt påverkat varandra.",
        ],
      },
    ],
    facts: [
      "Kenozoikum började för 66 miljoner år sedan och pågår fortfarande.",
      "Däggdjur och fåglar utvecklade många nya ekologiska roller efter kritas slut.",
      "Blomväxter uppstod före kenozoikum men fortsatte att diversifieras.",
      "Ekosystem formas av både biologiska relationer och förändringar i miljön.",
    ],
    evidence: [
      "Fossilserier som visar förändringar i däggdjurs, fåglars och växters mångfald.",
      "Pollen och andra växtfossil som dokumenterar förändrad vegetation.",
      "Geologiska och geokemiska belägg för klimatförändringar under kenozoikum.",
      "DNA-baserade släktskapsanalyser som kompletterar fossilmaterialet.",
    ],
    uncertainties: [
      "Hur snabbt olika ekosystem återhämtade sig efter kritas massutrotning.",
      "Hur enskilda klimat- och geografiska förändringar påverkade artbildningen.",
      "Hur väl fossilmaterialet representerar den ursprungliga mångfalden.",
    ],
    relatedIds: [
      "cretaceous-extinction",
      "paleocene-eocene-warming",
      "mammals",
      "birds",
      "flowers",
      "grasslands",
      "life-today",
    ],
    sources: [
      {
        label: "Smithsonian National Museum of Natural History",
        url: "https://naturalhistory.si.edu/",
      },
      {
        label: "UC Museum of Paleontology – Understanding Evolution",
        url: "https://evolution.berkeley.edu/",
      },
      {
        label: "Encyclopaedia Britannica – Cenozoic Era",
        url: "https://www.britannica.com/science/Cenozoic-Era",
      },
    ],
  },

  "life-today": {
    id: "life-today",
    kicker: "NUTID · EN PLANET FULL AV LIV",
    lead: "Från mörka djuphav till höga bergstoppar finns liv i en häpnadsväckande mångfald av former. Alla nu levande organismer bär spår av en gemensam evolutionär historia. Men livets berättelse är inte färdigskriven – evolutionen fortsätter varje dag.",
    hero: {
      src: "/images/timeline/life-modern/life-today-hero.webp",
      alt: "Konstnärlig naturillustration som förenar en tropisk skog, ett artrikt hav och ett bergslandskap med många olika växter och djur.",
      caption:
        "Jordens liv finns i nästan alla tänkbara miljöer. Den biologiska mångfalden omfattar mycket mer än de stora djur och växter vi lätt kan se.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "livets-mangfald",
        heading: "Hur många livsformer finns det?",
        paragraphs: [
          "Forskare har beskrivit miljontals arter, men det verkliga antalet är fortfarande osäkert. Särskilt bland insekter, svampar och många mikroorganismer återstår stora kunskapsluckor.",
          "Biologisk mångfald handlar inte bara om antalet arter. Den omfattar också genetiska skillnader inom arter och variationen mellan ekosystem.",
          "En tropisk regnskog, ett korallrev och en nordlig myr kan alla vara biologiskt betydelsefulla, även om deras arter och ekologiska processer skiljer sig åt.",
        ],
      },
      {
        id: "tre-domaner",
        heading: "Livets tre domäner",
        paragraphs: [
          "Cellulärt liv brukar delas in i tre domäner: bakterier, arkéer och eukaryoter. Bakterier och arkéer saknar cellkärna, medan eukaryoter omfattar bland annat djur, växter, svampar och många encelliga organismer.",
          "Moderna genetiska analyser visar att eukaryoter har ett särskilt nära evolutionärt släktskap med arkéer. Därför diskuteras också modeller där livets släktträd beskrivs med två övergripande domäner.",
          "Virus spelar en stor roll i biosfären men räknas vanligen inte som cellulära organismer. Frågan om hur liv ska definieras är mer komplicerad än den först kan verka.",
        ],
        image: {
          src: "/images/timeline/life-modern/tree-of-life.webp",
          alt: "Pedagogiskt förenklat släktträd över bakterier, arkéer och eukaryoter med exempel på organismer och markering av eukaryoternas nära släktskap med arkéer.",
          caption:
            "Livets släktskap rekonstrueras bland annat med DNA. Bilden visar en förenklad modell; hur domänerna bör avgränsas diskuteras fortfarande.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "det-osynliga-livet",
        heading: "Den osynliga majoriteten",
        paragraphs: [
          "Mikroorganismer finns i jord, vatten, luft och inuti andra organismer. De bidrar till att bryta ner organiskt material, omvandla näringsämnen och påverka jordens stora kemiska kretslopp.",
          "Många organismer lever i nära samspel med mikrober. Människor och andra djur har exempelvis mikrobiella samhällen som kan påverka matsmältning och andra kroppsfunktioner.",
          "Det finns också mikroorganismer som klarar mycket extrema miljöer, som heta källor, djuphav och mycket salta vatten. Deras anpassningar visar hur varierande livets möjligheter är.",
        ],
      },
      {
        id: "allt-hanger-ihop",
        heading: "Ekosystemen håller planeten levande",
        paragraphs: [
          "Fotosyntetiserande organismer omvandlar ljusenergi till kemisk energi och bildar organiskt material som ligger till grund för många näringsvävar.",
          "Djur, svampar och mikroorganismer bidrar på olika sätt till att föra energi och ämnen vidare genom ekosystemen. Pollinering, nedbrytning och näringsomsättning är exempel på viktiga ekologiska processer.",
          "När miljöförhållanden eller artsammansättningar förändras kan dessa processer påverkas. Ekosystem är dynamiska och deras stabilitet beror på många samverkande faktorer.",
        ],
        image: {
          src: "/images/timeline/life-modern/earth-biosphere.webp",
          alt: "Pedagogiskt diagram som kopplar samman skogar, hav, jord, atmosfär och mikroorganismer genom fotosyntes, näringsämnen och kolets kretslopp.",
          caption:
            "Biosfären är sammanlänkad med jordens vatten, luft och berggrund. Liv och planet påverkar varandra genom många kretslopp.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "evolutionen-fortsatter",
        heading: "Evolutionen sker fortfarande",
        paragraphs: [
          "Evolution är förändringar i ärftliga egenskaper hos populationer över generationer. Mutationer, naturligt urval, genetisk drift och genflöde bidrar på olika sätt till denna utveckling.",
          "Hos organismer med kort generationstid kan forskare ibland följa evolutionära förändringar direkt. Antibiotikaresistens hos bakterier är ett tydligt exempel på hur ärftlig variation och naturligt urval samverkar.",
          "Evolutionen har inget förutbestämt mål. De arter som lever i dag är inte mer färdigutvecklade än tidigare livsformer – de är resultatet av miljarder år av förändring.",
        ],
      },
      {
        id: "framtidens-liv",
        heading: "Vilken framtid väntar livet?",
        paragraphs: [
          "Människans verksamhet förändrar i dag många ekosystem genom bland annat markanvändning, klimatförändringar, föroreningar och överutnyttjande av arter.",
          "Forskning visar att många arter och populationer minskar, men förändringarna varierar mellan olika grupper och områden. Samtidigt kan naturvård, restaurering och hållbar förvaltning förbättra förutsättningarna för biologisk mångfald.",
          "Livets framtid är inte bestämd. Precis som under tidigare epoker kommer organismer och ekosystem att fortsätta förändras – men våra handlingar påverkar vilka möjligheter som finns.",
        ],
      },
    ],
    facts: [
      "Allt känt cellulärt liv använder DNA som arvsmassa.",
      "Biologisk mångfald omfattar gener, arter och ekosystem.",
      "Mikroorganismer spelar avgörande roller i jordens ämneskretslopp.",
      "Evolutionen fortsätter hos både stora och små organismer.",
      "Många av jordens arter är ännu inte vetenskapligt beskrivna.",
    ],
    evidence: [
      "DNA-sekvenser som visar evolutionära släktskap mellan organismer.",
      "Observationer och inventeringar av arter och ekosystem.",
      "Experiment och långtidsstudier av evolutionära förändringar.",
      "Ekologiska mätningar av näringsvävar och biogeokemiska kretslopp.",
      "Fossil som kopplar samman dagens liv med tidigare evolutionära former.",
    ],
    uncertainties: [
      "Hur många arter som faktiskt finns på jorden.",
      "Hur stora delar av mikroorganismernas mångfald som ännu är okända.",
      "Hur framtida miljöförändringar påverkar olika ekosystem.",
      "Vilka evolutionära förändringar som kommer att ske i framtiden.",
    ],
    relatedIds: [
      "origin-life",
      "microbes",
      "photosynthesis",
      "eukaryotes",
      "multicellular",
      "biodiversity",
      "plants-today",
      "animals-today",
      "earth-today",
    ],
    sources: [
      {
        label:
          "IPBES – Global Assessment of Biodiversity and Ecosystem Services",
        url: "https://www.ipbes.net/global-assessment",
      },
      {
        label: "IUCN Red List",
        url: "https://www.iucnredlist.org/",
      },
      {
        label: "Catalogue of Life",
        url: "https://www.catalogueoflife.org/",
      },
      {
        label: "UC Museum of Paleontology – Understanding Evolution",
        url: "https://evolution.berkeley.edu/",
      },
    ],
  },
};
