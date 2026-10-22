import type { MilestoneArticleData } from "./types";

const credit = "AI-genererad illustration för The Unfolding Universe";

export const remainingEarthArticles: Record<string, MilestoneArticleData> = {
  "cretaceous-impact": {
    id: "cretaceous-impact",
    kicker: "KRITA · EN GLOBAL KATASTROF",
    lead: "För 66 miljoner år sedan träffade en stor asteroid jorden. Nedslaget lämnade en enorm krater och satte i gång en kedja av händelser som förändrade livet på planeten. Hur kan en enda kollision få konsekvenser över hela världen?",
    hero: {
      src: "/images/timeline/earth-final/cretaceous-impact-hero.webp",
      alt: "Konstnärlig rekonstruktion av en stor asteroid som slår ned i ett grunt hav nära en forntida kust.",
      caption:
        "Chicxulubnedslaget för 66 miljoner år sedan bidrog till en global ekologisk katastrof. Konstnärlig rekonstruktion.",
      credit,
      kind: "illustration",
    },
    atmosphere: {
      mode: "embers",
      intensity: "dramatic",
    },
    showcase: {
      src: "/images/timeline/showcases/impact-breccia.webp",
      title: "Impaktbreccia – spår av ett asteroidnedslag",
      description:
        "Impaktbreccia är en bergart som kan bildas vid kraftiga asteroidnedslag, när berggrunden krossas och fragment pressas samman. Sådana bergarter ger forskare viktiga ledtrådar om nedslagets enorma krafter. Konstnärlig illustration av ett bergartsprov, inte ett autentiskt prov från Chicxulub.",
      alt: "Konstnärlig museiillustration av en kantig impaktbreccia med mörk bergartsmassa och ljusa, grå och rostbruna stenfragment, placerad på en rund, polerad träplattform.",
    },
    sections: [
      {
        id: "nedslaget",
        heading: "Ett nedslag vid dagens Yucatán",
        paragraphs: [
          "För omkring 66 miljoner år sedan slog en asteroid med ungefär tio kilometers diameter ned i området vid dagens Yucatánhalvö i Mexiko. Kollisionen frigjorde en oerhörd mängd energi och skapade Chicxulubkratern, som är ungefär 180 kilometer bred.",
          "Berggrund kastades upp, smälte och förångades. När nedslagsmaterial spreds genom atmosfären kunde följderna märkas långt bortom själva kratern.",
          "Forskarna har återskapat händelseförloppet genom att undersöka kraterns struktur, bergarter som förändrats av extrema tryck och sediment från samma tid över hela världen.",
        ],
      },
      {
        id: "morkret",
        heading: "När solljuset försvann",
        paragraphs: [
          "Nedslaget förde upp stora mängder damm och andra partiklar i atmosfären. Sot från omfattande bränder kan också ha bidragit. Modeller visar att solljuset kan ha minskat kraftigt under en period, vilket påverkade temperaturen och fotosyntesen.",
          "När växter och plankton fick svårare att utnyttja solljuset påverkades näringskedjor både på land och i havet. Effekterna varierade mellan olika miljöer och organismgrupper.",
          "Det är fortfarande svårt att bestämma exakt hur länge mörkret varade och hur olika klimatprocesser samverkade.",
        ],
        image: {
          src: "/images/timeline/earth-final/chicxulub-aftermath.webp",
          alt: "Pedagogiskt diagram som visar asteroidnedslag, material i atmosfären, minskat solljus och störda näringskedjor.",
          caption:
            "Nedslaget kan ha orsakat kraftigt minskat solljus och omfattande förändringar i klimat och ekosystem. Diagrammet är en förenklad modell.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "spar",
        heading: "Spåren som finns kvar i berggrunden",
        paragraphs: [
          "Runt om i världen finns ett tunt lager från gränsen mellan krita och paleogen. På många platser innehåller det förhöjda halter av iridium, ett grundämne som är relativt ovanligt i jordskorpan men förekommer i meteoritiskt material.",
          "Forskare har också hittat chockad kvarts och små droppar av material som smälte vid nedslaget. Tillsammans med Chicxulubkratern ger fynden starka bevis för att en stor kollision ägde rum.",
          "Det är kombinationen av flera oberoende spår som gör slutsatsen så övertygande.",
        ],
      },
      {
        id: "utrotningen",
        heading: "En värld där många arter försvann",
        paragraphs: [
          "Krita–paleogen-utrotningen innebar att ungefär tre fjärdedelar av dåtidens arter försvann, även om andelen varierar mellan olika uppskattningar och grupper.",
          "Alla icke-flygande dinosaurier dog ut, medan fåglarna – som också är dinosaurier – överlevde. Även många marina organismer, däribland ammoniterna, försvann.",
          "Efter katastrofen förändrades ekosystemen. De grupper som överlevde fick med tiden möjlighet att sprida sig och utvecklas i nya riktningar.",
        ],
      },
      {
        id: "orsaker",
        heading: "Var nedslaget hela förklaringen?",
        paragraphs: [
          "Chicxulubnedslaget betraktas som den viktigaste omedelbara orsaken till massutrotningen. Samtidigt pågick omfattande vulkanism i Deccanområdet i nuvarande Indien kring denna tid.",
          "Forskarna undersöker hur vulkanismen kan ha påverkat klimat och ekosystem före och efter nedslaget. Det finns olika tolkningar av hur stor roll den spelade för själva utrotningen.",
          "Berättelsen visar hur jordens historia formas av både plötsliga katastrofer och långsammare förändringar.",
        ],
      },
    ],
    facts: [
      "Chicxulubkratern är ungefär 180 kilometer bred.",
      "Fåglar är den enda grupp dinosaurier som överlevde krita–paleogen-utrotningen.",
      "Ett iridiumrikt lager finns på många platser vid gränsen mellan krita och paleogen.",
      "Nedslaget inträffade för cirka 66 miljoner år sedan.",
    ],
    evidence: [
      "Chicxulubkraterns struktur och daterade bergarter.",
      "Iridiumanrikade gränslager i sediment från många delar av världen.",
      "Chockad kvarts och nedslagssmälta.",
      "Fossil som dokumenterar förändringar vid krita–paleogen-gränsen.",
    ],
    uncertainties: [
      "Hur länge solljuset minskade kraftigt efter nedslaget.",
      "Hur mycket Deccanvulkanismen påverkade den ekologiska krisen.",
      "Varför vissa organismgrupper överlevde bättre än andra.",
    ],
    relatedIds: ["pangaea-breakup", "himalayas", "earth-today"],
    sources: [
      {
        label: "NASA Earth Observatory – Chicxulub impact",
        url: "https://earthobservatory.nasa.gov/",
      },
      {
        label: "Smithsonian National Museum of Natural History",
        url: "https://naturalhistory.si.edu/",
      },
      {
        label: "USGS – Geology and geologic time",
        url: "https://www.usgs.gov/",
      },
    ],
  },
  himalayas: {
    id: "himalayas",
    kicker: "KENOZOIKUM · BERGSKEDJOR I RÖRELSE",
    lead: "Himalaya är ett av de tydligaste exemplen på att jordens yta fortfarande förändras. När den indiska kontinentalplattan kolliderade med Eurasien började berggrunden pressas samman och höjas – en process som pågår än i dag.",
    hero: {
      src: "/images/timeline/earth-final/himalayas-hero.webp",
      alt: "Vidsträckt vy över Himalayas snötäckta bergstoppar och djupa dalar i dramatiskt ljus.",
      caption:
        "Himalaya har formats av den långvariga kollisionen mellan Indien och Eurasien.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "resan-norrut",
        heading: "Indiens långa resa norrut",
        paragraphs: [
          "För många miljoner år sedan låg Indien längre söderut och var skilt från Eurasien av Tethyshavet. Den indiska kontinentalplattan rörde sig norrut när jordens plattor långsamt förflyttades.",
          "Kollisionen med Eurasien började ungefär för 50 miljoner år sedan, men forskare diskuterar hur den utvecklades och exakt när olika delar av kontinenternas marginaler möttes.",
          "Rörelsen upphörde inte när kontinenterna möttes. Den fortsatta sammanpressningen förändrar fortfarande berggrunden i området.",
        ],
      },
      {
        id: "bergen",
        heading: "När berggrunden veckas och pressas upp",
        paragraphs: [
          "Kontinental jordskorpa är relativt lätt jämfört med manteln och sjunker därför inte utan vidare ned i djupet vid en kollision. I stället kan den förkortas, förtjockas och skjutas över andra bergmassor längs stora förkastningar.",
          "Under miljontals år har sådana processer byggt upp Himalaya och den högt belägna tibetanska platån. Samtidigt bryter vatten, is och vind ned bergen och transporterar sediment bort från dem.",
          "Höjden på ett berg är därför resultatet av flera konkurrerande processer, inte bara av att jordskorpan lyfts.",
        ],
        image: {
          src: "/images/timeline/earth-final/himalaya-collision.webp",
          alt: "Tvärsnittsdiagram av den indiska och eurasiska kontinentalplattan som kolliderar och förtjockar jordskorpan.",
          caption:
            "Kollisionen mellan två kontinentalplattor pressar samman och förtjockar jordskorpan. Diagrammet är schematiskt.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "hav-pa-berg",
        heading: "Varför finns gamla havssediment högt uppe?",
        paragraphs: [
          "I delar av Himalaya finns bergarter som en gång bildades som sediment på botten av Tethyshavet. De kan innehålla fossil från organismer som levde i havet.",
          "När jordskorpan pressades samman och lyftes följde dessa sedimentära lager med uppåt. Fossilen hjälper forskare att förstå var bergarterna bildades och hur regionens geografi har förändrats.",
          "Att hitta spår av havsmiljöer högt över dagens havsnivå är därför inte ett mysterium, utan ett starkt exempel på plattektonikens kraft.",
        ],
      },
      {
        id: "jordbavningar",
        heading: "En bergskedja som fortfarande rör sig",
        paragraphs: [
          "Indien och Eurasien fortsätter att röra sig i förhållande till varandra. Spänningar byggs upp längs förkastningar och kan frigöras vid kraftiga jordbävningar.",
          "Satellitmätningar och GPS-stationer gör det möjligt att följa rörelserna med stor noggrannhet. Däremot kan forskarna inte förutsäga exakt när en enskild stor jordbävning kommer att inträffa.",
          "Himalaya påminner oss om att berg inte är färdiga monument. De är delar av ett pågående geologiskt förlopp.",
        ],
      },
      {
        id: "klimat",
        heading: "Bergen påverkar klimat och landskap",
        paragraphs: [
          "Himalaya påverkar vindar och nederbörd genom att tvinga luftmassor att stiga. Bergskedjan bidrar till stora skillnader mellan fuktiga och torra områden i Asien.",
          "Glaciärer och snö i höglandet lagrar vatten som har betydelse för många flodsystem. Förändringar i temperatur och nederbörd kan påverka hur mycket is som finns kvar.",
          "På mycket långa tidsskalor kan vittring av bergarter också samverka med jordens kolcykel och klimat, men sambanden är komplexa.",
        ],
      },
    ],
    facts: [
      "Himalaya har bildats genom kollisionen mellan den indiska och eurasiska kontinentalplattan.",
      "Havsfossil förekommer i bergarter som nu ligger högt över havet.",
      "Kontinenterna rör sig fortfarande, och området drabbas av jordbävningar.",
      "Upplyftning och erosion formar bergen samtidigt.",
    ],
    evidence: [
      "GPS- och satellitmätningar av plattrörelser.",
      "Geologisk kartläggning av veckningar och förkastningar.",
      "Havsfossil och sedimentära bergarter i bergskedjan.",
      "Seismiska mätningar av jordskorpans uppbyggnad.",
    ],
    uncertainties: [
      "Detaljerna i den tidigaste kollisionshistorien.",
      "Hur olika delar av bergskedjan kommer att förändras över lång tid.",
      "Hur upplyftning, vittring och klimat påverkat varandra genom historien.",
    ],
    relatedIds: ["plate-tectonics", "pangaea-breakup", "earth-today"],
    sources: [
      {
        label: "USGS – Plate tectonics",
        url: "https://www.usgs.gov/programs/earthquake-hazards/science/plate-tectonics",
      },
      {
        label: "NASA Earth Observatory",
        url: "https://earthobservatory.nasa.gov/",
      },
    ],
  },
  "ice-ages": {
    id: "ice-ages",
    kicker: "KVARTÄR · KLIMATET VÄXLAR",
    lead: "Under de senaste ungefär 2,6 miljoner åren har jorden upplevt återkommande kalla istider och varmare mellanistider. Isens utbredning har förändrat landskap, havsnivåer och livsmiljöer – och lämnat tydliga spår efter sig.",
    hero: {
      src: "/images/timeline/earth-final/ice-ages-hero.webp",
      alt: "Konstnärlig rekonstruktion av en vidsträckt istidsmiljö med inlandsis, tundra och snötäckta berg.",
      caption:
        "Kvartärperioden präglas av upprepade glaciala och interglaciala perioder.",
      credit,
      kind: "illustration",
    },
    atmosphere: {
      mode: "frost",
      intensity: "normal",
    },
    sections: [
      {
        id: "kvartar",
        heading: "En lång period med återkommande istider",
        paragraphs: [
          "Kvartärperioden började för cirka 2,58 miljoner år sedan. Under denna tid har stora inlandsisar upprepade gånger vuxit och dragit sig tillbaka på norra halvklotet.",
          "En istid, eller glacial, är en kallare fas med omfattande isutbredning. Mellanistiderna, som kallas interglacialer, är varmare perioder då stora delar av isen smälter.",
          "Vår egen tid är en mellanistid. Det betyder inte att jordens klimat alltid varit stabilt under de senaste tusentals åren.",
        ],
      },
      {
        id: "banor",
        heading: "Varför växlar klimatet?",
        paragraphs: [
          "Små förändringar i jordens bana runt solen, jordaxelns lutning och dess riktning påverkar hur solljuset fördelas över årstider och breddgrader. Dessa förändringar brukar kallas Milankovićcykler.",
          "Banvariationerna samverkar med återkopplingar i klimatsystemet, bland annat isens reflektionsförmåga, havens cirkulation och halterna av växthusgaser.",
          "Det är alltså inte en enda faktor som ensam förklarar hela växlingen mellan kalla och varma perioder.",
        ],
        image: {
          src: "/images/timeline/earth-final/glacial-cycles.webp",
          alt: "Pedagogiskt diagram över jordbanans variationer, istidernas återkomst och förändringar i isutbredning.",
          caption:
            "Jordbanans långsamma variationer påverkar fördelningen av solljus och samverkar med klimatets återkopplingar. Diagrammet är schematiskt.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "landskap",
        heading: "Isen skulpterar landskapet",
        paragraphs: [
          "När en inlandsis rör sig över berggrunden kan den slipa, bryta loss och transportera stenmaterial. Den lämnar efter sig bland annat rundhällar, morän och flyttblock.",
          "Smältvatten från isen kan bilda mäktiga avlagringar av sand och grus. Många svenska landskapsformer är resultatet av sådana processer under den senaste nedisningen.",
          "De geologiska spåren gör det möjligt att undersöka hur isen rörde sig och var dess gränser låg.",
        ],
      },
      {
        id: "havsniva",
        heading: "När vatten binds i is sjunker havet",
        paragraphs: [
          "Under kalla perioder lagras stora mängder vatten i inlandsisar. Då sjunker den globala havsnivån, och tidigare havsbottnar kan bli torra landområden.",
          "När isen smälter återvänder vatten till haven och havsnivån stiger. Samtidigt kan marken långsamt höjas där den tidigare varit nedtryckt av isens tyngd.",
          "Förändringarna påverkar kustlinjer, livsmiljöer och vilka landvägar som finns mellan olika områden.",
        ],
      },
      {
        id: "klimatarkiv",
        heading: "Hur vet vi hur klimatet varierade?",
        paragraphs: [
          "Iskärnor från Grönland och Antarktis innehåller lager av gammal snö och is. Luftbubblor och kemiska signaler ger information om tidigare atmosfär och temperaturförhållanden.",
          "Sediment på havsbottnen innehåller också mikroskopiska fossil och isotopsignaler som forskare använder för att rekonstruera förändringar under mycket lång tid.",
          "Genom att jämföra flera klimatarkiv kan forskarna bygga en mer tillförlitlig bild av jordens växlande klimat.",
        ],
      },
    ],
    facts: [
      "Kvartärperioden började för ungefär 2,58 miljoner år sedan.",
      "Jordens bana och axellutning varierar långsamt över tid.",
      "Inlandsisar kan både sänka havsnivån och pressa ned jordskorpan.",
      "Sverige har många landskapsformer som skapats av is och smältvatten.",
    ],
    evidence: [
      "Iskärnor med kemiska signaler och instängda luftbubblor.",
      "Havssediment och syreisotoper i mikrofossil.",
      "Moräner, isräfflor och andra glaciala landformer.",
      "Dateringar och modeller av tidigare isutbredning.",
    ],
    uncertainties: [
      "Hur olika återkopplingar påverkade enskilda istidscykler.",
      "Hur snabbt vissa stora inlandsisar växte eller smälte.",
      "Detaljerna i regionala klimatförändringar under äldre glacialer.",
    ],
    relatedIds: ["last-glacial-maximum", "holocene", "ordovician-ice"],
    sources: [
      {
        label: "NOAA – Paleoclimatology",
        url: "https://www.ncei.noaa.gov/products/paleoclimatology",
      },
      { label: "USGS – Climate and land change", url: "https://www.usgs.gov/" },
      {
        label: "NASA Earth Observatory – Climate",
        url: "https://earthobservatory.nasa.gov/",
      },
    ],
  },
  "last-glacial-maximum": {
    id: "last-glacial-maximum",
    kicker: "PLEISTOCEN · ISEN NÅR SIN STÖRSTA UTBREDNING",
    lead: "För omkring 20 000 år sedan var stora delar av norra Europa och Nordamerika täckta av mäktiga inlandsisar. Sverige låg till stor del under is, och havsnivån var betydligt lägre än i dag.",
    hero: {
      src: "/images/timeline/earth-final/last-glacial-maximum-hero.webp",
      alt: "Konstnärlig vy över en enorm inlandsis som täcker ett nordligt landskap under den senaste istidens kallaste skede.",
      caption:
        "Den senaste istidens största globala isutbredning inträffade ungefär för 26 000–19 000 år sedan.",
      credit,
      kind: "illustration",
    },
    atmosphere: {
      mode: "frost",
      intensity: "dramatic",
    },
    showcase: {
      src: "/images/timeline/showcases/glacial-striated-stone.webp",
      title: "Isräfflad sten – spår efter inlandsisen",
      description:
        "När inlandsisen rörde sig över berggrunden slipade stenar och grus i isens botten långa, parallella räfflor i berget. Dessa spår hjälper forskare att förstå hur inlandsisen rörde sig och hur landskapet formades. Konstnärlig illustration av ett isräfflat bergartsprov.",
      alt: "Konstnärlig museiillustration av en rundad grå sten med tydliga parallella isräfflor och en slät, slipad yta, placerad på en rund, polerad träplattform.",
    },
    sections: [
      {
        id: "istacke",
        heading: "Ett enormt istäcke över norra halvklotet",
        paragraphs: [
          "Den senaste istidens största utbredning brukar kallas Last Glacial Maximum, eller LGM. Den inträffade ungefär mellan 26 000 och 19 000 år sedan, även om tidpunkten för maximal isutbredning skilde sig mellan olika regioner.",
          "Den fennoskandiska inlandsisen täckte stora delar av norra Europa. På andra sidan Atlanten bredde stora inlandsisar ut sig över delar av Nordamerika.",
          "Isen kunde vara flera kilometer tjock i sina centrala delar. Dess tyngd pressade ned jordskorpan och förändrade hela landskapet.",
        ],
      },
      {
        id: "sverige",
        heading: "Sverige under isen",
        paragraphs: [
          "Stora delar av det område som i dag är Sverige låg under den fennoskandiska inlandsisen. Isen rörde sig långsamt och transporterade sten, grus och sand.",
          "När isen senare drog sig tillbaka lämnade den spår som morän, rundhällar, isräfflor och rullstensåsar. Dessa former finns fortfarande runt omkring oss.",
          "Landskapet vi känner igen i dag är alltså delvis ett resultat av processer som pågick under den senaste istiden.",
        ],
      },
      {
        id: "karta",
        heading: "En annan karta över världen",
        paragraphs: [
          "Så mycket vatten var bundet i inlandsisar att den globala havsnivån låg ungefär 120 meter lägre än i dag. Stora delar av kontinentalsocklarna låg då ovanför havsytan.",
          "Landförbindelser, som området Beringia mellan Asien och Nordamerika, blev möjliga när havsnivån var låg. Andra kustlinjer låg långt från dagens stränder.",
          "När klimatet senare värmdes upp smälte is och haven steg, vilket förändrade geografin på nytt.",
        ],
        image: {
          src: "/images/timeline/earth-final/last-glacial-map.webp",
          alt: "Schematisk karta över stora inlandsisar på norra halvklotet under den senaste istidens maximum och en jämförelse av havsnivåer.",
          caption:
            "Under den senaste istidens maximum täcktes stora landområden av is och den globala havsnivån låg omkring 120 meter lägre än i dag. Kartan är schematisk.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "livet",
        heading: "Livet utanför isen",
        paragraphs: [
          "Utanför inlandsisarnas gränser fanns stora områden med tundra och öppna, kalla gräsmarker. Växter och djur var anpassade till dessa miljöer.",
          "Mammutar och andra stora däggdjur levde i delar av den istida världen. Människor levde också under denna period och anpassade sina liv efter lokala förhållanden.",
          "Miljöerna såg olika ut på olika platser. Hela jorden var inte täckt av is, och även under den kallaste tiden fanns många varierade livsmiljöer.",
        ],
      },
      {
        id: "avsmaltning",
        heading: "När den stora avsmältningen började",
        paragraphs: [
          "Efter den senaste istidens maximum förändrades klimatet gradvis, med både varmare perioder och tillfälliga bakslag. Inlandsisarna började minska och smältvatten rann ut i hav och sjöar.",
          "Avsmältningen var inte jämn överallt. Vissa iskanter drog sig snabbt tillbaka, medan andra stod stilla eller ryckte fram under kortare perioder.",
          "Isens reträtt lade grunden till nya sjöar, kustlinjer och livsmiljöer – och till det landskap där människor senare byggde samhällen.",
        ],
      },
    ],
    facts: [
      "Den senaste istidens maximum omfattar ungefär 26 000–19 000 år sedan.",
      "Stora delar av Sverige låg under den fennoskandiska inlandsisen.",
      "Den globala havsnivån låg omkring 120 meter lägre än i dag.",
      "Moräner och isräfflor visar hur isen har rört sig.",
    ],
    evidence: [
      "Moränryggar, isräfflor och glaciala sediment.",
      "Dateringar av material som visar när isen täckte eller lämnade ett område.",
      "Havssediment och indikatorer på tidigare havsnivå.",
      "Modeller som jämförs med geologiska spår av isutbredning.",
    ],
    uncertainties: [
      "Den exakta tidpunkten för maximal isutbredning i olika regioner.",
      "Hur snabbt enskilda delar av inlandsisarna reagerade på klimatförändringar.",
      "Detaljer i istidens lokala växt- och djurliv.",
    ],
    relatedIds: ["ice-ages", "holocene", "earth-today"],
    sources: [
      {
        label: "SGU – Sveriges geologiska undersökning",
        url: "https://www.sgu.se/",
      },
      {
        label: "NOAA – Paleoclimatology",
        url: "https://www.ncei.noaa.gov/products/paleoclimatology",
      },
      {
        label: "NASA Earth Observatory",
        url: "https://earthobservatory.nasa.gov/",
      },
    ],
  },
  holocene: {
    id: "holocene",
    kicker: "HOLOCEN · VÅR MELLANISTID",
    lead: "För omkring 11 700 år sedan började holocen, den geologiska epok vi fortfarande lever i. Efter den senaste istiden förändrades klimatet, haven steg och nya landskap växte fram. Det blev också en tid då mänskliga samhällen förändrades på djupet.",
    hero: {
      src: "/images/timeline/earth-final/holocene-hero.webp",
      alt: "Ljust nordligt landskap med skogar, sjöar och floder som växer fram efter den senaste istiden.",
      caption:
        "Holocen inleddes efter den senaste istidens slut och kännetecknas av en varm mellanistid.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "borjan",
        heading: "När en ny geologisk epok började",
        paragraphs: [
          "Holocen började för ungefär 11 700 år sedan, när jorden gick in i den nuvarande mellanistiden efter en period av snabb klimatförändring.",
          "Gränsen till holocen kan identifieras i bland annat iskärnor från Grönland. Förändringar i isens kemiska sammansättning visar att klimatet övergick till varmare förhållanden.",
          "Holocen är en geologisk epok, inte ett löfte om att klimatet förblir oförändrat. Temperatur, nederbörd och havsnivå har fortsatt att variera.",
        ],
      },
      {
        id: "landskap",
        heading: "Skogar, sjöar och nya kuster",
        paragraphs: [
          "När inlandsisarna drog sig tillbaka blev mark tillgänglig för växter och djur. Olika växtarter spred sig i takt med att temperatur och andra miljöförhållanden förändrades.",
          "I norra Europa växte nya skogar fram. Sjöar och våtmarker bildades i sänkor som isen lämnat efter sig, och havens stränder förändrades när smältvatten tillfördes.",
          "Samtidigt började marken höja sig där den tidigare varit nedpressad av inlandsisarnas tyngd. Den landhöjningen pågår fortfarande på många platser.",
        ],
      },
      {
        id: "landhojning",
        heading: "Varför höjer sig marken i Sverige?",
        paragraphs: [
          "En stor inlandsis är så tung att den kan trycka ned jordskorpan. När isen försvinner börjar marken långsamt återhämta sig – en process som kallas postglacial landhöjning.",
          "I Sverige kan gamla strandlinjer därför ligga högt över dagens havsnivå. De berättar både om havets förändringar och om markens rörelse efter istiden.",
          "Landhöjningen går olika fort i olika områden och påverkar hur kusterna förändras över tid.",
        ],
        image: {
          src: "/images/timeline/earth-final/holocene-land-uplift.webp",
          alt: "Pedagogiskt tvärsnitt som visar hur en inlandsis pressar ned jordskorpan och hur marken höjer sig efter avsmältningen.",
          caption:
            "När inlandsisen smälte började jordskorpan återhämta sig från isens tyngd. Processen kallas postglacial landhöjning.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "manniskor",
        heading: "Människor i en föränderlig värld",
        paragraphs: [
          "Under holocen utvecklades jordbruk på flera platser i världen, och allt fler människor började leva i bofasta samhällen. Förändringarna skedde vid olika tider i olika regioner.",
          "Varmare förhållanden och nya landskap påverkade vilka växter, djur och resurser som fanns tillgängliga. Människors uppfinningar, kunskap och sociala förändringar spelade också avgörande roller.",
          "Människans historia under holocen är därför nära sammanflätad med miljön, men kan inte förklaras av klimatet ensamt.",
        ],
      },
      {
        id: "nutid",
        heading: "Holocen och klimatet i dag",
        paragraphs: [
          "Under de senaste århundradena har mänskliga utsläpp av växthusgaser orsakat en snabb global uppvärmning. Den utvecklingen skiljer sig från de långsamma banvariationer som bidragit till tidigare istidscykler.",
          "Forskare har diskuterat om människans påverkan motiverar en ny geologisk epok, antropocen. Begreppet används ofta i forskning och samhällsdebatt, men antropocen är inte en formellt ratificerad geologisk epok.",
          "Att förstå holocen hjälper oss att se hur jordens naturliga förändringar och dagens mänskliga påverkan förhåller sig till varandra.",
        ],
      },
    ],
    facts: [
      "Holocen började för ungefär 11 700 år sedan.",
      "Landhöjningen efter istiden pågår fortfarande i delar av Sverige.",
      "Jordbruk utvecklades på flera platser under holocen.",
      "Holocen är fortfarande den formella geologiska epok vi lever i.",
    ],
    evidence: [
      "Iskärnor som visar förändringen vid holocens början.",
      "Pollen och andra biologiska spår i sjö- och torvsediment.",
      "Gamla strandlinjer och daterade kustavlagringar.",
      "Arkeologiska fynd som visar hur människor levde och förändrade landskapet.",
    ],
    uncertainties: [
      "Hur regionala klimatvariationer påverkade olika samhällen.",
      "Hur snabbt vissa landskap förändrades efter isens reträtt.",
      "Hur framtida klimatförändringar påverkar långsiktiga geologiska processer.",
    ],
    relatedIds: ["last-glacial-maximum", "ice-ages", "earth-today"],
    sources: [
      {
        label: "International Commission on Stratigraphy",
        url: "https://stratigraphy.org/",
      },
      {
        label: "SGU – Sveriges geologiska undersökning",
        url: "https://www.sgu.se/",
      },
      {
        label: "NOAA – Paleoclimatology",
        url: "https://www.ncei.noaa.gov/products/paleoclimatology",
      },
    ],
  },
  "earth-today": {
    id: "earth-today",
    kicker: "NUTID · EN LEVANDE PLANET",
    lead: "Jordens historia är inte avslutad. Kontinenterna fortsätter att röra sig, berg nöts ned och byggs upp, hav förändras och klimatet påverkar allt levande. Vi bor på en planet som ständigt formas om.",
    hero: {
      src: "/images/timeline/earth-final/earth-today-hero.webp",
      alt: "Jorden sedd från rymden med blå hav, kontinenter, vita molnsystem och en tunn atmosfär.",
      caption: "Jorden är fortfarande geologiskt och klimatologiskt aktiv.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "rorelse",
        heading: "Kontinenterna står aldrig helt stilla",
        paragraphs: [
          "Jordens yttersta skal är uppdelat i tektoniska plattor som rör sig i förhållande till varandra. På många platser handlar det om några centimeter per år, ungefär samma storleksordning som en nagel växer.",
          "När plattor möts kan bergskedjor bildas och jordbävningar uppstå. Där plattor glider isär kan ny havsbotten skapas.",
          "Med satelliter och noggranna markmätningar kan forskare följa dessa rörelser direkt.",
        ],
      },
      {
        id: "jordens-krafter",
        heading: "Vulkaner, jordbävningar och nya landskap",
        paragraphs: [
          "Vulkaner för upp smält berg och gaser från jordens inre. Jordbävningar visar att spänningar i berggrunden fortfarande byggs upp och frigörs.",
          "Samtidigt bryter floder, glaciärer, vågor och vind ned landskap och flyttar sediment. Vissa processer går att se under en enda dag, andra blir tydliga först efter miljontals år.",
          "Det är samspelet mellan uppbyggnad och nedbrytning som gör jordytan så varierad.",
        ],
      },
      {
        id: "klimatet",
        heading: "Ett klimat i snabb förändring",
        paragraphs: [
          "Jordens klimat har alltid förändrats av naturliga orsaker. I dag sker dessutom en snabb global uppvärmning som huvudsakligen orsakas av människans utsläpp av växthusgaser.",
          "Haven tar upp en stor del av överskottsvärmen och påverkas även av ökad koldioxidhalt. Glaciärer och inlandsisar förlorar massa, och den globala havsnivån stiger.",
          "Genom att jämföra nutida mätningar med klimatarkiv från det förflutna kan forskare förstå både vad som är nytt och vad som har hänt tidigare.",
        ],
        image: {
          src: "/images/timeline/earth-final/earth-systems.webp",
          alt: "Pedagogisk illustration av jordens samverkande system: atmosfär, hav, is, land, inre geologi och liv.",
          caption:
            "Jordens olika system påverkar varandra. Förändringar i atmosfären, haven, isen, landytan och livet kan få följder långt utanför den plats där de börjar.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "livets-planet",
        heading: "En planet där geologi och liv samverkar",
        paragraphs: [
          "Livet påverkar jordens miljö genom bland annat fotosyntes, nedbrytning och biologiska kretslopp. Samtidigt bestämmer geologi, vatten och klimat vilka livsmiljöer som finns.",
          "Under miljarder år har atmosfären, haven och jordskorpan förändrats tillsammans med livets utveckling. Dagens ekosystem är resultatet av en mycket lång historia.",
          "När vi studerar jorden behöver vi därför se sambanden mellan levande organismer och planetens fysiska system.",
        ],
      },
      {
        id: "vattnets-vagar",
        heading: "Vattnets väg genom mark och växter",
        paragraphs: [
          "När regn når marken kan vattnet rinna vidare på ytan, tränga ned mellan jordpartiklar eller avdunsta. Hur vattnet fördelas påverkas bland annat av markens porer, vegetation, lutning och hur kraftigt det regnar.",
          "Växternas finaste rötter tar upp vatten från marken. Vattnet transporteras upp genom vedkärlen, xylemet, till stjälkar och blad. Där behövs det bland annat för fotosyntesen och för att cellerna ska behålla sin stadga.",
          "Mycket av vattnet lämnar sedan bladen som vattenånga genom klyvöppningarna. Den processen kallas transpiration. Samtidigt kan vatten som inte tas upp av växter fortsätta nedåt och bidra till att fylla på grundvattnet.",
        ],
      },
      {
        id: "framtiden",
        heading: "Hur ser jorden ut i framtiden?",
        paragraphs: [
          "På mycket lång sikt kommer kontinenterna att fortsätta förflytta sig. Nya hav kan öppnas, andra stängas och bergskedjor byggas upp eller eroderas bort.",
          "Forskare kan modellera möjliga framtida kontinentalmönster, men ju längre fram i tiden vi blickar, desto större blir osäkerheten om detaljerna.",
          "På kortare sikt har mänskliga beslut stor betydelse för utsläpp, naturmiljöer och hur samhällen anpassar sig till förändringar. Jordens historia fortsätter – och vi är en del av den.",
        ],
      },
    ],
    facts: [
      "Tektoniska plattor rör sig ofta några centimeter per år.",
      "Jordens hav, atmosfär, land, is och liv påverkar varandra.",
      "Satelliter kan mäta mycket små rörelser i jordskorpan.",
      "Människans utsläpp av växthusgaser är huvudorsaken till dagens globala uppvärmning.",
    ],
    evidence: [
      "GPS och satellitmätningar av plattrörelser och havsnivå.",
      "Seismiska observationer och vulkanologiska mätningar.",
      "Temperaturserier, havsobservationer och mätningar av växthusgaser.",
      "Geologiska lager och klimatarkiv som visar tidigare förändringar.",
    ],
    uncertainties: [
      "Hur kontinenterna kommer att vara placerade om hundratals miljoner år.",
      "Detaljer i framtida regionala klimat- och ekosystemförändringar.",
      "Hur olika återkopplingar mellan jordens system utvecklas över lång tid.",
    ],
    relatedIds: ["holocene", "plate-tectonics", "ice-ages"],
    sources: [
      { label: "NASA Science – Earth", url: "https://science.nasa.gov/earth/" },
      {
        label: "IPCC – Assessment Reports",
        url: "https://www.ipcc.ch/reports/",
      },
      { label: "USGS – Earth science", url: "https://www.usgs.gov/" },
    ],
  },
};
