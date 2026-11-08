"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CellSpecimenSlide from "./CellSpecimenSlide";
import {
  Cormorant_Garamond,
  Libre_Baskerville,
  Caveat,
} from "next/font/google";
import {
  readDetectiveProgress,
  updateDetectiveProgress,
} from "./DetectiveProgress";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Compass,
  RotateCcw,
  Search,
  ShieldCheck,
  Fingerprint,
  ClipboardList,
  Lightbulb,
  Microscope,
  ExternalLink,
  ChevronLeft,
  FileSearch,
} from "lucide-react";

import {
  cases,
  specimens,
  DETECTIVE_STORAGE_KEY,
  DETECTIVE_PROGRESS_EVENT,
  type CellId,
  type Mode,
  type Answer,
} from "./DetectiveCases";
const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-detective-display",
});
const bookFont = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-detective-book",
});
const handwrittenFont = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-detective-handwriting",
});
const SPECIMEN_ROUTE = "/museum/cell-explorer";
const POLAROID_PAIRS: Record<string, [CellId, CellId]> = {
  nucleus: ["animal", "plant"],
  wall: ["plant", "bacteria"],
  chloroplast: ["plant", "animal"],
  ribosome: ["bacteria", "archaea"],
  mitochondria: ["animal", "plant"],
  dna: ["bacteria", "archaea"],
};
const POLAROID_LABELS: Record<CellId, string> = {
  animal: "Preparat 001",
  plant: "Preparat 002",
  bacteria: "Preparat 003",
  archaea: "Preparat 004",
};

const same = (a: CellId[], b: CellId[]) =>
  a.length === b.length && a.every((id) => b.includes(id));
export default function CellDetectivesPage() {
  const [mode, setMode] = useState<Mode>("guided");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [revealed, setRevealed] = useState<string[]>([]);
  const [, setReady] = useState(false);
  const [activeFree, setActiveFree] = useState("nucleus");
  // Returning from a 3D specimen restores the active investigation.
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      const params = new URLSearchParams(window.location.search);
      const caseId = params.get("case");
      const caseIndex = cases.findIndex((c) => c.id === caseId);
      if (caseIndex >= 0) {
        setIndex(caseIndex);
        setActiveFree(cases[caseIndex].id);
      }
      if (params.get("mode") === "free") setMode("free");
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const specimenHref = (cell: CellId) =>
    `${SPECIMEN_ROUTE}?specimen=${cell}&from=detectives&case=${encodeURIComponent(current.id)}&mode=${mode}`;
  useEffect(() => {
    let active = true;
    const sync = () => {
      const saved = readDetectiveProgress();
      if (!active) return;
      setAnswers(saved.answers);
      setRevealed(saved.revealed);
      setReady(true);
    };
    Promise.resolve().then(sync);
    window.addEventListener(DETECTIVE_PROGRESS_EVENT, sync);
    window.addEventListener("storage", sync);
    window.addEventListener("pageshow", sync);
    return () => {
      active = false;
      window.removeEventListener(DETECTIVE_PROGRESS_EVENT, sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("pageshow", sync);
    };
  }, []);
  function persist(nextAnswers: Answer, nextRevealed: string[]) {
    setAnswers(nextAnswers);
    setRevealed(nextRevealed);
    updateDetectiveProgress({ answers: nextAnswers, revealed: nextRevealed });
  }
  const current =
    mode === "guided" ? cases[index] : cases.find((c) => c.id === activeFree)!;
  const chosen = answers[current.id] || [];
  const isRevealed = revealed.includes(current.id);
  const solved = useMemo(
    () =>
      cases.filter(
        (c) => revealed.includes(c.id) && same(answers[c.id] || [], c.answer),
      ).length,
    [answers, revealed],
  );
  function toggle(cell: CellId) {
    if (isRevealed) return;
    const saved = readDetectiveProgress();
    const existing = saved.answers[current.id] || [];
    const next = existing.includes(cell)
      ? existing.filter((id) => id !== cell)
      : [...existing, cell];
    persist({ ...saved.answers, [current.id]: next }, saved.revealed);
  }
  const [mobilePage, setMobilePage] = useState<"mission" | "notes" | "cases">(
    "mission",
  );
  function reset() {
    if (!window.confirm("Vill du rensa hela din detektivbok?")) return;
    persist({}, []);
    setIndex(0);
  }
  return (
    <main
      className={`cd-root ${displayFont.variable} ${bookFont.variable} ${handwrittenFont.variable}`}
    >
      <style>{`
        .cd-root{--paper:#e8d4aa;--ink:#33291f;--gold:#e5b963;--teal:#8fe3c9;min-height:100dvh;color:#f1e9da;background:radial-gradient(ellipse at 52% 3%,#16404a 0%,transparent 49%),linear-gradient(135deg,#05131d,#071923 55%,#0a1019);font-family:Arial,Helvetica,sans-serif;position:relative;overflow:hidden}
        .cd-root *{box-sizing:border-box}.cd-root button{cursor:pointer}.cd-root button:disabled{cursor:default}
        .cd-root:before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.13;background-image:repeating-linear-gradient(0deg,transparent 0 57px,#c9e5d8 58px,transparent 59px),repeating-linear-gradient(90deg,transparent 0 57px,#c9e5d8 58px,transparent 59px);mask-image:linear-gradient(#000,transparent 65%)}
        .cd-wrap{position:relative;z-index:1;max-width:1480px;margin:auto;padding:22px 26px 64px}
        .cd-top{display:flex;justify-content:space-between;align-items:center;gap:15px;font-size:12px;letter-spacing:.04em}
        .cd-return-links{display:flex;align-items:center;flex-wrap:wrap;gap:8px 18px}
        .cd-return-links .cd-back{min-height:38px;border-radius:8px;padding:6px 8px;background:#0b2430b8;border:1px solid #5b83856b;white-space:nowrap}
        .cd-return-links .cd-back:hover{background:#19404a;border-color:#94d4ca}
        @media(max-width:700px){.cd-top{align-items:flex-start}.cd-return-links{gap:6px}.cd-return-links .cd-back{font-size:11px;padding:6px 7px}.cd-brand{text-align:right}}
        .cd-back{color:#a8e2dd;text-decoration:none;display:inline-flex;align-items:center;gap:8px}.cd-brand{color:var(--gold);font-size:10px;font-weight:800;letter-spacing:.22em;text-transform:uppercase}
        .cd-hero{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;padding:32px 8px 24px}
        .cd-titleline{display:flex;align-items:center;gap:18px}.cd-fingerprint{color:#e3d7c4;opacity:.7;flex-shrink:0}
        .cd-hero h1{font:700 clamp(36px,5vw,66px)/1.05 Georgia,serif;letter-spacing:-.035em;margin:0;text-shadow:0 3px 20px #000}
        .cd-hero p{font-size:14px;line-height:1.6;color:#b6d0d0;max-width:580px;margin:12px 0 0}
        .cd-tabs{display:flex;gap:10px;flex-wrap:wrap}.cd-tab{display:flex;align-items:center;gap:9px;padding:12px 15px;border:1px solid #567079;background:#0a1c28;color:#d3e1e0;border-radius:10px;font-size:13px;font-weight:700;white-space:nowrap}.cd-tab[aria-selected="true"]{border-color:#9ee5bc;background:#123e36;color:#fff;box-shadow:0 0 16px #55dca82e}
        .cd-desk{position:relative;padding:16px;border-radius:24px;background:linear-gradient(140deg,#3c271c,#191b1d 36%,#3d281e 78%,#141d21);box-shadow:0 28px 65px #0009,inset 0 0 0 2px #9b6b463b}
        .cd-book{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) 300px;gap:0;min-height:610px;filter:drop-shadow(0 10px 8px #0008)}
        .cd-page{color:var(--ink);padding:30px 28px 34px;position:relative;min-width:0;background:radial-gradient(ellipse at 15% 18%,#fff1d1 0%,transparent 55%),repeating-linear-gradient(0deg,#e7d3a9 0px,#e7d3a9 31px,#e4cea4 32px);border:1px solid #aa8d67;box-shadow:inset 0 0 35px #8e603c3b}
        .cd-left{border-radius:14px 0 0 14px;border-right:4px double #a48a68}.cd-right{border-radius:0 14px 14px 0;background:radial-gradient(ellipse at 80% 20%,#f8e5c2,transparent 62%),repeating-linear-gradient(0deg,#e1cba4 0px,#e1cba4 31px,#dec69c 32px)}
        .cd-page:after{content:"";pointer-events:none;position:absolute;inset:9px;border:1px solid #9d7d5030;border-radius:9px}
        .cd-casehead{display:flex;justify-content:space-between;align-items:start;gap:10px}
        .cd-caseid{font-size:12px;font-weight:900;letter-spacing:.13em}.cd-stamp{font-size:13px;font-weight:900;letter-spacing:.07em;text-transform:uppercase;color:#8e392d;border:3px double #9d4536;padding:6px 9px;transform:rotate(-9deg);border-radius:3px;max-width:120px;text-align:center}
        .cd-page h2{font:700 clamp(27px,2.5vw,37px)/1.08 Georgia,serif;margin:18px 0 22px;letter-spacing:-.025em}
        .cd-sectiontitle{display:flex;align-items:center;gap:8px;font-weight:800;font-size:15px;margin:16px 0 9px}
        .cd-mission{padding:13px 15px;background:#f2dfb9a6;border-left:4px solid #b58b43;line-height:1.6;font-size:14px;box-shadow:0 2px 8px #7e54241f}
        .cd-hint{padding:13px 15px;background:#d6c6d1;border-radius:4px;transform:rotate(-.5deg);font-size:13px;line-height:1.6;box-shadow:2px 3px 7px #5c45363d}
        .cd-specimen-wrap{min-width:0}.cd-specimen-wrap .cd-specimen{width:100%}.cd-specimen-visit{display:flex;align-items:center;justify-content:center;gap:5px;font-size:11px;font-weight:800;text-decoration:none;color:#345e53;background:#f0dfb9;border:1px solid #9e865f;border-radius:0 0 8px 8px;padding:8px 4px;margin-top:-5px;padding-top:12px}.cd-specimen-visit:hover{background:#fff1cb}.cd-specimens{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:13px}
        .cd-specimen{position:relative;display:flex;align-items:center;gap:9px;text-align:left;padding:12px 9px;border:2px solid #5a635c;border-radius:9px;color:#f1f1e8;background:linear-gradient(145deg,#19333a,#101b22);min-width:0;min-height:76px;transition:transform .2s,border-color .2s,box-shadow .2s}
        .cd-specimen:hover{transform:translateY(-2px)}.cd-specimen-selected{border-color:#9ce8b4;box-shadow:0 0 0 2px #86e7aa39,inset 0 0 25px #1c93613a}.cd-specimen:has(input:focus-visible){outline:3px solid #f5d48d;outline-offset:2px}.cd-specimen:has(input:disabled){cursor:default}.cd-specimen-checkbox{width:20px;height:20px;flex-shrink:0;accent-color:#9ce8b4;cursor:pointer}.cd-specimen-info{min-width:0}.cd-specimen-instruction{color:#c8e8bd!important;font-size:9px!important}
        .cd-specimen-slide{display:flex;align-items:center;justify-content:center;flex-shrink:0;width:72px;max-width:34%}.cd-specimen strong{font-size:12px;display:block}.cd-specimen small{font-size:10px;color:#c6d4d0;display:block;margin-top:4px}.cd-check{position:absolute;top:6px;right:6px;color:#9aeab8}
        .cd-action{border:1px solid #3b6a5c;border-radius:7px;background:#164d3c;color:#f0f9ee;font-weight:800;padding:12px 15px;display:inline-flex;align-items:center;gap:8px;font-size:13px;margin-top:16px}.cd-action:disabled{opacity:.4}
        .cd-verdict{border:2px solid #517e5a;background:#23573d;color:#f4f5e7;padding:15px;border-radius:9px;margin-top:15px;font-size:13px;line-height:1.6}.cd-verdict.bad{border-color:#b78b51;background:#765332}.cd-verdict strong{display:flex;align-items:center;gap:8px;font-size:16px}
        .cd-note{margin:12px 0;font-size:13px;line-height:1.65}.cd-note strong{color:#5d4432}
        .cd-paperlink{display:inline-flex;align-items:center;gap:7px;font-size:12px;color:#4d4638;text-decoration:underline;text-underline-offset:3px;margin-top:14px;font-weight:800}
        .cd-photoarea{display:flex;align-items:flex-start;justify-content:center;min-height:190px;padding:5px 5px 0;position:relative}
        .cd-photo{width:43%;max-width:190px;aspect-ratio: .82;padding:8px 8px 25px;background:#f8eee0;box-shadow:3px 5px 10px #0004;transform:rotate(-8deg);border:1px solid #c2ae92;text-align:center}
        .cd-photo:nth-child(2){transform:rotate(9deg) translate(-12px,15px)}
        .cd-photoart{height:100%;min-height:120px;display:flex;align-items:center;justify-content:center;font-size:58px;background:radial-gradient(circle at center,#596d8a,#17223d 68%);border:1px solid #a5a7b1}
        .cd-photo:nth-child(2) .cd-photoart{background:radial-gradient(circle,#43775a,#112a29 70%)}
        .cd-photocaption{font:italic 11px Georgia,serif;padding-top:5px;color:#3a312b}
        .cd-notebook{margin-top:16px;border-top:2px solid #6e5a40;padding-top:13px}
        .cd-notebook h3{font:italic 22px Georgia,serif;margin:0 0 14px}
        .cd-noteitem{display:flex;align-items:center;gap:9px;margin:11px 0;font:italic 15px Georgia,serif;cursor:pointer;width:fit-content}.cd-note-checkbox{width:18px;height:18px;flex-shrink:0;accent-color:#446c51;cursor:pointer}.cd-note-checkbox:disabled{cursor:default}
        .cd-sketch{margin:20px auto 0;max-width:260px;border:2px dashed #7d6a5180;border-radius:48% 52% 43% 57%;height:120px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:5px;color:#74634b;transform:rotate(-5deg)}.cd-sketch span{font:italic 13px Georgia,serif}
        .cd-sidebar{padding:26px 19px;background:linear-gradient(140deg,#192630,#0a1721 70%);border:2px solid #6a4c38;border-radius:0 14px 14px 0;color:#e6e3d9;box-shadow:inset 0 0 25px #0008}
        .cd-sidebar h2{font:26px Georgia,serif;margin:0;display:flex;align-items:center;gap:10px}.cd-sidebar p{color:#b2c7c8;font-size:12px;line-height:1.6}
        .cd-casebutton{display:flex;justify-content:space-between;align-items:center;gap:10px;width:100%;border:1px solid #52616a;border-radius:8px;background:#0b1a25;color:#e7e9e6;text-align:left;padding:12px 10px;font-size:12px;margin-top:8px;line-height:1.4}.cd-casebutton.active{border-color:#a0dfaf;box-shadow:0 0 10px #70e2aa36}.cd-casebutton svg{flex-shrink:0}
        .cd-progress{display:flex;gap:7px;margin-top:19px}.cd-dot{flex:1;height:7px;border-radius:10px;background:#354953}.cd-dot.done{background:#83d8b3;box-shadow:0 0 8px #83d8b388}
        .cd-reset{display:inline-flex;align-items:center;gap:7px;color:#b3d5d1;background:none;border:0;font-size:12px;margin-top:15px}
        .cd-mobile-nav{display:none}.cd-freecases{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:16px}.cd-freecases button{padding:7px 9px;border:1px solid #9e865f;background:#ead5ad;color:#493625;border-radius:5px;font-size:11px}.cd-freecases button.active{background:#3d5d4b;color:#fff}
        .cd-next{margin-left:12px;background:#514432}.cd-science{margin-top:22px;border-top:1px solid #53656a;padding-top:14px;color:#bdcbd0;font-size:11px;line-height:1.7}
        @media(max-width:1100px){.cd-book{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.cd-sidebar{grid-column:1/-1;border-radius:0 0 14px 14px;display:block}.cd-sidebar .cd-caselist{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.cd-casebutton{margin:0}.cd-hero{align-items:flex-start;flex-direction:column}}
        @media(max-width:700px){.cd-wrap{padding:14px 12px 38px}.cd-top{padding:0 5px}.cd-brand{font-size:8px;letter-spacing:.12em}.cd-hero{padding:26px 5px 16px;gap:18px}.cd-fingerprint{width:32px}.cd-hero h1{font-size:38px}.cd-hero p{font-size:12px}.cd-tabs{width:100%}.cd-tab{flex:1;justify-content:center;padding:11px 6px;font-size:11px}.cd-desk{padding:8px;border-radius:14px}.cd-book{display:block;min-height:0}.cd-page{padding:23px 18px 25px;border-radius:8px!important;border:1px solid #aa8d67}.cd-page h2{font-size:30px}.cd-left,.cd-right,.cd-sidebar{display:none}.cd-book[data-mobile="mission"] .cd-left,.cd-book[data-mobile="notes"] .cd-right,.cd-book[data-mobile="cases"] .cd-sidebar{display:block}.cd-sidebar{border-radius:8px;padding:22px 16px}.cd-sidebar .cd-caselist{display:block}.cd-casebutton{margin-top:8px}.cd-mobile-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-bottom:9px}.cd-mobile-nav button{border:1px solid #496571;border-radius:7px;background:#0d2531;color:#d7e7e3;padding:10px 3px;font-size:11px;display:flex;justify-content:center;align-items:center;gap:5px}.cd-mobile-nav button.active{background:#265248;border-color:#8fd5b5;color:#fff}.cd-photoarea{min-height:180px}.cd-specimens{gap:8px}.cd-specimen{min-height:74px}}
        @media(min-width:701px) and (max-height:550px){.cd-hero{padding:12px 8px}.cd-hero h1{font-size:35px}.cd-page{padding:18px}.cd-book{min-height:490px}}

        /* V5: Warm detective study, aged paper and leather notebook. */
        .cd-root{background:radial-gradient(ellipse at 50% 4%,#164047 0%,transparent 54%),radial-gradient(ellipse at 0% 72%,#3b2417 0%,transparent 40%),linear-gradient(120deg,#06131a,#071b21 55%,#0a1119)}
        .cd-root:before{opacity:.075}
        .cd-root:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,#060e15a8,transparent 26%,transparent 75%,#060e15aa);z-index:0}
        .cd-desk{background:linear-gradient(135deg,#4b2c1b,#21170f 28%,#4a2b1b 65%,#160e0b);border:2px solid #94683d80;box-shadow:0 26px 70px #000b,inset 0 0 0 3px #090806,inset 0 0 0 8px #a7784322;padding:17px 16px 18px}
        .cd-page{background:radial-gradient(ellipse at 22% 16%,#fff0ca 0%,transparent 55%),radial-gradient(ellipse at 90% 85%,#ad774e28,transparent 54%),repeating-linear-gradient(0deg,#e8d2a8 0px,#e8d2a8 31px,#e3c99f 32px);box-shadow:inset 0 0 38px #82552d4d,inset 0 0 0 6px #f7e7c331}
        .cd-right{background:radial-gradient(ellipse at 70% 12%,#f9e9c8,transparent 58%),radial-gradient(ellipse at 10% 90%,#ab744033,transparent 50%),repeating-linear-gradient(0deg,#e6cea4 0px,#e6cea4 31px,#dfc399 32px)}
        .cd-left{border-left:7px solid #ac814a70;border-right:5px double #9e7d54}
        .cd-sidebar{background:linear-gradient(145deg,#1b2730,#09141d 68%);border-color:#8a5c35;box-shadow:inset 0 0 24px #0009,inset 0 0 0 3px #a97b4126}
        .cd-casebutton.active{border-color:#b6e3bc;box-shadow:0 0 0 1px #a4d9b2,0 0 17px #77d9a53a}
        .cd-photo{background:#f7ead3;border:1px solid #aa8b65;box-shadow:3px 7px 14px #4c321d77;transition:transform .25s ease}
        .cd-photo:first-child{transform:rotate(-8deg) translateY(5px)}
        .cd-photo:nth-child(2){transform:rotate(8deg) translate(-12px,18px)}
        .cd-photoart{background:radial-gradient(circle at 50% 42%,#4d7180,#142d3b 76%);min-height:120px}
        .cd-photo:nth-child(2) .cd-photoart{background:radial-gradient(circle at 50% 42%,#496d52,#132d2b 76%)}
        .cd-photoart svg{width:88%;height:auto;max-width:180px;filter:drop-shadow(0 0 8px #9bd9d255)}
        .cd-photoart img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.86) contrast(1.05)}
        .cd-photoarea:after{content:"";position:absolute;left:50%;top:-7px;width:24px;height:35px;border:4px solid #b68b45;border-radius:11px 11px 8px 8px;transform:rotate(10deg);box-shadow:1px 2px 4px #0005;pointer-events:none}
        .cd-hint{background:#d8c5d1;box-shadow:2px 4px 8px #64483250}
        .cd-sketch{border-color:#856d4c88;background:radial-gradient(ellipse,#f4e2bd66,transparent);}
        .cd-case-navigation{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;align-items:center}
        .cd-case-prev,.cd-case-next{display:inline-flex;justify-content:center;align-items:center;gap:6px;min-height:42px;padding:10px 13px;border-radius:7px;font-size:12px;font-weight:800;transition:background .2s,transform .2s}
        .cd-case-prev{border:1px solid #94734b;background:#f2dfb9;color:#4b3524}
        .cd-case-next{border:1px solid #38563f;background:#254a34;color:#fff4df}
        .cd-case-prev:hover:not(:disabled),.cd-case-next:hover:not(:disabled){transform:translateY(-2px)}
        .cd-case-navigation button:disabled{opacity:.35;cursor:not-allowed}
        .cd-note-checkbox{accent-color:#536c50}
        
        @media(max-width:700px){.cd-desk{padding:8px}.cd-left{border-left:1px solid #aa8d67}.cd-case-navigation{display:grid;grid-template-columns:1fr 1fr;gap:7px}.cd-case-prev,.cd-case-next{padding:10px 5px;font-size:11px}.cd-photoarea:after{display:none}}
        @media(max-width:360px){.cd-case-navigation{grid-template-columns:1fr}}

        /* Single continuous full-page laboratory scene; no decorative cutout overlays. */
        .cd-root{background-color:#071820;background-image:linear-gradient(90deg,rgba(3,12,18,.18),rgba(3,12,18,.06) 50%,rgba(3,12,18,.18)),url('/images/museum/cell-explorer/celldetektiverna/cellDektektivernaBackground.webp');background-size:cover;background-position:center top;background-attachment:fixed}
        .cd-root:before,.cd-root:after{display:none!important}
        .cd-desk:before,.cd-desk:after{display:none!important}
        .cd-wrap{isolation:isolate}
        @media(max-width:700px){.cd-root{background-attachment:scroll;background-size:auto 100vh;background-position:center top}.cd-desk{box-shadow:0 18px 48px #000c}}
        @media(min-width:701px) and (max-width:1100px){.cd-root{background-attachment:scroll;background-position:center top}}
        .cd-science-sketch{width:min(100%,320px);margin:22px auto 10px;text-align:center;transform:rotate(-3deg);pointer-events:none}
        .cd-science-sketch img{width:100%;height:auto;display:block;opacity:.82;mix-blend-mode:multiply;filter:sepia(.25)}
        .cd-science-sketch figcaption{font:italic 13px Georgia,serif;color:#765b40;margin-top:-6px}
        @media(prefers-reduced-motion:reduce){.cd-root *{transition:none!important}}

        /* V7 — notebook finishing touches */
        .cd-hero h1,.cd-sidebar h2{font-family:var(--font-detective-display),Georgia,serif}
        .cd-page h2{font-family:var(--font-detective-book),Georgia,serif;letter-spacing:-.035em}
        .cd-notebook h3{font-family:var(--font-detective-handwriting),cursive;font-size:32px;font-weight:600}
        .cd-noteitem{font-family:var(--font-detective-handwriting),cursive;font-size:22px;line-height:1.1;gap:11px;margin:12px 0}
        .cd-photocaption{font-family:var(--font-detective-handwriting),cursive;font-size:17px}
        .cd-science-sketch figcaption{font-family:var(--font-detective-handwriting),cursive;font-size:19px}
        /* An empty box must look empty, even with browser dark-mode defaults. */
        .cd-note-checkbox{appearance:none;-webkit-appearance:none;display:inline-grid;place-content:center;width:19px;height:19px;flex-shrink:0;margin:0;border:1.5px solid #6d5237;border-radius:2px;background:#f6e7c8;box-shadow:inset 0 1px 2px #6b4d2520;cursor:pointer}
        .cd-note-checkbox:checked{background:#35634a;border-color:#28543b}
        .cd-note-checkbox:checked:after{content:"";width:5px;height:10px;border:solid #fff7dc;border-width:0 2px 2px 0;transform:rotate(45deg) translate(-1px,-1px)}
        .cd-note-checkbox:focus-visible{outline:3px solid #2f7969;outline-offset:3px}
        .cd-note-checkbox:disabled{cursor:default;opacity:.75}
        /* Make the scientific drawing a marginal observation, not a third photo. */
        .cd-science-sketch{width:min(66%,225px);margin:14px 6% 6px auto;transform:rotate(-4deg)}
        .cd-science-sketch img{max-height:155px;object-fit:contain;opacity:.74}
        .cd-notebook .cd-noteitem + .cd-science-sketch{margin-top:19px}
        @media(max-width:700px){.cd-science-sketch{width:min(74%,205px);margin:20px auto 8px}.cd-noteitem{font-size:21px}}
        @media(min-width:701px) and (max-width:1150px){.cd-science-sketch{width:min(62%,190px)}}

        /* V10: mobile research notebook */
        .cd-hint-details{margin-top:21px}
        .cd-hint-details summary{list-style:none;cursor:pointer;user-select:none}
        .cd-hint-details summary::-webkit-details-marker{display:none}
        .cd-hint-toggle{margin:0 0 9px;min-height:38px}
        .cd-hint-action,.cd-hint-chevron{display:none}
        .cd-hint-details:focus-within summary:focus-visible{outline:3px solid #43836f;outline-offset:3px;border-radius:5px}
        .cd-specimen-info{flex:1;min-width:0;overflow-wrap:normal;word-break:normal}
        .cd-specimen strong,.cd-specimen small{overflow-wrap:normal;word-break:normal}
        .cd-photocaption{font-size:clamp(12px,1.15vw,16px);white-space:normal;line-height:1.15}
        @media(max-width:900px), (max-height:550px) and (max-width:1100px){
          .cd-hint-details .cd-hint{display:none}
          .cd-hint-details[open] .cd-hint{display:block}
          .cd-hint-toggle{background:#ead6b6;border:1px solid #b89a70;border-radius:8px;padding:9px 11px;margin-bottom:0}
          .cd-hint-details[open] .cd-hint-toggle{margin-bottom:10px}
          .cd-hint-action{display:inline;margin-left:auto;font-size:11px;font-weight:700;color:#69523e}
          .cd-hint-chevron{display:block;flex-shrink:0;transition:transform .2s ease}
          .cd-hint-details[open] .cd-hint-chevron{transform:rotate(90deg)}
          .cd-hint-details[open] .cd-hint-action{font-size:0}
          .cd-hint-details[open] .cd-hint-action:after{content:"Dölj ledtråd";font-size:11px}
          .cd-specimen{min-height:76px;padding:11px 12px;gap:12px}
          .cd-specimen-slide{width:62px;max-width:none}
          .cd-specimen strong{font-size:14px}
          .cd-specimen small{font-size:11px}
          .cd-specimen-instruction{font-size:10px!important}
          .cd-specimen-visit{font-size:12px;padding:12px 8px;margin-top:-5px}
        }
        /* Portrait phones: full-width specimen cards. Landscape: two per row. */
        @media(max-width:700px) and (orientation:portrait){
          .cd-specimens{grid-template-columns:minmax(0,1fr);gap:10px}
        }
        @media(max-width:900px) and (orientation:landscape){
          .cd-specimens{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
          .cd-specimen{min-width:0;min-height:68px;padding:8px;gap:7px}
          .cd-specimen-slide{width:40px;flex-shrink:0}
          .cd-specimen strong{font-size:12px}
          .cd-specimen small{font-size:10px}
          .cd-specimen-instruction{font-size:9px!important}
          .cd-specimen-visit{padding:9px 5px;font-size:11px}
        }
        @media(max-width:390px){
          .cd-page{padding:21px 13px 25px}
          .cd-specimen{gap:9px;padding:10px 9px}
          .cd-specimen-slide{width:54px}
          .cd-specimen strong{font-size:13px}
          .cd-specimen-info small{font-size:10px}
        }
      `}</style>
      <div className="cd-wrap">
        <header className="cd-top">
          <nav
            aria-label="Tillbaka från Celldetektiverna"
            className="cd-return-links"
          >
            <Link
              href="/museum/cell-explorer/forskningsstation"
              className="cd-back"
            >
              <ArrowLeft size={16} /> Forskningsstationerna
            </Link>
            <Link href={SPECIMEN_ROUTE} className="cd-back">
              <Microscope size={16} /> Cellpreparaten
            </Link>
          </nav>
          <span className="cd-brand">The Unfolding Universe · Museum</span>
        </header>
        <div className="cd-hero">
          <div className="cd-titleline">
            <Fingerprint className="cd-fingerprint" size={58} strokeWidth={1} />
            <div>
              <h1>Celldetektiverna</h1>
              <p>
                Fyra celler. Sex mysterier. Undersök 3D-preparaten, samla bevis
                och avslöja livets hemligheter.
              </p>
            </div>
          </div>
          <div
            className="cd-tabs"
            role="tablist"
            aria-label="Undersökningsläge"
          >
            <button
              className="cd-tab"
              role="tab"
              aria-selected={mode === "guided"}
              onClick={() => setMode("guided")}
            >
              <Compass size={16} /> Guidad utredning
            </button>
            <button
              className="cd-tab"
              role="tab"
              aria-selected={mode === "free"}
              onClick={() => setMode("free")}
            >
              <Search size={16} /> Fri undersökning
            </button>
          </div>
        </div>
        <div className="cd-desk">
          <nav className="cd-mobile-nav" aria-label="Detektivbokens sidor">
            <button
              className={mobilePage === "mission" ? "active" : ""}
              onClick={() => setMobilePage("mission")}
            >
              <FileSearch size={14} /> Uppdrag
            </button>
            <button
              className={mobilePage === "notes" ? "active" : ""}
              onClick={() => setMobilePage("notes")}
            >
              <ClipboardList size={14} /> Bevis
            </button>
            <button
              className={mobilePage === "cases" ? "active" : ""}
              onClick={() => setMobilePage("cases")}
            >
              <BookOpen size={14} /> Fall
            </button>
          </nav>
          <div className="cd-book" data-mobile={mobilePage}>
            <section
              className="cd-page cd-left"
              aria-label="Utredningens uppdrag"
            >
              <div className="cd-casehead">
                <span className="cd-caseid">
                  FALL{" "}
                  {String(
                    cases.findIndex((c) => c.id === current.id) + 1,
                  ).padStart(2, "0")}{" "}
                  / {String(cases.length).padStart(2, "0")}
                </span>
                <span className="cd-stamp">
                  {isRevealed && same(chosen, current.answer)
                    ? "FALL LÖST"
                    : "UTREDNING PÅGÅR"}
                </span>
              </div>
              {mode === "free" && (
                <div className="cd-freecases" style={{ marginTop: 16 }}>
                  {cases.map((c) => (
                    <button
                      key={c.id}
                      className={current.id === c.id ? "active" : ""}
                      onClick={() => setActiveFree(c.id)}
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              )}
              <h2>{current.title}</h2>
              <div className="cd-sectiontitle">
                <Compass size={19} /> Uppdrag
              </div>
              <div className="cd-mission">
                {current.question} Undersök preparaten och samla bevis som
                stöder ditt svar.
              </div>
              <details className="cd-hint-details" key={current.id}>
                <summary className="cd-sectiontitle cd-hint-toggle">
                  <Lightbulb size={19} />
                  <span>Ledtråd</span>
                  <span className="cd-hint-action" aria-hidden="true">
                    Visa ledtråd
                  </span>
                  <ChevronRight
                    size={17}
                    className="cd-hint-chevron"
                    aria-hidden="true"
                  />
                </summary>
                <div className="cd-hint">{current.hint}</div>
              </details>
              <div className="cd-sectiontitle" style={{ marginTop: 23 }}>
                <Search size={19} /> Undersök preparaten
              </div>
              <p className="cd-note" style={{ marginTop: 0 }}>
                Kryssa i rutan för varje cell du tror passar. Använd ”Undersök i
                3D” för att leta efter ledtrådar.
              </p>
              <div className="cd-specimens">
                {specimens.map((cell) => {
                  const selected = chosen.includes(cell.id);
                  return (
                    <div key={cell.id} className="cd-specimen-wrap">
                      <label
                        className={`cd-specimen ${selected ? "cd-specimen-selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          className="cd-specimen-checkbox"
                          checked={selected}
                          disabled={isRevealed}
                          onChange={() => toggle(cell.id)}
                          aria-label={`Jag tror att ${cell.name.toLowerCase()} passar i mysteriet`}
                        />
                        <span className="cd-specimen-slide" aria-hidden="true">
                          <CellSpecimenSlide kind={cell.id} />
                        </span>
                        <span className="cd-specimen-info">
                          <strong>{cell.name}</strong>
                          <small>Preparat {cell.number}</small>
                          <small className="cd-specimen-instruction">
                            {selected
                              ? "Min misstanke ✓"
                              : "Kryssa i om den passar"}
                          </small>
                        </span>
                      </label>
                      <Link
                        href={specimenHref(cell.id)}
                        className="cd-specimen-visit"
                      >
                        <Microscope size={14} /> Undersök i 3D{" "}
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  );
                })}
              </div>
              {!isRevealed ? (
                <button
                  className="cd-action"
                  disabled={!chosen.length}
                  onClick={() => {
                    const saved = readDetectiveProgress();
                    persist(saved.answers, [
                      ...new Set([...saved.revealed, current.id]),
                    ]);
                  }}
                >
                  <ShieldCheck size={17} /> Granska mina bevis
                </button>
              ) : (
                <div
                  className={`cd-verdict ${same(chosen, current.answer) ? "" : "bad"}`}
                >
                  <strong>
                    <Check size={20} />
                    {same(chosen, current.answer)
                      ? "Mysteriet löst!"
                      : "Utredningen behöver ses över"}
                  </strong>
                  <div style={{ marginTop: 7 }}>{current.explanation}</div>
                  {!same(chosen, current.answer) && (
                    <button
                      style={{
                        marginTop: 10,
                        textDecoration: "underline",
                        fontWeight: 700,
                      }}
                      onClick={() =>
                        persist(
                          readDetectiveProgress().answers,
                          readDetectiveProgress().revealed.filter(
                            (id) => id !== current.id,
                          ),
                        )
                      }
                    >
                      Försök igen
                    </button>
                  )}
                </div>
              )}
              <div>
                {mode === "guided" && (
                  <nav
                    className="cd-case-navigation"
                    aria-label="Bläddra mellan fall"
                  >
                    <button
                      type="button"
                      className="cd-case-prev"
                      disabled={index === 0}
                      onClick={() => {
                        setIndex((i) => Math.max(0, i - 1));
                        setMobilePage("mission");
                      }}
                    >
                      <ChevronLeft size={16} /> Föregående fall
                    </button>
                    <button
                      type="button"
                      className="cd-case-next"
                      disabled={index === cases.length - 1}
                      onClick={() => {
                        setIndex((i) => Math.min(cases.length - 1, i + 1));
                        setMobilePage("mission");
                      }}
                    >
                      Nästa fall <ArrowRight size={16} />
                    </button>
                  </nav>
                )}
              </div>
            </section>
            <section
              className="cd-page cd-right"
              aria-label="Mina bevis och anteckningar"
            >
              <div className="cd-photoarea">
                {(POLAROID_PAIRS[current.id] ?? ["animal", "plant"]).map(
                  (cell) => (
                    <div className="cd-photo" key={cell}>
                      <div className="cd-photoart">
                        <img
                          src={`/images/museum/cell-explorer/celldetektiverna/polaroids/${cell}.webp`}
                          alt={`Fotografi av ${specimens.find((s) => s.id === cell)?.name ?? "cell"} i 3D`}
                          loading="lazy"
                          draggable={false}
                        />
                      </div>
                      <div className="cd-photocaption">
                        {specimens.find((s) => s.id === cell)?.name} ·{" "}
                        {POLAROID_LABELS[cell]}
                      </div>
                    </div>
                  ),
                )}
              </div>
              <div className="cd-notebook">
                <h3>✎ Mina anteckningar</h3>
                <p className="cd-note">
                  Bevismaterial: <strong>{current.evidence}</strong>
                </p>
                <p className="cd-note" style={{ marginTop: 0 }}>
                  Kryssa i här eller på preparatkorten. Dina misstankar följer
                  med till fältboken i 3D.
                </p>
                {specimens.map((cell) => (
                  <label className="cd-noteitem" key={cell.id}>
                    <input
                      type="checkbox"
                      className="cd-note-checkbox"
                      checked={chosen.includes(cell.id)}
                      disabled={isRevealed}
                      onChange={() => toggle(cell.id)}
                      aria-label={`Markera ${cell.name.toLowerCase()} som misstanke`}
                    />
                    <span>{cell.name}</span>
                  </label>
                ))}
                <figure className="cd-science-sketch">
                  <img
                    src={`/images/museum/cell-explorer/celldetektiverna/sketches/${current.id}.svg`}
                    alt={`Handritad vetenskaplig skiss: ${current.evidence}`}
                    width={320}
                    height={210}
                    loading="lazy"
                  />
                  <figcaption>{current.evidence} · fältstudie</figcaption>
                </figure>
                {isRevealed && (
                  <div
                    className="cd-note"
                    style={{ borderTop: "1px solid #9a8667", paddingTop: 13 }}
                  >
                    <strong>Forskarens slutsats:</strong> {current.explanation}
                  </div>
                )}
                {!isRevealed && (
                  <p className="cd-note" style={{ marginTop: 25 }}>
                    Öppna de riktiga 3D-preparaten och granska cellernas delar
                    innan du drar din slutsats.
                  </p>
                )}
              </div>
            </section>
            <aside className="cd-sidebar" aria-label="Detektivboken">
              <h2>
                <ShieldCheck size={25} color="#dfb969" /> Detektivboken
              </h2>
              <p>Dina fynd sparas automatiskt i den här webbläsaren.</p>
              <div className="cd-caselist" style={{ marginTop: 22 }}>
                {cases.map((c, i) => (
                  <button
                    key={c.id}
                    className={`cd-casebutton ${current.id === c.id ? "active" : ""}`}
                    onClick={() => {
                      if (mode === "free") setActiveFree(c.id);
                      else setIndex(i);
                      setMobilePage("mission");
                    }}
                  >
                    <span>
                      {String(i + 1).padStart(2, "0")} · {c.title}
                    </span>
                    {revealed.includes(c.id) &&
                    same(answers[c.id] || [], c.answer) ? (
                      <Check size={16} color="#94e6b2" />
                    ) : (
                      <ChevronRight size={15} />
                    )}
                  </button>
                ))}
              </div>
              <div className="cd-progress">
                {cases.map((c) => (
                  <span
                    key={c.id}
                    className={`cd-dot ${revealed.includes(c.id) && same(answers[c.id] || [], c.answer) ? "done" : ""}`}
                  />
                ))}
              </div>
              <p>
                {solved} av {cases.length} mysterier lösta
              </p>
              <button className="cd-reset" onClick={reset}>
                <RotateCcw size={14} /> Börja om
              </button>
              <div className="cd-science">
                <strong>Forskarens notering</strong>
                <br />
                Bakterie- och arképreparaten visar två specifika arter. Deras
                egenskaper gäller inte automatiskt alla bakterier eller arkéer.
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
