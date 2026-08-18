#!/usr/bin/env python3
"""Heuristic anti-slop linter: mechanical subset of ASD-STE100.

Reports form findings per 100 words. The caller chooses strict or flavored
mode and decides which findings require edits.
Not a certified STE checker. Em dashes counted as slop markers.

Source: woosal1337/blog videos/ep01-the-cure-for-ai-slop/ste-lint.py
"""
from __future__ import annotations

import glob
import json
import os
import re
import sys
from typing import Sequence

MARKETING = [
    "seamless",
    "seamlessly",
    "robust",
    "powerful",
    "cutting-edge",
    "effortless",
    "effortlessly",
    "world-class",
    "next-generation",
    "revolutionary",
    "blazing",
    "lightning-fast",
    "elegant",
    "delightful",
    "turnkey",
    "best-in-class",
    "state-of-the-art",
    "game-changing",
    "first-class",
    "battle-tested",
    "enterprise-grade",
    "supercharge",
    "unlock",
    "unleash",
    "empower",
    "empowers",
]
BANNED = [
    "begin",
    "begins",
    "commence",
    "commences",
    "initiate",
    "initiates",
    "originate",
    "utilize",
    "utilizes",
    "utilizing",
    "leverage",
    "leverages",
    "leveraging",
    "facilitate",
    "facilitates",
    "ensure",
    "ensures",
    "ensuring",
    "prior to",
    "subsequent to",
    "obtain",
    "obtains",
    "acquire",
    "acquires",
    "demonstrate",
    "demonstrates",
    "additionally",
    "furthermore",
    "moreover",
    "comprehensive",
    "comprehensively",
    "utilization",
    "aforementioned",
    "henceforth",
    "therein",
    "whilst",
    "amongst",
    "numerous",
    "myriad",
    "plethora",
    "in order to",
    "a variety of",
    "in the event that",
    "due to the fact that",
    "it is important to note",
]
PHRASAL = [
    "spin up",
    "spin down",
    "reach out",
    "dive into",
    "dives into",
    "diving into",
    "kick off",
    "kicks off",
    "roll out",
    "rolls out",
    "tear down",
    "ramp up",
    "circle back",
    "drill down",
    "spun up",
    "reaching out",
]
MODAL_HEDGE = [
    "it is important to note",
    "it should be noted",
    "it is worth noting",
    "please note that",
    "as mentioned",
    "as noted above",
]
BE = r"(?:am|is|are|was|were|be|been|being)"
PP_IRREG = (
    r"(?:done|made|sent|read|built|kept|held|set|put|run|written|shown|"
    r"given|taken|found|got|gotten|seen|known|thrown|drawn)"
)


def strip_code(t: str) -> str:
    t = re.sub(r"```.*?```", " ", t, flags=re.S)
    t = re.sub(r"`[^`]*`", " ", t)
    return t


def sentences(text: str) -> list[str]:
    out: list[str] = []
    for line in text.split("\n"):
        s = line.strip()
        if not s:
            continue
        s = re.sub(r"^\s*#{1,6}\s*", "", s)
        s = re.sub(r"^\s*(?:[-*+]|\d+[.)])\s+", "", s)
        if not s:
            continue
        parts = re.split(r"(?<=[.!?:])\s+(?=[A-Z0-9\"'\-])", s)
        for p in parts:
            p = p.strip()
            if p:
                out.append(p)
    return out


def wc(s: str) -> int:
    return len([w for w in re.findall(r"[A-Za-z0-9][A-Za-z0-9'\-/]*", s)])


def count_ci(text: str, phrases: list[str]) -> tuple[int, list[str]]:
    n = 0
    hits: list[str] = []
    low = text.lower()
    for ph in phrases:
        for _m in re.finditer(r"(?<![a-z])" + re.escape(ph) + r"(?![a-z])", low):
            n += 1
            hits.append(ph)
    return n, hits


def lint(text: str) -> dict:
    raw = text
    text = strip_code(text)
    sents = sentences(text)
    words = sum(wc(s) for s in sents) or 1
    v: dict[str, int] = {}
    longs = [(wc(s), s) for s in sents if wc(s) > 20]
    v["long_sentence(>20w)"] = len(longs)
    v["semicolon"] = text.count(";")
    v["contraction"] = len(re.findall(r"\b\w+[''](?:t|re|ve|ll|d|s|m)\b", text))
    v["passive_voice"] = len(re.findall(rf"\b{BE}\s+(?:\w+ed|{PP_IRREG})\b", text, re.I))
    v["ing_main_verb"] = len(re.findall(rf"\b{BE}\s+\w+ing\b", text, re.I))
    v["nominalization"] = len(
        re.findall(
            r"\b(?:perform(?:s|ed)?|conduct(?:s|ed)?|provide(?:s|d)?|carry out|carries out|make use of|makes use of)\b",
            text,
            re.I,
        )
    ) + len(re.findall(r"\b\w{4,}(?:tion|ment|ance|ence)\s+of\b", text, re.I))
    v["phrasal_verb"], _ = count_ci(text, PHRASAL)
    v["banned_word"], bh = count_ci(text, BANNED)
    v["marketing_adjective"], mh = count_ci(text, MARKETING)
    v["modal_hedge"], _ = count_ci(text, MODAL_HEDGE)
    paras = [p for p in re.split(r"\n\s*\n", raw) if p.strip()]
    v["long_paragraph(>6s)"] = sum(1 for p in paras if len(sentences(strip_code(p))) > 6)
    em = raw.count("\u2014") + raw.count("\u2013")
    total = sum(v.values())
    rhythm = detect_rhythm(raw)
    return {
        "words": words,
        "sentences": len(sents),
        "violations": v,
        "total": total,
        "total_per100w": round(total * 100.0 / words, 2),
        "em_dash(slop-marker)": em,
        "rhythm": rhythm,
        "longest_sentence_words": (
            max(longs)[0] if longs else max((wc(s) for s in sents), default=0)
        ),
        "sample_marketing": list(dict.fromkeys(mh))[:6],
        "sample_banned": list(dict.fromkeys(bh))[:6],
    }


def detect_rhythm(raw: str) -> dict:
    """Prose-rhythm findings mirroring the house voice bans.

    Flags staccato stacks (3+ consecutive sentences of <=6 words) and clipped
    negation-fragment tails ("No X." lines closing a paragraph). Variance is
    reported as context only and never counts toward total.
    """
    text = strip_code(raw)
    staccato: list[tuple[int, list[int]]] = []
    frag_tails: list[str] = []
    stack_w: list[int] = []
    prev_bullet = False
    for line in text.split("\n"):
        s = line.strip()
        if not s or s.startswith("|") or re.match(r"^[-*_]{3,}$", s):
            continue
        is_heading = bool(re.match(r"^#{1,6}\s", s))
        is_bullet = bool(re.match(r"(?:[-*+]|\d+[.)])\s+", s))
        if is_heading:
            if len(stack_w) >= 3:
                staccato.append((len(staccato), list(stack_w)))
            stack_w = []
            continue
        if is_bullet and not prev_bullet and stack_w:
            # prose ended, list starts: close the prose stack
            if len(stack_w) >= 3:
                staccato.append((len(staccato), list(stack_w)))
            stack_w = []
        s = re.sub(r"^\s*#{1,6}\s*", "", s)
        s = re.sub(r"^\s*(?:[-*+]|\d+[.)])\s+", "", s)
        if not s:
            prev_bullet = is_bullet
            continue
        parts = re.split(r"(?<=[.!?:])\s+(?=[A-Z0-9\"'\-])", s)
        line_stack: list[int] = []
        for p in parts:
            p = p.strip()
            if not p:
                continue
            n = wc(p)
            if n <= 6:
                stack_w.append(n)
                line_stack.append(n)
            else:
                if len(stack_w) >= 3:
                    staccato.append((len(staccato), list(stack_w)))
                stack_w = []
                line_stack = []
        if is_bullet:
            # a bullet is one unit: its short items never chain into the next bullet
            if len(line_stack) >= 3:
                staccato.append((len(staccato), list(line_stack)))
            stack_w = []
        prev_bullet = is_bullet

    for para in re.split(r"\n\s*\n", text):
        plines = [l for l in para.strip().split("\n") if l.strip() and not l.strip().startswith("|")]
        if not plines:
            continue
        last = plines[-1].strip()
        parts = re.split(r"(?<=[.!?:])\s+", last)
        frags = [p for p in parts if re.match(r"^(?:No|None)\s+\w", p)]
        if len(frags) >= 2 and wc(last) <= 12:
            frag_tails.append(last)

    lens = [wc(p) for p in sentences(text)]
    return {
        "staccato_stacks(3+ <=6w)": len(staccato),
        "staccato_samples": staccato[:3],
        "negation_fragment_tails": len(frag_tails),
        "negation_fragment_samples": frag_tails[:3],
        "sentence_len_variance": round(variance(lens), 2),
    }


def variance(xs: "Sequence[float]") -> float:
    if not xs:
        return 0.0
    mu = sum(xs) / len(xs)
    return sum((x - mu) ** 2 for x in xs) / len(xs)


if __name__ == "__main__":
    files = sys.argv[1:] or []
    if not files:
        print(json.dumps(lint(sys.stdin.read()), indent=2))
        sys.exit(0)
    exp: list[str] = []
    for f in files:
        exp += sorted(glob.glob(f)) if any(c in f for c in "*?[") else [f]
    for f in exp:
        with open(f, encoding="utf-8") as fh:
            r = lint(fh.read())
        print(
            f"{os.path.basename(f):32} words={r['words']:4d} total={r['total']:3d} "
            f"per100w={r['total_per100w']:6.2f} em_dash={r['em_dash(slop-marker)']:2d}"
        )
