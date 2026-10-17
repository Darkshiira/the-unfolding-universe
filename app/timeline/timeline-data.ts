export type Category = "earth" | "life" | "plants" | "animals" | "humans";

export type Milestone = {
  id: string;
  title: string;
  date: string;
  description: string;
  fact: string;
  x: number;
  y: number;
  category: Category;
  symbol: string;
  major?: boolean;
  image?: string; // Exempel: "/images/timeline/earth.jpg"
};

export const WORLD_WIDTH = 6100;
export const WORLD_HEIGHT = 1160;

export const palette: Record<
  Category,
  { color: string; light: string; label: string }
> = {
  earth: {
    color: "#BC906C",
    light: "#F1E2D0",
    label: "Jordens historia",
  },
  life: {
    color: "#739FA2",
    light: "#E0EFF0",
    label: "Livets början",
  },
  plants: {
    color: "#839B70",
    light: "#E5EDDD",
    label: "Växternas utveckling",
  },
  animals: {
    color: "#B88D8D",
    light: "#F2E4E3",
    label: "Djurens utveckling",
  },
  humans: {
    color: "#BA916A",
    light: "#F3E8D9",
    label: "Människans utveckling",
  },
};

export const milestones: Milestone[] = [
  {
    id: "earth",
    title: "Jorden föds",
    date: "För 4,54 miljarder år sedan",
    description:
      "Jorden bildas av material som kretsar runt den unga solen. I början är vår planet mycket varm och förändras ständigt när stora himlakroppar krockar med den.",
    fact: "Jorden är ungefär 4,54 miljarder år gammal.",
    x: 170,
    y: 195,
    category: "earth",
    symbol: "🌋",
    major: true,
  },
  {
    id: "moon",
    title: "Månen bildas",
    date: "För ungefär 4,5 miljarder år sedan",
    description:
      "Enligt den vanligaste förklaringen krockar den unga jorden med en annan stor himlakropp. Delar som slungas ut i rymden samlas så småningom och bildar månen.",
    fact: "Månen hjälper till att hålla jordens lutning relativt stabil.",
    x: 510,
    y: 195,
    category: "earth",
    symbol: "🌕",
  },
  {
    id: "oceans",
    title: "En värld av vatten",
    date: "Möjligen redan för 4,4 miljarder år sedan",
    description:
      "Mycket gamla mineraler tyder på att det kan ha funnits flytande vatten på jordens yta redan tidigt i planetens historia.",
    fact: "Några av de äldsta ledtrådarna finns i pyttesmå kristaller av mineralet zirkon.",
    x: 850,
    y: 195,
    category: "earth",
    symbol: "🌊",
    major: true,
  },
  {
    id: "microbes",
    title: "De första mikroorganismerna",
    date: "För minst 3,5 miljarder år sedan",
    description:
      "Några av de äldsta tydliga spåren av liv kommer från mycket små och enkla organismer som levde på den unga jorden.",
    fact: "Under miljarder år bestod livet på jorden främst av mikroorganismer.",
    x: 1300,
    y: 435,
    category: "life",
    symbol: "🦠",
    major: true,
  },
  {
    id: "oxygen",
    title: "Syre förändrar jorden",
    date: "För ungefär 2,4 miljarder år sedan",
    description:
      "Allt mer syre börjar samlas i atmosfären. Det förändrar miljön på jorden och skapar nya möjligheter för livets utveckling.",
    fact: "I början fanns det nästan inget fritt syre i jordens atmosfär.",
    x: 2050,
    y: 435,
    category: "life",
    symbol: "🫧",
    major: true,
  },
  {
    id: "eukaryotes",
    title: "Mer avancerade celler",
    date: "För minst 1,6 miljarder år sedan",
    description:
      "Celler med en cellkärna och flera olika delar utvecklas. De blir viktiga för många av de livsformer som kommer senare.",
    fact: "Växter, djur och svampar består alla av celler med cellkärna.",
    x: 2600,
    y: 435,
    category: "life",
    symbol: "🔬",
  },
  {
    id: "land-plants",
    title: "Växterna tar steget upp på land",
    date: "För ungefär 470 miljoner år sedan",
    description:
      "De första växterna börjar sprida sig på land. Med tiden förändrar de landskapet och skapar nya miljöer där andra organismer kan leva.",
    fact: "De första landväxterna såg inte alls ut som dagens stora träd.",
    x: 3700,
    y: 695,
    category: "plants",
    symbol: "🌱",
    major: true,
  },
  {
    id: "forests",
    title: "De första skogarna",
    date: "För ungefär 385 miljoner år sedan",
    description:
      "De första skogarna växer fram. Träden förändrar marken och påverkar hur kol rör sig mellan luften, växterna och jorden.",
    fact: "Vissa av de första träden såg helt annorlunda ut än dagens träd.",
    x: 4100,
    y: 695,
    category: "plants",
    symbol: "🌳",
  },
  {
    id: "animals",
    title: "De första djuren",
    date: "Senast för ungefär 600 miljoner år sedan",
    description:
      "Olika slags djur utvecklas i de gamla haven. Forskare undersöker fortfarande exakt när och hur de allra första djuren uppstod.",
    fact: "De första djuren levde i havet.",
    x: 3450,
    y: 890,
    category: "animals",
    symbol: "🪼",
    major: true,
  },
  {
    id: "dinosaurs",
    title: "Dinosauriernas tid",
    date: "Börjar för ungefär 230 miljoner år sedan",
    description:
      "De första dinosaurierna dyker upp under triasperioden. Med tiden utvecklas många olika arter, från små och snabba till enormt stora.",
    fact: "Dagens fåglar är ättlingar till dinosaurierna.",
    x: 4550,
    y: 890,
    category: "animals",
    symbol: "🦕",
    major: true,
  },
  {
    id: "humans",
    title: "Vår art uppstår",
    date: "För ungefär 300 000 år sedan",
    description:
      "Vår art, Homo sapiens, utvecklas i Afrika. Jämfört med jordens långa historia har människan bara funnits en mycket kort tid.",
    fact: "Människan är ett däggdjur och en primat – och precis som andra djur en del av naturen.",
    x: 5350,
    y: 1080,
    category: "humans",
    symbol: "👣",
    major: true,
  },
  {
    id: "continents",
    title: "De första kontinenterna",
    date: "För mer än 3 miljarder år sedan",
    description: "Jordens yttersta lager förändras. Gamla delar av jordskorpan växer och bildar grunden till kontinenter.",
    fact: "Kontinenterna har flyttat sig och ändrat form under jordens historia.",
    x: 1700, y: 195, category: "earth", symbol: "🗺️",
  },
  {
    id: "snowball",
    title: "Jorden täcks av is",
    date: "För omkring 700 miljoner år sedan",
    description: "Under mycket kalla perioder sprider sig isen över stora delar av jorden. Hur mycket av planeten som var istäckt diskuteras fortfarande.",
    fact: "Dessa perioder kallas ibland för Snöbollsjorden.",
    x: 3050, y: 195, category: "earth", symbol: "❄️", major: true,
  },
  {
    id: "pangaea",
    title: "Superkontinenten Pangea",
    date: "För omkring 300 miljoner år sedan",
    description: "Nästan alla jordens stora landmassor sitter ihop i en enda enorm superkontinent som kallas Pangea.",
    fact: "Pangea började senare spricka upp i de kontinenter vi känner i dag.",
    x: 4300, y: 195, category: "earth", symbol: "🌍",
  },
  {
    id: "earth-today",
    title: "Jorden idag",
    date: "Idag",
    description: "Kontinenterna rör sig fortfarande. Vulkaner, jordbävningar, hav och klimat fortsätter att forma vår planet.",
    fact: "Jordens kontinenter rör sig oftast bara några centimeter per år.",
    x: 5700, y: 195, category: "earth", symbol: "🌎", major: true,
  },
  {
    id: "multicellular",
    title: "Liv med många celler",
    date: "För över 1 miljard år sedan",
    description: "Vissa organismer utvecklas till livsformer där flera celler samarbetar. Det öppnar vägen för mer komplicerat liv.",
    fact: "Flercelligt liv har uppstått flera gånger i evolutionen.",
    x: 3000, y: 435, category: "life", symbol: "🧬",
  },
  {
    id: "cambrian",
    title: "Livet får många nya former",
    date: "För omkring 539 miljoner år sedan",
    description: "Under den kambriska perioden blir många olika djurgrupper tydligare i fossilmaterialet. Havet fylls av nya former av liv.",
    fact: "Den här utvecklingen brukar kallas den kambriska explosionen.",
    x: 3450, y: 435, category: "life", symbol: "🐚", major: true,
  },
  {
    id: "life-today",
    title: "Livet idag",
    date: "Idag",
    description: "Livet finns nästan överallt: i haven, på land, i luften och djupt under marken. Nya arter utvecklas medan andra försvinner.",
    fact: "Evolutionen pågår fortfarande, även idag.",
    x: 5700, y: 435, category: "life", symbol: "🌿", major: true,
  },
  {
    id: "flowers",
    title: "Blommorna sprider sig",
    date: "För omkring 140 miljoner år sedan",
    description: "Blomväxter blir allt vanligare och utvecklar många olika sätt att sprida pollen och frön.",
    fact: "Många blomväxter samarbetar med insekter som pollinerar dem.",
    x: 4700, y: 695, category: "plants", symbol: "🌸", major: true,
  },
  {
    id: "grasslands",
    title: "Gräsmarker breder ut sig",
    date: "Under de senaste tiotals miljoner åren",
    description: "Gräsmarker sprider sig över stora områden och ger nya livsmiljöer åt betande djur.",
    fact: "Gräs hör till en grupp blomväxter.",
    x: 5200, y: 695, category: "plants", symbol: "🌾",
  },
  {
    id: "plants-today",
    title: "Växterna idag",
    date: "Idag",
    description: "Från mossor till höga träd: växterna ger syre, mat och livsmiljöer åt många andra organismer.",
    fact: "Växter använder solljus för att tillverka energirik näring genom fotosyntes.",
    x: 5700, y: 695, category: "plants", symbol: "🌻", major: true,
  },
  {
    id: "fish",
    title: "Fiskarna utvecklas",
    date: "För mer än 450 miljoner år sedan",
    description: "Tidiga ryggradsdjur utvecklas i haven. Med tiden uppstår många olika fiskgrupper.",
    fact: "Fiskarnas utveckling är en viktig del av ryggradsdjurens historia.",
    x: 3800, y: 890, category: "animals", symbol: "🐟",
  },
  {
    id: "land-animals",
    title: "Djuren tar sig upp på land",
    date: "För omkring 370 miljoner år sedan",
    description: "De första fyrfotadjuren utvecklas ur fiskliknande förfäder och börjar röra sig i grunda vatten och på land.",
    fact: "Insekter och andra leddjur fanns på land före de första fyrfotadjuren.",
    x: 4150, y: 890, category: "animals", symbol: "🐸", major: true,
  },
  {
    id: "extinction",
    title: "Dinosauriernas stora utdöende",
    date: "För 66 miljoner år sedan",
    description: "Ett stort asteroidnedslag bidrar till en massutrotning. Alla dinosaurier utom fåglarna dör ut.",
    fact: "Fåglarna är de dinosaurier som överlevde.",
    x: 4950, y: 890, category: "animals", symbol: "☄️", major: true,
  },
  {
    id: "mammals",
    title: "Däggdjuren sprider sig",
    date: "Efter 66 miljoner år sedan",
    description: "När många stora djurgrupper försvinner får däggdjuren nya möjligheter att utvecklas och sprida sig.",
    fact: "Däggdjur fanns redan när dinosaurierna levde.",
    x: 5300, y: 890, category: "animals", symbol: "🦣",
  },
  {
    id: "animals-today",
    title: "Djuren idag",
    date: "Idag",
    description: "Djur finns i nästan alla miljöer på jorden, från djuphaven till de högsta bergen.",
    fact: "Människan är också ett djur.",
    x: 5700, y: 890, category: "animals", symbol: "🦋", major: true,
  },
  {
    id: "hominins",
    title: "Våra tidiga släktingar",
    date: "För flera miljoner år sedan",
    description: "I Afrika utvecklas flera arter som är närmare släkt med oss än med dagens schimpanser.",
    fact: "Människans släktträd har många grenar, inte en enda rak linje.",
    x: 4750, y: 1080, category: "humans", symbol: "🦴",
  },
  {
    id: "stone-tools",
    title: "Tidiga stenverktyg",
    date: "För minst 2,6 miljoner år sedan",
    description: "Våra tidiga släktingar använder stenverktyg. Det finns även fynd som tyder på ännu äldre verktygstillverkning.",
    fact: "De äldsta kända stenverktygen är omkring 3,3 miljoner år gamla.",
    x: 5050, y: 1080, category: "humans", symbol: "🪨",
  },
  {
    id: "farming",
    title: "Människor börjar odla",
    date: "För omkring 12 000 år sedan",
    description: "På flera platser i världen börjar människor odla växter och hålla tamdjur. Nya samhällen växer fram.",
    fact: "Jordbruk utvecklades på olika platser vid olika tider.",
    x: 5520, y: 1080, category: "humans", symbol: "🌾",
  },
  {
    id: "humans-today",
    title: "Människan idag",
    date: "Idag",
    description: "Vi lever över hela världen och påverkar planeten på många sätt. Samtidigt är vi en del av naturens långa historia.",
    fact: "Alla människor som lever idag tillhör arten Homo sapiens.",
    x: 5700, y: 1080, category: "humans", symbol: "🤝", major: true,
  },
];

