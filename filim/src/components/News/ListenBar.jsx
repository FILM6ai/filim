"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// "Listen to this article" - the article read aloud by the voice built into
// the visitor's browser or phone. Francois, 17 Nov: written articles are good
// for SEO but heavy to read; he asked for a free reader on top of each one.
//
// No service, no account, no cost: speechSynthesis ships with Safari, Chrome,
// Edge, iOS and Android. The voice is whatever the device has, so it sounds
// best on Apple devices and recent Chrome, plainer on some older Androids.
//
// The text is spoken in short pieces rather than one long utterance: Chrome
// silently stops a single utterance after roughly 15 seconds, and pausing a
// long one is unreliable in several browsers. With pieces, "pause" is simply
// "stop and remember which piece", and play picks up from there.

const SPEEDS = [1, 1.25, 1.5];
const WORDS_PER_MINUTE = 160;
// About 12 seconds of speech: under the point where Chrome cuts an utterance.
const MAX_PIECE = 200;

// The article body as plain sentences: pictures, videos and embeds dropped,
// each paragraph or heading kept as its own line so the voice pauses between
// them instead of running headings into the next sentence.
const toPieces = (title, html) => {
  if (typeof window === "undefined") return [];
  const doc = new DOMParser().parseFromString(String(html || ""), "text/html");
  doc
    .querySelectorAll("img, iframe, video, audio, figure, script, style, svg")
    .forEach((node) => node.remove());
  const blocks = [...doc.body.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li, blockquote")]
    .map((node) => node.textContent.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  // Editors without block markup: fall back to the whole text.
  if (blocks.length === 0) {
    const all = doc.body.textContent.replace(/\s+/g, " ").trim();
    if (all) blocks.push(all);
  }
  const lines = [String(title || "").trim(), ...blocks].filter(Boolean);

  // A sentence too long for one breath is cut at commas and dashes, and if
  // still too long, between words.
  const shorten = (sentence) => {
    if (sentence.length <= MAX_PIECE) return [sentence];
    const out = [];
    let current = "";
    for (const part of sentence.split(/(?<=[,;:\u2013\u2014])\s+|\s+(?=[\u2013\u2014-]\s)/)) {
      for (const word of part.length > MAX_PIECE ? part.split(/\s+/) : [part]) {
        const next = (current + " " + word).trim();
        if (next.length > MAX_PIECE && current) {
          out.push(current);
          current = word;
        } else {
          current = next;
        }
      }
    }
    if (current) out.push(current);
    return out;
  };

  // Pieces of at most MAX_PIECE characters, cut at sentence ends where possible.
  const pieces = [];
  for (const line of lines) {
    const sentences = (line.match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g) || [line]).flatMap(shorten);
    let current = "";
    for (const sentence of sentences) {
      const next = (current + " " + sentence).trim();
      if (next.length > MAX_PIECE && current) {
        pieces.push(current);
        current = sentence.trim();
      } else {
        current = next;
      }
    }
    if (current) pieces.push(current);
  }
  return pieces;
};

// The nicest English voice the device offers. Names vary by platform; the
// "Natural"/"Enhanced"/"Premium" and Google voices are the human-sounding ones.
const pickVoice = () => {
  const voices = window.speechSynthesis.getVoices() || [];
  const english = voices.filter((v) => /^en(-|_|$)/i.test(v.lang));
  const pool = english.length ? english : voices;
  const score = (v) =>
    (/natural|neural|enhanced|premium/i.test(v.name) ? 4 : 0) +
    (/google/i.test(v.name) ? 3 : 0) +
    (/samantha|daniel|karen|serena|moira|aria|jenny|guy/i.test(v.name) ? 2 : 0) +
    (/en-(gb|us)/i.test(v.lang) ? 1 : 0) +
    (v.localService ? 0 : 1);
  return [...pool].sort((a, b) => score(b) - score(a))[0] || null;
};

const ListenBar = ({ title, html, accent = "#000000" }) => {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState("idle"); // idle | playing | paused
  const [speed, setSpeed] = useState(1);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const runRef = useRef(0);

  const pieces = useMemo(() => toPieces(title, html), [title, html]);
  const minutes = useMemo(() => {
    const words = pieces.join(" ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  }, [pieces]);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  // A new article, or leaving the page: stop talking.
  useEffect(() => {
    indexRef.current = 0;
    setIndex(0);
    setState("idle");
    return () => {
      runRef.current += 1;
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [title, html]);

  // Queue everything from `from` onwards in one go. Queuing inside the click
  // keeps iOS happy, which only lets speech start from a user gesture.
  const speakFrom = (from, rate) => {
    const synth = window.speechSynthesis;
    const run = ++runRef.current;
    synth.cancel();
    const voice = pickVoice();
    for (let i = from; i < pieces.length; i += 1) {
      const u = new SpeechSynthesisUtterance(pieces[i]);
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang;
      } else {
        u.lang = "en-GB";
      }
      u.rate = rate;
      u.onstart = () => {
        if (run !== runRef.current) return;
        indexRef.current = i;
        setIndex(i);
      };
      u.onend = () => {
        if (run !== runRef.current) return;
        if (i === pieces.length - 1) {
          indexRef.current = 0;
          setIndex(0);
          setState("idle");
        }
      };
      synth.speak(u);
    }
    setState("playing");
  };

  const toggle = () => {
    if (state === "playing") {
      runRef.current += 1;
      window.speechSynthesis.cancel();
      setState("paused");
    } else {
      speakFrom(indexRef.current, speed);
    }
  };

  const changeSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (state === "playing") speakFrom(indexRef.current, next);
  };

  const restart = () => {
    indexRef.current = 0;
    setIndex(0);
    speakFrom(0, speed);
  };

  if (!supported || pieces.length === 0) return null;

  const progress = state === "idle" ? 0 : Math.round((index / pieces.length) * 100);
  const label =
    state === "playing" ? "Pause" : state === "paused" ? "Resume" : "Listen to this article";

  return (
    <div
      className="listen-bar flex items-center gap-4 border border-[#E4E7E9] rounded-full pl-2 pr-4 py-2 mb-6 bg-white"
      role="region"
      aria-label="Listen to this article"
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105"
        style={{ background: accent }}
      >
        {state === "playing" ? (
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="3" y="2" width="3.5" height="12" fill="currentColor" />
            <rect x="9.5" y="2" width="3.5" height="12" fill="currentColor" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 2.5v11l9.5-5.5z" fill="currentColor" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-sans text-[#191C1F] leading-tight">
          {state === "idle" ? "Listen to this article" : state === "playing" ? "Listening..." : "Paused"}
          <span className="text-[#77878F]"> · {minutes} min</span>
        </p>
        <div className="h-[3px] bg-[#E4E7E9] rounded-full mt-2 overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, background: accent }}
          />
        </div>
      </div>

      {state !== "idle" && (
        <button
          type="button"
          onClick={restart}
          className="shrink-0 text-[12px] font-sans text-[#475156] hover:text-black"
          aria-label="Start again"
          title="Start again"
        >
          ↺
        </button>
      )}
      <button
        type="button"
        onClick={changeSpeed}
        className="shrink-0 text-[12px] font-sans font-semibold border border-[#E4E7E9] rounded-full px-2.5 py-1 text-[#191C1F] hover:border-black"
        aria-label={`Reading speed ${speed}x`}
        title="Reading speed"
      >
        {speed}x
      </button>
    </div>
  );
};

export default ListenBar;
