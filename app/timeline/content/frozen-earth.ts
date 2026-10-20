import type { MilestoneArticleData } from "./types";

const credit = "AI-genererad illustration för The Unfolding Universe";

export const frozenEarthArticles: Record<string, MilestoneArticleData> = {
  huronian: {
    id: "huronian",
    kicker: "PALEOPROTEROZOIKUM · JORDENS TIDIGA ISTIDER",
    lead: "Föreställ dig en jord där stora ismassor breder ut sig över landskapet – långt innan djur och växter fanns på land. För omkring 2,4–2,1 miljarder år sedan inträffade flera omfattande nedisningar. Spåren finns fortfarande kvar i uråldriga bergarter.",
    hero: {
      src: "/images/timeline/frozen-earth/huronian-hero.webp",
      alt: "Konstnärlig rekonstruktion av ett uråldrigt islandskap med väldiga glaciärer, mörka klippor och ett delvis istäckt hav.",
      caption:
        "Under den huroniska istidsperioden, för omkring 2,4–2,1 miljarder år sedan, drabbades jorden av omfattande nedisningar. Landskapets utseende är en konstnärlig tolkning.",
      credit: "AI-genererad illustration för The Unfolding Universe",
      kind: "illustration",
    },
    atmosphere: {
      mode: "frost",
      intensity: "subtle",
    },

    showcase: {
      src: "/images/timeline/showcases/huronian-tillite.webp",
      title: "Tillit – spår av uråldrig is",
      description:
        "Tillit är en bergart som kan bildas när osorterade sediment från glaciärer hårdnar till sten. Inneslutna stenfragment ger forskare ledtrådar om forntida nedisningar. Konstnärlig illustration, inte ett autentiskt huroniskt bergartsprov.",
      alt: "Illustrerad tillit med stenar av olika storlekar inbäddade i en mörk bergart, placerad på en polerad träplattform.",
    },

    sections: [
      {
        id: "gammal-kyla",
        heading: "En istid långt före dinosaurierna",
        paragraphs: [
          "När vi tänker på istider föreställer vi oss kanske mammutar och is över norra Europa. Men jordens historia innehåller mycket äldre kalla perioder. De huroniska nedisningarna inträffade för ungefär 2,4–2,1 miljarder år sedan, under en tid då livet främst bestod av mikroorganismer.",
          "Namnet kommer från geologiska avlagringar i området kring Huronsjön i Nordamerika. Där och på andra platser finns bergarter som vittnar om upprepade perioder med is.",
          "Det rörde sig inte nödvändigtvis om en enda sammanhängande istid. Forskare identifierar flera nedisningsepisoder, åtskilda av perioder då klimatet kan ha varit mildare.",
        ],
      },
      {
        id: "spar-i-stenen",
        heading: "Hur kan en sten avslöja en glaciär?",
        paragraphs: [
          "Glaciärer transporterar stenblock, grus och finare material. När isen smälter kan allt detta lämnas kvar i osorterade avlagringar, som med tiden pressas samman till bergarter. Sådana bergarter kallas ibland tilliter när de har sitt ursprung i glaciala sediment.",
          "I vissa sedimentlager kan stora stenar ligga inbäddade i betydligt finare material. De kan ha fallit ned från flytande is. Andra ledtrådar är repor i äldre bergytor och karakteristiska sedimentstrukturer.",
          "Ingen enskild struktur är alltid ett säkert bevis. Därför väger geologer samman flera observationer innan de drar slutsatsen att en mycket gammal bergart bildades i en glacial miljö.",
        ],
        image: {
          src: "/images/timeline/frozen-earth/huronian-evidence.webp",
          alt: "Pedagogisk illustration av glaciala spår i berggrunden, med morän, isräfflor, flyttblock och sediment avsatta av smältvatten.",
          caption:
            "Glaciärer kan lämna spår i form av osorterade sediment, räfflad berggrund och transporterade stenblock. Liknande typer av geologiska spår hjälper forskare att undersöka mycket gamla nedisningar.",
          credit:
            "AI-genererad pedagogisk illustration för The Unfolding Universe",
          kind: "diagram",
        },
      },
      {
        id: "syre-och-metan",
        heading: "Kan syre ha gjort jorden kallare?",
        paragraphs: [
          "Ungefär under samma breda tidsperiod förändrades jordens atmosfär kraftigt. Syre, som producerades genom fotosyntes hos mikroorganismer, började ansamlas i större mängder. Förändringen brukar kallas den stora syresättningshändelsen.",
          "En möjlig förklaring till nedkylningen är att mer syre bidrog till att minska mängden metan i atmosfären. Metan är en kraftfull växthusgas, och mindre metan kan ha försvagat växthuseffekten.",
          "Men sambandet mellan syresättning och nedisning är inte fullständigt klarlagt. Även vulkanism, vittring, kontinenter och förändringar i andra växthusgaser kan ha påverkat klimatet.",
        ],
      },
      {
        id: "hur-mycket-is",
        heading: "Hur långt sträckte sig isen?",
        paragraphs: [
          "Vi vet att det fanns omfattande nedisningar, men det är mycket svårare att avgöra exakt hur stor del av jorden som täcktes av is. De gamla bergarterna har flyttats, deformerats och ibland förstörts under miljarder år.",
          "Forskare försöker uppskatta forntida breddgrader genom att studera magnetiska signaler i bergarter. Det kan ge ledtrådar om var glaciala avlagringar en gång bildades.",
          "Resultaten behöver tolkas försiktigt. Att hitta isspår från en viss plats betyder inte automatiskt att hela planeten var frusen.",
        ],
      },
      {
        id: "varfor-viktigt",
        heading: "En planet där livet ändå fortsatte",
        paragraphs: [
          "Trots kylan fortsatte mikroorganismer att existera och utvecklas. Hav, iskanter och miljöer där flytande vatten fanns kan ha erbjudit livsmiljöer även under kalla perioder.",
          "De huroniska nedisningarna visar hur nära kopplade jordens atmosfär, klimat, berggrund och tidiga liv var till varandra.",
          "När vi studerar dessa händelser lär vi oss också något större: jordens klimat har förändrats dramatiskt många gånger, men orsakerna måste förstås utifrån förhållandena vid just den tiden.",
        ],
      },
    ],
    facts: [
      "De huroniska nedisningarna ägde rum för ungefär 2,4–2,1 miljarder år sedan.",
      "Glaciala avlagringar kan bevaras som bergarter i miljarder år.",
      "Nedisningarna inträffade nära den tid då syre började öka i atmosfären.",
      "Jordens liv bestod då främst av mikroorganismer.",
    ],
    evidence: [
      "Glacialt tolkade sedimentbergarter i mycket gamla lagerföljder.",
      "Sedimentstrukturer och stenar som kan ha transporterats av is.",
      "Radiometriska dateringar som avgränsar avlagringarnas ålder.",
      "Geokemiska och paleomagnetiska analyser av dåtidens miljöer.",
    ],
    uncertainties: [
      "Hur många separata nedisningar som inträffade och hur länge varje episod varade.",
      "Hur nära ekvatorn isen nådde.",
      "Hur stor roll förändringar i metan, syre och andra klimatfaktorer spelade.",
    ],
    relatedIds: ["plate-tectonics", "snowball", "rodinia"],
    sources: [
      {
        label: "Encyclopaedia Britannica – Huronian glaciation",
        url: "https://www.britannica.com/science/Huronian-Glaciation",
      },
      {
        label: "NASA Earth Observatory – The Great Oxidation Event",
        url: "https://earthobservatory.nasa.gov/",
      },
    ],
  },
  rodinia: {
    id: "rodinia",
    kicker: "NEOPROTEROZOIKUM · EN VÄRLD AV SAMLADE KONTINENTER",
    lead: "Långt före Pangea fanns en annan enorm landmassa: Rodinia. För omkring en miljard år sedan hade stora delar av jordens kontinenter samlats. Hur kan forskare pussla ihop en värld som sedan länge har spruckit sönder?",

    hero: {
      src: "/images/timeline/frozen-earth/rodinia-hero.webp",
      alt: "Konstnärlig vy från hög höjd över en uråldrig superkontinent med bergskedjor, kuster och omgivande hav.",
      caption:
        "Rodinia var en superkontinent som existerade långt före Pangea. Dess exakta utseende och kontinenternas placering är fortfarande föremål för forskning.",
      credit:
        "AI-genererad konstnärlig rekonstruktion för The Unfolding Universe",
      kind: "illustration",
    },

    sections: [
      {
        id: "superkontinent",
        heading: "Vad är en superkontinent?",
        paragraphs: [
          "Jordens kontinenter står inte stilla. De rör sig långsamt med de tektoniska plattorna och kan under mycket lång tid kollidera, växa samman och sedan skiljas åt igen.",
          "När en mycket stor andel av kontinental jordskorpa samlas i en sammanhängande landmassa talar forskare om en superkontinent. Rodinia är en av de viktigaste kända superkontinenterna från tiden före det mer välbekanta Pangea.",
          "Namnet Rodinia brukar kopplas till ett ord för hemland eller födelseplats. Men hur den faktiskt såg ut vet vi inte med säkerhet.",
        ],
      },
      {
        id: "sammanfogning",
        heading: "När kontinenterna möttes",
        paragraphs: [
          "Rodinia byggdes upp genom en lång rad kontinentkollisioner under den senare delen av mesoproterozoikum och början av neoproterozoikum. Ofta anges att superkontinenten var samlad för ungefär en miljard år sedan.",
          "När kontinenter kolliderar kan bergskedjor bildas. Gamla berggrundsbälten på skilda kontinenter kan därför vara rester av samma långvariga bergskedjebildning.",
          "Forskarna jämför sådana bergarter för att försöka förstå vilka delar av dagens kontinenter som en gång låg intill varandra.",
        ],

        image: {
          src: "/images/timeline/frozen-earth/rodinia-map.webp",
          alt: "Konstnärlig och schematisk illustration av superkontinenten Rodinia, med möjliga placeringar av uråldriga kontinentalblock och förklaringar av geologiska undersökningsmetoder.",
          caption:
            "Rodinias utseende rekonstrueras med hjälp av bland annat berggrundens ålder, paleomagnetiska mätningar och geologiska samband mellan kontinenter. Bildens geografi är illustrativ och ska inte tolkas som en exakt vetenskaplig karta.",
          credit:
            "AI-genererad schematisk illustration för The Unfolding Universe",
          kind: "diagram",
        },
      },
      {
        id: "pusslet",
        heading: "Ett geologiskt pussel utan färdig bild",
        paragraphs: [
          "Vi har inga fotografier eller kartor från Rodinias tid. I stället använder forskarna bergarternas åldrar, kemiska sammansättning och spår efter gamla bergskedjor.",
          "Magnetiska mineral kan ibland bevara information om vilken breddgrad en bergart hade när den bildades. Det kallas paleomagnetism och hjälper forskare att pröva olika rekonstruktioner.",
          "Det finns flera konkurrerande modeller för hur Rodinia var sammansatt. De skiljer sig särskilt åt i placeringen av vissa kontinentfragment. Därför bör kartor över Rodinia ses som vetenskapliga hypoteser, inte exakta avbildningar.",
        ],
      },
      {
        id: "uppbrottet",
        heading: "När jättelandet började spricka",
        paragraphs: [
          "En superkontinent är inte permanent. Rörelser i jordens inre fortsätter även när stora landmassor sitter ihop. Med tiden kan jordskorpan tänjas ut och spricka.",
          "Rodinia började brytas upp under neoproterozoikum, men tidpunkterna varierade mellan olika delar av superkontinenten. Nya havsbassänger kunde öppnas när kontinenter gled isär.",
          "Uppbrottet förändrade kustlinjer, havsströmmar och förutsättningarna för vittring av bergarter. Hur starkt dessa förändringar påverkade det globala klimatet diskuteras fortfarande.",
        ],
      },
      {
        id: "klimat-och-liv",
        heading: "Varför spelar Rodinia roll för jordens historia?",
        paragraphs: [
          "Hur kontinenterna ligger påverkar hur havsvatten cirkulerar, hur bergarter vittrar och hur ämnen transporteras mellan land och hav.",
          "Rodinias uppbrott skedde före och delvis under en tid då jorden upplevde mycket omfattande nedisningar. Vissa forskare undersöker om nya kontinentlägen och ökad vittring kan ha bidragit till klimatförändringarna.",
          "Rodinia är därför mer än ett pussel om landmassor. Den hjälper oss att förstå sambanden mellan plattektonik, hav, atmosfär och de miljöer där livet utvecklades.",
        ],
      },
    ],
    facts: [
      "Rodinia fanns långt före superkontinenten Pangea.",
      "Superkontinenten var i stora drag samlad för omkring en miljard år sedan.",
      "Flera olika vetenskapliga rekonstruktioner av Rodinia används i forskningen.",
      "Gamla bergskedjor kan avslöja var kontinenter tidigare möttes.",
    ],
    evidence: [
      "Åldrar och sammansättning hos bergarter från olika kontinenter.",
      "Matchande bergskedjebälten och spår av gamla kollisioner.",
      "Paleomagnetiska mätningar som begränsar möjliga kontinentlägen.",
      "Geologiska spår av kontinental uppsprickning och nya havsbassänger.",
    ],
    uncertainties: [
      "Exakt hur alla Rodinias kontinentfragment låg i förhållande till varandra.",
      "När olika delar av superkontinenten förenades och senare skildes åt.",
      "Hur mycket Rodinias uppbrott påverkade klimatet inför de kryogeniska nedisningarna.",
    ],
    relatedIds: ["continents", "plate-tectonics", "snowball", "gondwana"],
    sources: [
      {
        label: "Encyclopaedia Britannica – Rodinia",
        url: "https://www.britannica.com/place/Rodinia",
      },
      {
        label: "USGS – This Dynamic Earth",
        url: "https://pubs.usgs.gov/gip/dynamic/dynamic.html",
      },
    ],
  },
  snowball: {
    id: "snowball",
    kicker: "KRYOGENIUM · NÄR ISEN TOG ÖVER",
    lead: "Kan nästan hela jorden ha varit täckt av is? Under kryogenium, för ungefär 720–635 miljoner år sedan, inträffade två av de mest omfattande kända nedisningarna. Bergarter från hela världen avslöjar en planet som genomgick extrema klimatförändringar.",

    hero: {
      src: "/images/timeline/frozen-earth/snowball-hero.webp",
      alt: "Konstnärlig rekonstruktion av en nästan helt istäckt jord sedd från rymden, med enorma isfält, mörka havsområden och solljus vid horisonten.",
      caption:
        "Under kryogenium, för omkring 720–635 miljoner år sedan, upplevde jorden flera extrema nedisningar. Hur omfattande istäcket var är fortfarande omdiskuterat.",
      credit:
        "AI-genererad konstnärlig rekonstruktion för The Unfolding Universe",
      kind: "illustration",
    },
    atmosphere: {
      mode: "frost",
      intensity: "dramatic",
    },
    sections: [
      {
        id: "tva-nedisningar",
        heading: "Två stora nedisningar förändrade planeten",
        paragraphs: [
          "Under perioden kryogenium drabbades jorden av åtminstone två mycket omfattande nedisningar: den sturtiska och den marinoanska. De brukar ungefär placeras mellan 717–659 respektive 650–635 miljoner år sedan, även om dateringar och gränser fortsätter att förfinas.",
          "Glaciala sediment från denna tid finns på många kontinenter. Vissa av dem tycks ha avsatts på mycket låga breddgrader, nära dåtidens ekvator.",
          "Det är ett häpnadsväckande fynd. Om is kunde finnas i tropiska områden måste jordens klimatsystem ha fungerat på ett mycket annorlunda sätt än i dag.",
        ],
      },
      {
        id: "snoeboll-eller-sorbetsjord",
        heading: "Snöbollsjord eller öppna hav?",
        paragraphs: [
          "Enligt den mest extrema snöbollsjordshypotesen täcktes nästan hela havsytan av is. När ljus is ersätter mörkt hav reflekteras mer solljus tillbaka ut i rymden. Det kan förstärka nedkylningen i en återkoppling som kallas is–albedoeffekten.",
          "Andra modeller föreslår att vissa havsområden kan ha förblivit öppna eller haft tunnare, rörligare is. Sådana alternativ kallas ibland för en mer slaskig eller sorbetliknande jord.",
          "Forskarna är överens om att nedisningarna var mycket omfattande, men exakt hur mycket öppet vatten som fanns är fortfarande omdiskuterat.",
        ],

        image: {
          src: "/images/timeline/frozen-earth/snowball-albedo.webp",
          alt: "Vetenskaplig infografik i fyra steg som visar hur nedkylning leder till växande istäcken, ökad reflektion av solljus och ytterligare nedkylning, samt hur växthusgaser kan bidra till avsmältning.",
          caption:
            "Is–albedo-återkopplingen kan förstärka en global nedkylning: mer is reflekterar mer solljus, vilket gör planeten ännu kallare. På lång sikt kan bland annat ansamling av vulkanisk koldioxid bidra till att klimatet värms och isen smälter.",
          credit:
            "AI-genererad pedagogisk illustration för The Unfolding Universe",
          kind: "diagram",
        },
      },
      {
        id: "spar-i-berget",
        heading: "Hur vet vi att isen nådde så långt?",
        paragraphs: [
          "Glaciärer lämnar efter sig särskilda sediment. När dessa bevaras som bergarter kan geologer känna igen spår av istransport och avlagringar som bildats nära glaciärer.",
          "Paleomagnetiska analyser av vissa bergarter tyder på att glaciala avlagringar bildades på låga breddgrader. Det är en central del av argumenten för att isen nådde långt mot ekvatorn.",
          "På flera platser följs glaciala lager av särskilda karbonatbergarter, så kallade täckkarbonater. De kan ge ledtrådar om de snabba förändringar i hav och atmosfär som skedde när nedisningen upphörde.",
        ],
      },
      {
        id: "tining",
        heading: "Hur kunde jorden tina upp igen?",
        paragraphs: [
          "Även på en mycket kall planet fortsätter vulkaner att släppa ut koldioxid. Om stora delar av jordens yta är isklädda kan vittringen av bergarter, som annars hjälper till att ta bort koldioxid ur atmosfären, minska kraftigt.",
          "I flera modeller leder detta till att koldioxid långsamt byggs upp och förstärker växthuseffekten. Till slut kan uppvärmningen bli tillräckligt stark för att omfattande avsmältning ska börja.",
          "Det exakta förloppet är osäkert. Men spåren i sedimenten visar att övergången från glaciala till varmare miljöer kunde innebära stora förändringar i havens kemi.",
        ],
      },
      {
        id: "livet",
        heading: "Vad hände med livet under isen?",
        paragraphs: [
          "Livet fanns redan långt före de kryogeniska nedisningarna. Mikroorganismer och olika eukaryota organismer hade utvecklats, även om de flesta levde i havsmiljöer.",
          "Om haven till stor del frös måste livet ha klarat sig i miljöer där flytande vatten och energi fortfarande fanns. Möjliga tillflyktsorter kan ha varit öppna vattenytor, områden under tunn is och miljöer nära hydrotermala källor.",
          "Efter kryogenium följde stora miljöförändringar, och senare under ediakaraperioden finns spår av mer komplexa organismer. Men forskarna kan inte enkelt säga att istiderna i sig orsakade denna utveckling.",
        ],
      },
    ],
    facts: [
      "Kryogenium sträckte sig från omkring 720 till 635 miljoner år sedan.",
      "De två stora nedisningarna kallas den sturtiska och den marinoanska.",
      "Vissa glaciala avlagringar tycks ha bildats nära dåtidens ekvator.",
      "Is reflekterar mer solljus än öppet hav och kan därmed förstärka nedkylning.",
    ],
    evidence: [
      "Glaciala sedimentbergarter på flera kontinenter.",
      "Paleomagnetiska data som tyder på isbildning vid låga breddgrader.",
      "Täckkarbonater ovanpå glaciala lager i flera geologiska sekvenser.",
      "Radiometriska dateringar, geokemiska mätningar och klimatmodeller.",
    ],
    uncertainties: [
      "Om havsytan var nästan helt frusen eller om betydande öppna vattenytor fanns kvar.",
      "Hur snabbt och genom vilka mekanismer de stora nedisningarna avslutades.",
      "Hur livet överlevde och hur klimatförändringarna påverkade den senare biologiska utvecklingen.",
    ],
    relatedIds: ["huronian", "rodinia", "ediacaran-earth", "gondwana"],
    sources: [
      {
        label: "Encyclopaedia Britannica – Cryogenian Period",
        url: "https://www.britannica.com/science/Cryogenian-Period",
      },
      {
        label: "NASA Earth Observatory – Snowball Earth",
        url: "https://earthobservatory.nasa.gov/features/SnowballEarth",
      },
      {
        label:
          "International Commission on Stratigraphy – International Chronostratigraphic Chart",
        url: "https://stratigraphy.org/chart",
      },
    ],
  },
};
