import type { MilestoneArticleData } from "./types";

const credit = "Konstnärlig rekonstruktion för The Unfolding Universe";

export const lifeAwakensArticles: Record<string, MilestoneArticleData> = {
  "origin-life": {
    id: "origin-life",
    kicker: "ARKAIKUM · LIVETS STORA MYSTERIUM",
    lead: "Någon gång på den unga jorden började kemi utvecklas till något vi skulle kalla liv. Men när skedde det, var hände det och vilka steg krävdes? Forskare söker fortfarande svar i bergarter, laboratorier och livets egen kemi.",
    hero: {
      src: "/images/timeline/life-awakens/origin-life-hero.webp",
      alt: "Konstnärlig rekonstruktion av den unga jordens kust med vulkaniska öar, dimma och ett stilla urhav.",
      caption: "Den unga jorden hade vatten och energikällor, men vi vet inte var livet först uppstod.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "vad-ar-liv",
        heading: "När blir kemi till liv?",
        paragraphs: [
          "Levande organismer kan bland annat använda energi, upprätthålla en inre miljö och föra vidare ärftlig information. Men gränsen mellan avancerad kemi och de första levande systemen är svår att dra.",
          "Dagens celler är mycket komplexa. De har membran, molekyler som lagrar information och kemiska reaktioner som samverkar. Det första livet behöver inte ha sett ut som någon organism som finns i dag.",
          "Forskningen om livets uppkomst undersöker hur enklare kemiska system kan ha utvecklat några av dessa egenskaper steg för steg. Ingen fullständig väg från icke-levande kemi till den första cellen är ännu fastställd.",
        ],
      },
      {
        id: "ingredienser",
        heading: "Vatten, byggstenar och energi",
        paragraphs: [
          "Flytande vatten gör det möjligt för många ämnen att lösas upp, mötas och reagera. På den tidiga jorden fanns dessutom mineral, gaser och energikällor som solljus, geotermisk värme och kemiska skillnader mellan olika miljöer.",
          "Organiska molekyler kan bildas genom naturliga kemiska processer. Vissa kan också ha tillförts av meteoriter. Men att organiska byggstenar finns betyder inte i sig att liv har uppstått.",
          "En viktig fråga är hur molekyler kunde koncentreras, reagera med varandra och bilda system som blev mer beständiga och kunde förändras över generationer.",
        ],
      },
      {
        id: "miljoer",
        heading: "Var kan de första stegen ha tagits?",
        paragraphs: [
          "En hypotes handlar om hydrotermala miljöer på havsbottnen. Där kan mineralrika vätskor och kemiska gradienter ha skapat förutsättningar för reaktioner som senare blev viktiga för livet.",
          "Andra hypoteser undersöker grunda vattenpölar, varma källor och platser där upprepad uttorkning och återvätning kan ha hjälpt molekyler att reagera och byggas samman.",
          "Det finns också idéer om att mineralytor eller naturliga små hålrum kan ha fungerat som enkla avgränsade reaktionsmiljöer. Flera olika miljöer kan ha bidragit, och vi vet ännu inte vilken som var avgörande.",
        ],
        image: {
          src: "/images/timeline/life-awakens/origin-life-environments.webp",
          alt: "Pedagogisk jämförelse mellan hydrotermala källor på havsbottnen, grunda vattenmiljöer och mineralrika porer som möjliga miljöer för livets uppkomst.",
          caption: "Forskare undersöker flera möjliga miljöer för livets uppkomst. Illustrationens alternativ är hypoteser, inte bevisade födelseplatser.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "information",
        heading: "Hur kunde något börja ärvas?",
        paragraphs: [
          "För att evolution genom naturligt urval ska kunna ske måste information eller egenskaper kunna föras vidare med variation. Hur sådan ärftlighet uppstod är en central fråga.",
          "Den så kallade RNA-världshypotesen föreslår att RNA-liknande molekyler kan ha haft tidiga roller både som informationsbärare och som hjälp vid kemiska reaktioner.",
          "Andra forskningsspår betonar självorganiserande kemiska nätverk, enkla membran eller ämnesomsättning före dagens genetiska system. Hypoteserna behöver inte utesluta varandra.",
        ],
      },
      {
        id: "tidslinje",
        heading: "När började livet?",
        paragraphs: [
          "Vi känner inte till något säkert datum för livets uppkomst. Att det finns mycket gamla spår som tolkas som biologiska visar att livet redan hade etablerats när dessa spår bildades, men inte hur långt tidigare det började.",
          "Vissa mycket gamla fynd och kemiska signaler har föreslagits som tecken på ännu äldre liv. Sådana tolkningar är omdiskuterade eftersom geologiska processer ibland kan skapa liknande mönster.",
          "Därför är livets ursprung en öppen vetenskaplig fråga. Nästa kapitel handlar om hur forskare försöker känna igen de första spåren i jordens uråldriga bergarter.",
        ],
      },
    ],
    facts: [
      "Ingen vet exakt när eller var livet först uppstod på jorden.",
      "Organiska molekyler kan bildas utan att levande organismer är inblandade.",
      "RNA kan både bära information och delta i kemiska reaktioner.",
      "Forskare prövar flera hypoteser om hur enkla kemiska system blev levande.",
    ],
    evidence: [
      "Laboratorieförsök med prebiotiska kemiska reaktioner.",
      "Studier av organiska molekyler och mineral i geologiska miljöer.",
      "Jämförelser mellan grundläggande kemiska processer hos dagens organismer.",
      "Geologiska belägg för vatten och miljöer på den tidiga jorden.",
    ],
    uncertainties: [
      "När och var de första levande systemen uppstod.",
      "Vilken roll RNA, membran och tidig ämnesomsättning hade.",
      "Om liv uppstod en enda gång eller om flera tidiga system existerade.",
    ],
    relatedIds: ["microbes", "stromatolites", "oceans"],
    sources: [
      { label: "NASA Astrobiology – Life's Origins", url: "https://astrobiology.nasa.gov/" },
      { label: "NASA Science – Astrobiology", url: "https://science.nasa.gov/astrobiology/" },
      { label: "Encyclopaedia Britannica – Origin of life", url: "https://www.britannica.com/science/origin-of-life" },
    ],
  },
  microbes: {
    id: "microbes",
    kicker: "ARKAIKUM · DE ÄLDSTA BIOLOGISKA LEDTRÅDARNA",
    lead: "De första organismerna lämnade inga ben eller skal. Ändå finns spår i mycket gamla bergarter som kan berätta att mikroskopiskt liv redan hade etablerats för minst omkring 3,5 miljarder år sedan.",
    hero: {
      src: "/images/timeline/life-awakens/microbes-hero.webp",
      alt: "Konstnärlig rekonstruktion av grunda urhav med tunna mikrobiella mattor över sediment och stenar.",
      caption: "Mikroorganismer kan ha bildat samhällen på havsbottnar långt innan djur och växter utvecklades.",
      credit,
      kind: "illustration",
    },
    sections: [
      {
        id: "sparen",
        heading: "Spår som nästan har försvunnit",
        paragraphs: [
          "Mikroorganismer är små och har oftast inga hårda delar som lätt fossiliseras. Dessutom har jordens äldsta bergarter ofta utsatts för högt tryck, värme och kemisk omvandling.",
          "Forskare letar därför inte bara efter former som liknar celler. De undersöker också lagerstrukturer, mineral och kemiska signaturer som kan ha påverkats av levande organismer.",
          "Ett enskilt tecken räcker sällan. Det är när flera oberoende ledtrådar pekar åt samma håll som tolkningen blir starkare.",
        ],
      },
      {
        id: "gamla-bergarter",
        heading: "Vad berättar de äldsta bergarterna?",
        paragraphs: [
          "Bergarter från bland annat västra Australien och södra Afrika innehåller mycket gamla strukturer och kemiska signaler som forskare har tolkat som möjliga eller sannolika spår av mikrobiellt liv.",
          "Fynd från omkring 3,5 miljarder år sedan har haft stor betydelse, men detaljerna i enskilda fynd diskuteras fortfarande. Vissa ännu äldre påstådda spår är särskilt omstridda.",
          "Att avgöra om en struktur verkligen bildades av liv kräver noggranna studier av hur bergarten uppstod och förändrades efteråt.",
        ],
      },
      {
        id: "biosignaturer",
        heading: "Hur känner forskarna igen liv?",
        paragraphs: [
          "En biosignatur är ett mönster eller ämne som kan tyda på biologisk aktivitet. Det kan handla om mikroskopiska former, kolhaltigt material eller ovanliga fördelningar av olika isotoper.",
          "Levande organismer kan föredra vissa isotoper vid kemiska reaktioner. Men liknande signaler kan ibland uppstå utan liv, särskilt när bergarter förändras under lång tid.",
          "Därför kombinerar forskare mikroskopi, kemiska analyser och geologisk kontext innan de drar slutsatser om ett mycket gammalt fynd.",
        ],
        image: {
          src: "/images/timeline/life-awakens/earliest-life-evidence.webp",
          alt: "Pedagogiskt diagram med tre typer av möjliga biosignaturer i gamla bergarter: mikroskopiska strukturer, skiktade sediment och kemiska isotopsignaler.",
          caption: "Forskare söker flera sorters biosignaturer. Ingen enskild form eller kemisk signal bevisar automatiskt att liv funnits.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "mikrobiell-varld",
        heading: "En planet som tillhörde mikroberna",
        paragraphs: [
          "Under en mycket stor del av jordens historia bestod livet av mikroorganismer. De kunde leva i vatten, på sedimentytor och i miljöer där energi hämtades från olika kemiska reaktioner.",
          "Tidiga mikrobiella samhällen kan ha påverkat mineralbildning och kretslopp av grundämnen. Långt senare kom vissa former av fotosyntes att förändra atmosfärens sammansättning i grunden.",
          "Vi ska inte föreställa oss en värld fylld av dagens djur och växter. Den tidiga biosfären var osynlig för blotta ögat, men dess påverkan kunde bli enorm.",
        ],
      },
      {
        id: "betydelse",
        heading: "Varför spelar de första spåren roll?",
        paragraphs: [
          "De äldsta trovärdiga spåren av liv sätter en nedre gräns för hur länge livet har funnits på jorden. Själva uppkomsten kan ha skett tidigare.",
          "Studierna hjälper oss också att förstå vilka miljöer som kunde hysa tidiga organismer och vilka spår liknande liv eventuellt skulle kunna lämna på andra planeter.",
          "Ju mer vi lär oss om de gamla bergarterna, desto bättre kan vi skilja biologiska avtryck från geologiska efterlikningar.",
        ],
      },
    ],
    facts: [
      "Mikroskopiskt liv fanns på jorden för minst omkring 3,5 miljarder år sedan.",
      "De äldsta möjliga spåren av liv är ofta omdiskuterade.",
      "Biosignaturer kan vara strukturella, kemiska eller isotopiska.",
      "Mikroorganismer dominerade jordens biosfär under mycket lång tid.",
    ],
    evidence: [
      "Mikroskopiska och skiktade strukturer i mycket gamla sedimentära bergarter.",
      "Analyser av kol och andra isotoper i geologisk kontext.",
      "Undersökningar av mineral och förändringar som skett efter avlagringen.",
      "Jämförelser med nutida mikrobiella miljöer och icke-biologiska processer.",
    ],
    uncertainties: [
      "Vilka av de allra äldsta föreslagna fynden som säkert är biologiska.",
      "Hur de tidigaste mikroorganismerna såg ut och fick energi.",
      "Hur långt före de äldsta bevarade spåren livet uppstod.",
    ],
    relatedIds: ["origin-life", "stromatolites", "photosynthesis"],
    sources: [
      { label: "NASA Astrobiology – Research and discoveries", url: "https://astrobiology.nasa.gov/" },
      { label: "Smithsonian – National Museum of Natural History", url: "https://naturalhistory.si.edu/" },
      { label: "Encyclopaedia Britannica – Precambrian life", url: "https://www.britannica.com/science/Precambrian" },
    ],
  },
  stromatolites: {
    id: "stromatolites",
    kicker: "ARKAIKUM · LIVET SOM BYGGDE STEN",
    lead: "Långt innan korallrev och skogar fanns kunde mikrobiella samhällen påverka hur sediment samlades och mineral bildades. Resultatet blev ibland skiktade strukturer som fortfarande hjälper oss att läsa livets tidiga historia.",
    hero: {
      src: "/images/timeline/life-awakens/stromatolites-hero.webp",
      alt: "Konstnärlig rekonstruktion av ett varmt, grunt urhav med rundade, skiktade stromatoliter under vattenytan.",
      caption: "Stromatolitliknande strukturer kan byggas upp i grunda vattenmiljöer genom samspelet mellan mikrober, sediment och mineral.",
      credit,
      kind: "illustration",
    },
    showcase: {
      src: "/images/timeline/showcases/stromatolite.webp",
      title: "Stromatolit – livets lager på lager",
      description: "Stromatoliter är skiktade strukturer som kan bildas när mikrobiella samhällen fångar sediment eller påverkar mineralutfällning. Vissa mycket gamla exemplar ger ledtrådar om tidigt liv. Konstnärlig illustration av ett bergartsprov, inte ett autentiskt fossil.",
      alt: "Konstnärlig museiillustration av ett gråbeige stromatolitprov med tydliga böljande lager på en rund, polerad träplattform.",
    },
    sections: [
      {
        id: "vad-ar",
        heading: "Vad är en stromatolit?",
        paragraphs: [
          "En stromatolit är en skiktad sedimentär struktur som ofta bildas genom samspelet mellan mikroorganismer och deras omgivning. Mikrober kan binda sedimentkorn eller påverka utfällningen av mineral.",
          "När nya lager samlas ovanpå äldre kan strukturen långsamt växa. Vissa stromatoliter får kupolformade eller pelarliknande former, medan andra är nästan plana.",
          "Det är viktigt att skilja själva stenstrukturen från organismerna som bidrog till att bilda den. Stromatoliten är inte en enda jättelik organism.",
        ],
      },
      {
        id: "bildning",
        heading: "Så kan mikrober bygga lager",
        paragraphs: [
          "Mikrobiella mattor kan bilda tunna, sammanhängande skikt på bottnen i grunda vatten. De kan fånga upp små partiklar som förs dit av vattnet.",
          "Mikroorganismernas kemiska aktivitet kan också förändra förhållandena runt dem så att mineral lättare fälls ut. När processen upprepas kan många lager bevaras ovanpå varandra.",
          "Alla stromatoliter bildas inte på exakt samma sätt. Vattendjup, ljus, vågor, sediment och mikrobernas sammansättning påverkar utseendet.",
        ],
        image: {
          src: "/images/timeline/life-awakens/stromatolite-formation.webp",
          alt: "Pedagogiskt tvärsnitt som visar en mikrobiell matta, sediment som fastnar och upprepade lager som bygger upp en stromatolit.",
          caption: "Mikrobiella mattor kan fånga sediment och påverka mineralbildning. Under lång tid kan upprepade processer skapa skiktade stromatoliter.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "uraldiga-fynd",
        heading: "Ledtrådar från jordens ungdom",
        paragraphs: [
          "Stromatolitliknande strukturer finns i mycket gamla bergarter, bland annat från arkaikum. Vissa omkring 3,4–3,5 miljarder år gamla fynd har tolkats som resultat av mikrobiell aktivitet.",
          "Men skiktade och kupolformade strukturer kan också uppstå genom icke-biologiska processer. Därför granskar forskare bergarternas miljö, mikrostruktur och kemi noggrant.",
          "När flera typer av bevis stöder en biologisk tolkning kan stromatoliter bli viktiga vittnen om hur tidiga mikrobiella samhällen levde.",
        ],
      },
      {
        id: "idag",
        heading: "Stromatoliter finns fortfarande",
        paragraphs: [
          "Stromatoliter och liknande mikrobiellt byggda strukturer bildas än i dag på vissa platser, bland annat i särskilda kust- och sjömiljöer.",
          "Nutida stromatoliter gör det möjligt att undersöka hur mikrober fångar sediment och förändrar mineralbildningen. Men dagens miljöer är inte exakta kopior av jordens urhav.",
          "Genom att jämföra nutida processer med mycket gamla bergarter kan forskare pröva olika förklaringar till de fossila strukturerna.",
        ],
      },
      {
        id: "betydelse",
        heading: "När liv och geologi möts",
        paragraphs: [
          "Stromatoliter visar att livet inte bara anpassar sig till en miljö. Mikroorganismer kan också påverka hur sediment avsätts och hur bergarter bildas.",
          "De berättar samtidigt något om jordens tidiga vattenmiljöer och om de mikrobiella ekosystem som föregick växter och djur med miljarder år.",
          "När vi läser deras lager läser vi därför både geologins och biologins historia.",
        ],
      },
    ],
    facts: [
      "Stromatoliter är skiktade strukturer, inte enskilda organismer.",
      "Mikrober kan fånga sediment och påverka mineralutfällning.",
      "Vissa mycket gamla stromatolitliknande fynd är omkring 3,4–3,5 miljarder år gamla.",
      "Stromatoliter kan fortfarande bildas i vissa miljöer i dag.",
    ],
    evidence: [
      "Skiktade sedimentära strukturer och deras geologiska sammanhang.",
      "Mikroskopiska och geokemiska analyser av gamla bergarter.",
      "Studier av hur nutida mikrobiella mattor binder sediment.",
      "Jämförelser med strukturer som kan bildas utan biologisk påverkan.",
    ],
    uncertainties: [
      "Vilka av de allra äldsta stromatolitliknande strukturerna som verkligen bildades av liv.",
      "Vilka mikroorganismer som dominerade de tidigaste samhällena.",
      "Hur olika vattenmiljöer och geologiska processer påverkade deras former.",
    ],
    relatedIds: ["microbes", "origin-life", "photosynthesis"],
    sources: [
      { label: "Encyclopaedia Britannica – Stromatolite", url: "https://www.britannica.com/science/stromatolite" },
      { label: "Smithsonian – National Museum of Natural History", url: "https://naturalhistory.si.edu/" },
      { label: "NASA Astrobiology", url: "https://astrobiology.nasa.gov/" },
    ],
  },
};
