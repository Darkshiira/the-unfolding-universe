import type { MilestoneArticleData } from "./types";

// Konstnärliga rekonstruktioner och diagram, inte fotografier av faktiska fynd.
const credit = "Konstnärlig illustration skapad för The Unfolding Universe";

export const lifeExtinctionsArticles: Record<string, MilestoneArticleData> = {
  "ordovician-extinction": {
    id: "ordovician-extinction",
    kicker: "SEN ORDOVICIUM · NÄR HAVEN KYLDES NED",
    lead: "För omkring 444 miljoner år sedan drabbades livet av en av jordens fem stora massutrotningar. Nästan allt mer avancerat liv fanns ännu i haven. När klimatet och havsnivån förändrades försvann livsmiljöer som under lång tid hade fyllts av märkliga och mångformiga djur.",
    hero: {
      src: "/images/timeline/life-extinctions/ordovician-extinction-hero.png",
      alt: "Konstnärlig rekonstruktion av ett kallt hav i slutet av ordovicium med trilobiter, armfotingar och grunda havsmiljöer som påverkas av sjunkande havsnivå.",
      caption:
        "Nedisning och stora havsnivåförändringar påverkade de grunda hav där mycket av ordoviciums liv fanns. Bilden är en konstnärlig rekonstruktion.",
      credit,
      kind: "illustration",
    },
    atmosphere: { mode: "frost", intensity: "normal" },
    sections: [
      {
        id: "liv-i-grunda-hav",
        heading: "En värld som levde i havet",
        paragraphs: [
          "Under ordovicium bredde artrika samhällen ut sig över havsbottnarna. Armfotingar, trilobiter, tagghudingar, koraller och många andra organismer fyllde olika roller i ekosystemen.",
          "Grunda kontinentalsocklar erbjöd ljus, näring och varierade livsmiljöer. Många djur var knutna till just dessa miljöer och kunde därför påverkas kraftigt när förhållandena förändrades.",
          "Massutrotningen drabbade inte en tom eller enkel värld, utan redan komplexa marina ekosystem med långa evolutionära historier.",
        ],
      },
      {
        id: "is-och-havsniva",
        heading: "När isen band havets vatten",
        paragraphs: [
          "Mot slutet av ordovicium växte stora inlandsisar på Gondwana, som då låg nära sydpolen. När vatten bands i is sjönk den globala havsnivån och stora grunda havsområden krympte.",
          "Organismer som levde på kontinentalsocklarna förlorade livsmiljöer. Samtidigt förändrades temperaturer, havsströmmar och tillgången på syre i olika delar av havet.",
          "När isarna senare drog sig tillbaka och havet steg uppstod ytterligare omställningar. Utdöendet förknippas därför med flera förändringsfaser, inte en enda plötslig köldknäpp.",
        ],
        image: {
          src: "/images/timeline/life-extinctions/ordovician-sea-level.png",
          alt: "Pedagogiskt diagram i tre steg över grunda ordoviciska hav före nedisningen, sjunkande havsnivå under istillväxt och stigande havsnivå när isen smälter.",
          caption:
            "När stora mängder vatten binds i inlandsis sjunker havsnivån. När isen smälter stiger havet igen och livsmiljöerna förändras på nytt.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "vilka-drabbades",
        heading: "Vilka djur försvann?",
        paragraphs: [
          "Många arter av armfotingar, trilobiter, graptoliter och andra marina organismer dog ut. Utdöendet slog olika hårt mot olika grupper och geografiska områden.",
          "Fossil visar att djursamhällenas sammansättning förändrades kraftigt. Vissa grupper överlevde och spreds senare, medan andra evolutionära linjer tog slut.",
          "Att en grupp drabbades betyder inte att alla dess medlemmar försvann. Trilobiter och armfotingar fortsatte exempelvis att existera långt efter ordovicium.",
        ],
        image: {
          src: "/images/timeline/life-extinctions/ordovician-marine-life.png",
          alt: "Pedagogisk jämförelse av armfotingar, trilobiter, graptoliter och andra marina organismer som påverkades av utdöendet i slutet av ordovicium.",
          caption:
            "Flera stora marina grupper förlorade många arter, men vissa släktlinjer överlevde och fortsatte att utvecklas.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "sparen-efter-krisen",
        heading: "Hur vet vi att det var en massutrotning?",
        paragraphs: [
          "I daterade lager från olika delar av världen förändras fossilens sammansättning markant kring gränsen mellan ordovicium och silur.",
          "Forskare jämför fossilens förekomst med spår av klimatförändring, havsnivåskiften och kemiska förändringar i sedimenten.",
          "Den exakta betydelsen av kyla, syrebrist och andra miljöförändringar diskuteras fortfarande. Fossilmaterialet visar konsekvenserna tydligare än det visar varje steg i orsaksförloppet.",
        ],
      },
    ],
    facts: [
      "Massutrotningen inträffade för omkring 444 miljoner år sedan, nära gränsen mellan ordovicium och silur.",
      "Nästan allt större och mer komplext liv levde då i haven.",
      "Stora förändringar i havsnivån påverkade särskilt grunda marina livsmiljöer.",
      "Flera välkända djurgrupper överlevde trots stora förluster av arter.",
    ],
    evidence: [
      "Förändringar i fossilserier av graptoliter, trilobiter och armfotingar.",
      "Sedimentära spår av nedisning och förändrad havsnivå.",
      "Isotopdata och geokemiska indikatorer på förändrade havsmiljöer.",
      "Daterade bergartslager kring gränsen ordovicium–silur.",
    ],
    uncertainties: [
      "Hur stor betydelse varje fas av nedisning och uppvärmning hade.",
      "Vilken roll syrebrist och förändrad havscirkulation spelade i olika regioner.",
      "Hur snabbt olika ekosystem återhämtade sig.",
    ],
    showcase: {
      src: "/images/timeline/showcases/ordovician-brachiopod-v2.png",
      title: "Armfoting – ett skal från ordoviciums hav",
      description:
        "Armfotingar var vanliga i ordoviciums marina ekosystem. Deras skal finns bevarade som fossil och hjälper forskare att följa förändringar i havens djurliv. Konstnärlig illustration av ett fossilförande bergartsprov, inte ett autentiskt exemplar.",
      alt: "Konstnärlig museiillustration av en grå sedimentär stenplatta med ett tydligt räfflat armfotingsskal, på en rund polerad träplattform mot transparent bakgrund.",
    },
    relatedIds: [
      "ordovician-ice",
      "cambrian",
      "devonian-extinction",
      "life-today",
    ],
    sources: [
      {
        label: "Encyclopaedia Britannica – Ordovician Period",
        url: "https://www.britannica.com/science/Ordovician-Period",
      },
      {
        label: "International Commission on Stratigraphy",
        url: "https://stratigraphy.org/",
      },
      { label: "Paleobiology Database", url: "https://paleobiodb.org/" },
    ],
  },

  "devonian-extinction": {
    id: "devonian-extinction",
    kicker: "SEN DEVON · NÄR REVENS VÄRLD FÖRÄNDRADES",
    lead: "Devon kallas ibland fiskarnas tidsålder, men dess hav rymde också stora rev och en rik mångfald av ryggradslösa djur. Mot periodens slut drabbades livet av flera långdragna kriser. Många marina ekosystem förändrades för alltid.",
    hero: {
      src: "/images/timeline/life-extinctions/devonian-extinction-hero.png",
      alt: "Konstnärlig rekonstruktion av ett devoniskt rev där koralliknande revbyggare, pansarfiskar och andra marina djur lever i ett hav som håller på att förändras.",
      caption:
        "Devons rev och hav var artrika men sårbara för långvariga förändringar i havsmiljön. Bilden är en konstnärlig rekonstruktion.",
      credit,
      kind: "illustration",
    },
    atmosphere: {
      mode: "underwater",
      intensity: "normal",
    },
    sections: [
      {
        id: "rev-och-fiskar",
        heading: "Haven före krisen",
        paragraphs: [
          "Under devon utvecklades stora revkomplex, ofta uppbyggda av stromatoporoider och koraller. De gav skydd och livsutrymme åt många andra organismer.",
          "Samtidigt utvecklades fiskarnas mångfald. Käkförsedda fiskar, pansarfiskar och tidiga benfiskar levde sida vid sida med en stor mängd ryggradslösa djur.",
          "Det var ingen stillastående värld. Konkurrens, predation och förändrade miljöer formade redan ekosystemen innan utdöendehändelserna tog fart.",
        ],
      },
      {
        id: "flera-kriser",
        heading: "Inte en enda katastrof",
        paragraphs: [
          "Devons utdöenden bestod av flera händelser och perioder av ekologisk stress. Två särskilt uppmärksammade intervall är Kellwasserhändelserna nära gränsen frasn–famenn och Hangenberghändelsen nära slutet av devon.",
          "Förändringar i havens syrehalt, temperatur, näringstillförsel och cirkulation kan ha samverkat. I vissa sediment finns mörka, organiskt rika lager som tyder på syrefattiga bottenmiljöer.",
          "Orsakerna behöver inte ha varit identiska vid varje kris. Därför beskriver forskare ofta sen-devon som en utdragen serie av utdöendehändelser.",
        ],
        image: {
          src: "/images/timeline/life-extinctions/devonian-extinction-timeline.png",
          alt: "Pedagogisk tidslinje över sen devon med Kellwasserhändelserna och Hangenberghändelsen, samt symboler för förändringar i havsmiljö och fossilens mångfald.",
          caption:
            "Utdöendena under sen devon inträffade i flera faser. De ska inte förenklas till en enda dag eller en enda orsak.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "när-reven-tystnade",
        heading: "När revbyggarna försvann",
        paragraphs: [
          "Revbyggande organismer drabbades hårt och de omfattande revsystem som kännetecknat delar av devon minskade kraftigt.",
          "Även många trilobiter, armfotingar och fiskgrupper påverkades. Förändringarna var olika stora i olika havsområden och vid olika tidpunkter.",
          "När revstrukturer försvinner förlorar också andra arter skydd, föda och livsmiljöer. En ekologisk kris kan därför få följder långt utöver de arter som först påverkas.",
        ],
        image: {
          src: "/images/timeline/life-extinctions/devonian-reef-collapse.png",
          alt: "Pedagogisk före-och-efter-jämförelse av ett levande devoniskt rev med stromatoporoider och koraller och ett förändrat rev efter omfattande miljöstress.",
          caption:
            "När revbyggare minskade förändrades hela livsmiljöer. Diagrammet är en förenklad illustration av ekologiska följder, inte ett fotografiskt tidsförlopp.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "land-och-hav",
        heading: "Kan livet på land ha påverkat haven?",
        paragraphs: [
          "Under devon bredde större växter och tidiga skogar ut sig på land. Rötter och förändrad vittring kan ha påverkat hur näringsämnen fördes från land till hav.",
          "En hypotes är att ökad tillförsel av näringsämnen i vissa miljöer bidrog till algtillväxt och syrebrist när organiskt material bröts ned.",
          "Sambandet är intressant men inte slutgiltigt fastslaget som huvudorsak till devonkriserna. Klimatförändringar och andra processer undersöks också.",
        ],
      },
    ],
    facts: [
      "Sen-devons utdöenden sträckte sig över flera händelser, ungefär 372–359 miljoner år sedan.",
      "Devons stora revsystem drabbades hårt.",
      "Syrebrist i haven är en viktig hypotes för delar av krisen.",
      "Landväxternas spridning kan ha påverkat havens näringskretslopp.",
    ],
    evidence: [
      "Fossilserier från revbyggare, trilobiter, armfotingar och fiskar.",
      "Svarta skiffrar och geokemiska indikatorer på syrefattiga hav.",
      "Daterade lager kring Kellwasser- och Hangenberghändelserna.",
      "Studier av sediment, vittring och näringsflöden från land.",
    ],
    uncertainties: [
      "Varför flera olika utdöendehändelser inträffade under sen devon.",
      "Hur syrebrist, temperaturförändringar och andra faktorer samverkade.",
      "Hur stark kopplingen var mellan de tidiga skogarna och förändringarna i haven.",
    ],
    showcase: {
      src: "/images/timeline/showcases/devonian-coral.png",
      title: "Devonisk korall – ett minne av forntidens rev",
      description:
        "Fossila koraller och andra revbyggare visar hur marina livsmiljöer såg ut under devon. Deras förekomst och försvinnande hjälper forskare att följa förändringar i havens ekosystem. Konstnärlig illustration av ett fossilförande bergartsprov, inte ett autentiskt exemplar.",
      alt: "Konstnärlig museiillustration av ett gråbeige bergartsprov med tydliga fossila korallstrukturer, på en rund polerad träplattform mot transparent bakgrund.",
    },
    relatedIds: [
      "forests",
      "fish",
      "ordovician-extinction",
      "permian-extinction-life",
    ],
    sources: [
      {
        label: "Encyclopaedia Britannica – Devonian Period",
        url: "https://www.britannica.com/science/Devonian-Period",
      },
      {
        label: "International Commission on Stratigraphy",
        url: "https://stratigraphy.org/",
      },
      { label: "Paleobiology Database", url: "https://paleobiodb.org/" },
    ],
  },

  "permian-extinction-life": {
    id: "permian-extinction-life",
    kicker: "SLUTET AV PERM · LIVETS STÖRSTA KÄNDA KRIS",
    lead: "För omkring 252 miljoner år sedan skakades jordens ekosystem av den största kända massutrotningen. Livet i haven och på land drabbades svårt. Men även när otaliga evolutionära linjer tog slut fanns överlevare som så småningom lade grunden för nya världar.",
    hero: {
      src: "/images/timeline/life-extinctions/permian-extinction-life-hero.png",
      alt: "Konstnärlig rekonstruktion av ett hårt drabbat hav och en vulkaniskt påverkad kust vid slutet av perm, med mörk himmel och få kvarvarande organismer.",
      caption:
        "Vid slutet av perm förändrades klimat och havskemi kraftigt. Bilden gestaltar krisens följder för livet, inte ett exakt dokumenterat ögonblick.",
      credit,
      kind: "illustration",
    },
    atmosphere: { mode: "steam", intensity: "dramatic" },
    sections: [
      {
        id: "en-rik-varld",
        heading: "Livet före den stora krisen",
        paragraphs: [
          "Under perm fanns omfattande marina ekosystem med armfotingar, blötdjur, koraller och många andra organismer. På land levde växter, insekter och en stor mångfald av tidiga fyrfotadjur.",
          "De flesta djur som levde då var inte dinosaurier. Många tillhörde helt andra grupper, däribland olika synapsider och reptillinjer.",
          "När miljön förändrades drabbades både enskilda arter och de ekologiska nätverk som höll samhällena samman.",
        ],
      },
      {
        id: "varfor-sa-allvarligt",
        heading: "Värme, syrebrist och förändrad havskemi",
        paragraphs: [
          "Enorm vulkanisk aktivitet i området som i dag är Sibirien sammanföll med massutrotningen. Utsläpp av växthusgaser bidrog sannolikt till kraftig global uppvärmning.",
          "Varmare vatten kan hålla mindre löst syre, samtidigt som förändrad havscirkulation kan förstärka syrebristen. Försurning och andra kemiska förändringar kan också ha skadat marina organismer.",
          "Forskare undersöker hur dessa processer samverkade och hur snabbt de utvecklades. Krisen hade flera sammanhängande mekanismer snarare än en enda enkel förklaring.",
        ],
        image: {
          src: "/images/timeline/life-extinctions/permian-extinction-cascade.png",
          alt: "Pedagogiskt orsakssambandsdiagram från omfattande vulkanism och växthusgaser till uppvärmning, förändrad havscirkulation, syrebrist och ekologisk kris.",
          caption:
            "Vulkanism kan utlösa en kedja av klimat- och havsförändringar. Diagrammet visar viktiga hypoteser och samband, inte en fullständig förklaring.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "forlusterna",
        heading: "När hela livsgrupper försvann",
        paragraphs: [
          "I haven försvann en mycket stor andel av arterna. Trilobiterna, som funnits sedan kambrium, dog ut helt. Även många revbyggare och andra ryggradslösa djur drabbades svårt.",
          "På land förändrades växtsamhällen och fyrfotadjurens fauna kraftigt. Vissa grupper försvann, medan andra överlevde i mindre mångfald.",
          "Exakta procenttal varierar mellan studier och beror på vilka fossilgrupper och tidsintervall som jämförs. Det råder ändå bred enighet om att detta var den största kända massutrotningen.",
        ],
        image: {
          src: "/images/timeline/life-extinctions/permian-life-before-after.png",
          alt: "Pedagogisk jämförelse av marina och landlevande organismer före och efter massutrotningen i slutet av perm, med trilobiternas slut markerat.",
          caption:
            "Massutrotningen förändrade både havens och landets ekosystem. Vissa grupper försvann helt medan andra överlevde och utvecklades vidare.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "aterhamtning",
        heading: "Ett liv som började om",
        paragraphs: [
          "Efter katastrofen var många ekosystem artfattiga och instabila. Återhämtningen skedde under lång tid och såg olika ut i olika miljöer.",
          "Överlevande organismer spreds, anpassade sig och gav upphov till nya ekologiska samhällen. Under trias skulle andra grupper få större betydelse än de haft före krisen.",
          "Att livet återhämtade sig betyder inte att förlusten var liten. Många evolutionära linjer och ekologiska relationer kom aldrig tillbaka.",
        ],
      },
    ],
    facts: [
      "Massutrotningen inträffade för omkring 252 miljoner år sedan.",
      "Det är den största kända massutrotningen i fossilmaterialet.",
      "Trilobiterna försvann helt vid slutet av perm.",
      "Återhämtningen av ekosystemen tog mycket lång tid.",
    ],
    evidence: [
      "Stora förändringar i marina fossilserier vid gränsen perm–trias.",
      "Dateringar av sibirisk vulkanism och sediment från samma tidsintervall.",
      "Kol- och andra isotopsignaler som visar störningar i jordens kretslopp.",
      "Geokemiska indikatorer på uppvärmning och syrebrist i haven.",
    ],
    uncertainties: [
      "Hur de olika dödliga miljöförändringarna samverkade regionalt.",
      "Hur snabbt utdöendet skedde för olika grupper och livsmiljöer.",
      "Varför återhämtningen gick olika fort i olika ekosystem.",
    ],
    showcase: {
      src: "/images/timeline/showcases/permian-brachiopod.png",
      title: "Armfoting – en överlevare från ett förändrat hav",
      description:
        "Armfotingar var mångformiga i paleozoikums hav. Många släktlinjer försvann under krisen vid slutet av perm, medan andra överlevde. Fossil hjälper forskare att följa dessa förändringar. Konstnärlig illustration av ett fossilförande bergartsprov, inte ett autentiskt exemplar.",
      alt: "Konstnärlig museiillustration av ett mörkt fossilförande bergartsprov med räfflade armfotingsskal, på en rund polerad träplattform mot transparent bakgrund.",
    },
    relatedIds: [
      "permian-extinction-earth",
      "pangaea",
      "devonian-extinction",
      "triassic-extinction",
    ],
    sources: [
      {
        label: "Encyclopaedia Britannica – Permian extinction",
        url: "https://www.britannica.com/science/Permian-extinction",
      },
      {
        label: "International Commission on Stratigraphy",
        url: "https://stratigraphy.org/",
      },
      { label: "Paleobiology Database", url: "https://paleobiodb.org/" },
    ],
  },

  "triassic-extinction": {
    id: "triassic-extinction",
    kicker: "SLUTET AV TRIAS · EN NY VÄRLD TAR FORM",
    lead: "För omkring 201 miljoner år sedan drabbades livet åter av en stor massutrotning. När Pangea började spricka upp följde omfattande vulkanism och förändringar i klimat och hav. Efter krisen fick flera överlevande grupper möjlighet att breda ut sig i nya ekologiska roller.",
    hero: {
      src: "/images/timeline/life-extinctions/triassic-extinction-hero.png",
      alt: "Konstnärlig rekonstruktion av ett sent triassiskt kustlandskap med vulkanutbrott i fjärran och tidiga reptiler under en mörknande himmel.",
      caption:
        "Vulkanism i samband med Pangeas uppsprickning förändrade miljöerna vid slutet av trias. Bilden är en konstnärlig rekonstruktion.",
      credit,
      kind: "illustration",
    },
    atmosphere: { mode: "embers", intensity: "subtle" },
    sections: [
      {
        id: "trias-varld",
        heading: "En värld av många reptilgrupper",
        paragraphs: [
          "Under trias levde tidiga dinosaurier sida vid sida med många andra reptiler och släktingar till dagens krokodiler. Dinosaurierna dominerade ännu inte alla landmiljöer.",
          "I haven fanns bland annat ammonoider, musslor, koraller och marina reptiler. Ekosystemen hade gradvis återhämtat sig efter den stora krisen vid slutet av perm.",
          "Mot slutet av trias utsattes dessa samhällen för en ny omfattande miljöförändring.",
        ],
      },
      {
        id: "pangea-spricker",
        heading: "När kontinenterna började glida isär",
        paragraphs: [
          "Pangeas uppsprickning förknippas med enorma vulkaniska utbrott i den magmatiska provins som kallas Central Atlantic Magmatic Province, CAMP.",
          "Utsläpp av koldioxid och andra gaser kan ha bidragit till snabb uppvärmning, försurning av hav och andra miljöstörningar.",
          "Forskare jämför dateringar av vulkaniska bergarter med fossilens försvinnande och kemiska signaler i sediment för att förstå sambanden.",
        ],
        image: {
          src: "/images/timeline/life-extinctions/triassic-volcanism.png",
          alt: "Pedagogiskt diagram som visar Pangeas uppsprickning, omfattande vulkanism i Central Atlantic Magmatic Province och möjliga följder för klimat och hav.",
          caption:
            "Vulkanismen i samband med Pangeas uppsprickning är en central förklaring till krisen vid slutet av trias.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "vem-forsvann",
        heading: "Vilka förlorade sina livsmiljöer?",
        paragraphs: [
          "Flera grupper av stora landlevande arkosaurier som inte var dinosaurier försvann. I haven drabbades bland annat ammonoider och många revorganismer.",
          "Massutrotningen påverkade olika ekosystem på olika sätt. Fossilmaterialet är också ojämnt fördelat mellan platser och organismgrupper.",
          "Dinosaurierna överlevde och kom under jura att dominera många landekosystem. Det betyder inte att de var de enda överlevarna eller att deras senare framgång var förutbestämd.",
        ],
        image: {
          src: "/images/timeline/life-extinctions/triassic-survivors-v2.png",
          alt: "Pedagogisk jämförelse av några reptilgrupper och marina organismer före och efter utdöendet vid gränsen trias–jura.",
          caption:
            "Vissa evolutionära linjer försvann medan andra överlevde. Under jura förändrades fördelningen av ekologiska roller på land.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "efter-krisen",
        heading: "Överlevarna formar jura",
        paragraphs: [
          "När arter försvinner kan livsmiljöer och ekologiska roller bli tillgängliga för andra organismer. Efter trias utvecklades nya djursamhällen både på land och i haven.",
          "Dinosauriernas mångfald och ekologiska betydelse ökade under jura, samtidigt som andra grupper också fortsatte att utvecklas.",
          "Massutrotningen visar hur evolutionens riktning påverkas av både biologiska egenskaper och stora miljöförändringar.",
        ],
      },
    ],
    facts: [
      "Massutrotningen inträffade för omkring 201 miljoner år sedan.",
      "Den sammanfaller nära i tiden med omfattande vulkanism i CAMP.",
      "Flera grupper av icke-dinosauriska arkosaurier försvann.",
      "Dinosaurier blev mer ekologiskt framträdande under jura.",
    ],
    evidence: [
      "Dateringar av vulkaniska bergarter från CAMP.",
      "Fossilserier kring gränsen trias–jura.",
      "Kol-isotopsignaler och andra spår av störningar i kolcykeln.",
      "Sediment som visar förändringar i havs- och landmiljöer.",
    ],
    uncertainties: [
      "Vilka mekanismer som orsakade störst biologisk skada i olika miljöer.",
      "Hur snabbt och i vilken ordning olika grupper försvann.",
      "Hur överlevnad och ekologiska möjligheter påverkade dinosauriernas senare spridning.",
    ],
    showcase: {
      src: "/images/timeline/showcases/triassic-ammonoid.png",
      title: "Ammonoid – ett spiralformat vittne",
      description:
        "Ammonoider var marina bläckfiskar med skal. Fossil från deras olika släktlinjer hjälper forskare att följa förändringar kring gränsen mellan trias och jura. Konstnärlig illustration av ett fossilförande bergartsprov, inte ett autentiskt exemplar.",
      alt: "Konstnärlig museiillustration av ett spiralformat ammonoidfossil i gråbrun sten, på en rund polerad träplattform mot transparent bakgrund.",
    },
    relatedIds: [
      "pangaea-breakup",
      "dinosaurs",
      "permian-extinction-life",
      "cretaceous-extinction",
    ],
    sources: [
      {
        label: "Encyclopaedia Britannica – Triassic Period",
        url: "https://www.britannica.com/science/Triassic-Period",
      },
      {
        label: "International Commission on Stratigraphy",
        url: "https://stratigraphy.org/",
      },
      { label: "Paleobiology Database", url: "https://paleobiodb.org/" },
    ],
  },

  "cretaceous-extinction": {
    id: "cretaceous-extinction",
    kicker: "SLUTET AV KRITA · NÄR LIVETS VÄG ÄNDRADES",
    lead: "För 66 miljoner år sedan slog en stor asteroid ned vid det som i dag är Yucatánhalvön. Följderna drabbade näringskedjor över hela planeten. I katastrofens spår försvann många djurgrupper – men bland överlevarna fanns de fåglar, däggdjur och andra organismer som skulle forma den värld vi känner i dag.",
    hero: {
      src: "/images/timeline/life-extinctions/cretaceous-extinction-hero.png",
      alt: "Konstnärlig rekonstruktion av ett landskap vid slutet av krita med mörknande himmel efter ett asteroidnedslag, dinosaurier och vegetation i förgrunden.",
      caption:
        "Asteroidnedslaget förändrade livsvillkoren globalt. Bilden är en konstnärlig tolkning av följderna, inte en exakt dokumenterad scen.",
      credit,
      kind: "illustration",
    },
    atmosphere: { mode: "embers", intensity: "subtle" },
    sections: [
      {
        id: "innan-nedslaget",
        heading: "En levande värld före katastrofen",
        paragraphs: [
          "Under sen krita fanns dinosaurier i många olika landmiljöer. Blomväxter hade spridits, fåglar utvecklades vidare och däggdjur levde i flera ekologiska roller.",
          "Haven rymde ammoniter, plankton, fiskar och stora marina reptiler. Livets mångfald var omfattande men ojämnt fördelad över jordens olika miljöer.",
          "Den värld som gick förlorad var inte en enda dinosaurievärld, utan ett nätverk av skogar, hav, kustmiljöer och näringskedjor.",
        ],
      },
      {
        id: "nedslaget-och-morkret",
        heading: "När solljuset försvagades",
        paragraphs: [
          "Asteroiden slog ned i området som i dag är Chicxulubkratern. Nedslaget kastade upp stora mängder material och orsakade omfattande störningar i atmosfär och hav.",
          "Damm, sot och svavelhaltiga partiklar kan ha minskat mängden solljus som nådde jordytan under en period. Minskad fotosyntes skulle då ha påverkat näringskedjor både på land och i haven.",
          "Nedslaget kunde också orsaka regionala bränder, tsunamier och andra omedelbara följder. Hur starka effekterna var varierade mellan platser.",
        ],
        image: {
          src: "/images/timeline/life-extinctions/cretaceous-food-web-collapse.png",
          alt: "Pedagogiskt diagram som visar hur asteroidnedslaget kan ha minskat solljuset, bromsat fotosyntesen och påverkat näringskedjor i hav och på land.",
          caption:
            "Minskad fotosyntes efter nedslaget är en viktig mekanism bakom den globala ekologiska krisen.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "vilka-overlevde",
        heading: "De som försvann – och de som överlevde",
        paragraphs: [
          "Alla icke-flygande dinosaurier dog ut. Fåglarna överlevde som den enda dinosauriegrupp som finns kvar i dag, även om många dåtida fågellinjer också försvann.",
          "Ammoniterna och de stora marina reptilerna dog ut. Även plankton och många andra organismer drabbades hårt.",
          "Bland överlevarna fanns vissa däggdjur, fåglar, krokodildjur, sköldpaddor, groddjur och andra grupper. Överlevnad berodde sannolikt på flera faktorer, bland annat livsmiljö, föda och fysiologi.",
        ],
        image: {
          src: "/images/timeline/life-extinctions/cretaceous-survivors.png",
          alt: "Pedagogisk jämförelse av organismgrupper som dog ut vid slutet av krita och grupper som överlevde, inklusive fåglar, däggdjur och krokodildjur.",
          caption:
            "Fåglarna är levande dinosaurier. Massutrotningen förändrade vilka grupper som skulle dominera senare ekosystem.",
          credit,
          kind: "diagram",
        },
      },
      {
        id: "bevisen",
        heading: "Ett tunt lager med ett stort budskap",
        paragraphs: [
          "Vid gränsen mellan krita och paleogen finns på många platser ett tunt lager som är ovanligt rikt på iridium, ett grundämne som är vanligare i vissa meteoriter än i jordskorpan.",
          "Chockad kvarts, små smältpartiklar och Chicxulubkratern ger ytterligare starka belägg för ett mycket stort asteroidnedslag.",
          "Fossilserierna visar samtidigt stora förändringar i livet. Tillsammans kopplar dessa bevis nedslaget till massutrotningen, även om forskare fortfarande studerar detaljerna i dess förlopp och andra samtidiga miljöfaktorer.",
        ],
      },
      {
        id: "efterat",
        heading: "Livet fortsätter i en förändrad värld",
        paragraphs: [
          "Efter katastrofen började ekosystemen återhämta sig. Växter, plankton och djursamhällen utvecklades vidare, men inte överallt i samma takt.",
          "Många däggdjurslinjer fick med tiden större ekologisk betydelse. Även fåglarna diversifierades och blev en viktig del av nya land- och vattenmiljöer.",
          "Massutrotningen innebar slutet för många livsformer, men också början på ett nytt kapitel i livets historia.",
        ],
      },
    ],
    facts: [
      "Asteroidnedslaget inträffade för 66 miljoner år sedan.",
      "Alla icke-flygande dinosaurier dog ut, men fåglarna överlevde.",
      "Iridiumrika lager och chockad kvarts är viktiga belägg för nedslaget.",
      "Återhämtningen ledde så småningom till nya ekosystem under paleogen.",
    ],
    evidence: [
      "Chicxulubkratern och dess daterade nedslagsbergarter.",
      "Iridiumanomalier, chockad kvarts och smältpartiklar i gränslager.",
      "Fossilserier av ammoniter, plankton och landlevande ryggradsdjur.",
      "Geokemiska och klimatologiska modeller av nedslagets följder.",
    ],
    uncertainties: [
      "Hur länge och hur kraftigt solljuset minskade på olika platser.",
      "Varför vissa ekologiska grupper överlevde bättre än andra.",
      "Hur andra samtida processer, bland annat vulkanism, påverkade krisens förlopp.",
    ],
    showcase: {
      src: "/images/timeline/showcases/cretaceous-ammonite.png",
      title: "Ammonit – ett skal från en förlorad värld",
      description:
        "Ammoniter var marina bläckfiskar med spiralformade skal. Gruppen dog ut vid slutet av krita, och deras fossil hjälper forskare att studera livet före massutrotningen. Konstnärlig illustration av ett fossilförande bergartsprov, inte ett autentiskt exemplar.",
      alt: "Konstnärlig museiillustration av ett detaljerat spiralformat ammonitfossil i mörkgrå bergart, på en rund polerad träplattform mot transparent bakgrund.",
    },
    relatedIds: [
      "cretaceous-impact",
      "extinction",
      "birds",
      "mammals",
      "biodiversity",
    ],
    sources: [
      {
        label:
          "Encyclopaedia Britannica – Cretaceous–Paleogene extinction event",
        url: "https://www.britannica.com/science/Cretaceous-Paleogene-extinction-event",
      },
      {
        label: "Smithsonian National Museum of Natural History",
        url: "https://naturalhistory.si.edu/",
      },
      {
        label: "International Commission on Stratigraphy",
        url: "https://stratigraphy.org/",
      },
    ],
  },
};
