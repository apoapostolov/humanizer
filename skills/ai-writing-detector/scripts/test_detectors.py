#!/usr/bin/env python
"""Run text through hosted AI detectors and report disagreement.

Live API mode uploads the full draft to every service you hold a key for.
Require --upload. --demo is offline and makes no network calls.
"""
from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import json
import os
import sys
import textwrap
from dataclasses import dataclass
from typing import Callable, Optional

try:
    import requests
except ImportError:
    print("ERROR: install requests first  ->  pip install requests", file=sys.stderr)
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

DISCLOSURE = """UPLOAD: this run sends the full draft to every detector with a key set
(GPTZero, Originality.ai, ZeroGPT, Sapling, Copyleaks). Do not use on embargoed,
NDA, or unannounced material. No key means that service is skipped.
"""


@dataclass
class DetectorResult:
    name: str
    score: Optional[float]
    error: Optional[str] = None


def detect_gptzero(text: str) -> DetectorResult:
    key = os.getenv("GPTZERO_API_KEY")
    if not key:
        return DetectorResult("GPTZero", None, "no API key (set GPTZERO_API_KEY)")
    try:
        r = requests.post(
            "https://api.gptzero.me/v2/predict/text",
            headers={"x-api-key": key, "Content-Type": "application/json"},
            json={"document": text},
            timeout=30,
        )
        r.raise_for_status()
        data = r.json()
        prob = data["documents"][0]["class_probabilities"]["ai"]
        return DetectorResult("GPTZero", round(prob * 100, 1))
    except Exception as e:
        return DetectorResult("GPTZero", None, str(e))


def detect_originality(text: str) -> DetectorResult:
    key = os.getenv("ORIGINALITY_API_KEY")
    if not key:
        return DetectorResult("Originality.ai", None, "no API key (set ORIGINALITY_API_KEY)")
    try:
        r = requests.post(
            "https://api.originality.ai/api/v1/scan/ai",
            headers={"X-OAI-API-KEY": key, "Content-Type": "application/json"},
            json={"content": text, "title": "detector-test"},
            timeout=30,
        )
        r.raise_for_status()
        data = r.json()
        prob = data["score"]["ai"]
        return DetectorResult("Originality.ai", round(prob * 100, 1))
    except Exception as e:
        return DetectorResult("Originality.ai", None, str(e))


def detect_zerogpt(text: str) -> DetectorResult:
    key = os.getenv("ZEROGPT_API_KEY")
    if not key:
        return DetectorResult("ZeroGPT", None, "no API key (set ZEROGPT_API_KEY)")
    try:
        r = requests.post(
            "https://api.zerogpt.com/api/detect/detectText",
            headers={"ApiKey": key, "Content-Type": "application/json"},
            json={"input_text": text},
            timeout=30,
        )
        r.raise_for_status()
        data = r.json()
        score = data["data"]["fakePercentage"]
        return DetectorResult("ZeroGPT", round(float(score), 1))
    except Exception as e:
        return DetectorResult("ZeroGPT", None, str(e))


def detect_sapling(text: str) -> DetectorResult:
    key = os.getenv("SAPLING_API_KEY")
    if not key:
        return DetectorResult("Sapling", None, "no API key (set SAPLING_API_KEY)")
    try:
        r = requests.post(
            "https://api.sapling.ai/api/v1/aidetect",
            json={"key": key, "text": text},
            timeout=30,
        )
        r.raise_for_status()
        data = r.json()
        prob = data["score"]
        return DetectorResult("Sapling", round(prob * 100, 1))
    except Exception as e:
        return DetectorResult("Sapling", None, str(e))


def detect_copyleaks(text: str) -> DetectorResult:
    key = os.getenv("COPYLEAKS_API_KEY")
    email = os.getenv("COPYLEAKS_EMAIL")
    if not key or not email:
        return DetectorResult(
            "Copyleaks", None,
            "no creds (set COPYLEAKS_API_KEY and COPYLEAKS_EMAIL)",
        )
    try:
        login = requests.post(
            "https://id.copyleaks.com/v3/account/login/api",
            json={"email": email, "key": key},
            timeout=30,
        )
        login.raise_for_status()
        token = login.json()["access_token"]
        scan_id = f"detector-test-{abs(hash(text)) % 10**8}"
        r = requests.post(
            f"https://api.copyleaks.com/v2/writer-detector/{scan_id}/check",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            json={"text": text},
            timeout=60,
        )
        r.raise_for_status()
        data = r.json()
        score = data["summary"]["ai"]
        return DetectorResult("Copyleaks", round(score * 100, 1))
    except Exception as e:
        return DetectorResult("Copyleaks", None, str(e))


MANUAL_DETECTORS = {
    "Writer.com": "https://writer.com/ai-content-detector/",
    "Scribbr": "https://www.scribbr.com/ai-detector/",
    "QuillBot": "https://quillbot.com/ai-content-detector",
    "Hive Moderation": "https://hivemoderation.com/ai-generated-content-detection",
}


def detect_manual(name: str, url: str, text: str) -> DetectorResult:
    print(f"\n--- MANUAL: {name} ---")
    print(f"  URL: {url}")
    print(f"  Paste this text (first 80 chars shown): {text[:80]}...")
    raw = input(f"  Score from {name} (0-100, or blank to skip): ").strip()
    if not raw:
        return DetectorResult(name, None, "skipped")
    try:
        return DetectorResult(name, float(raw))
    except ValueError:
        return DetectorResult(name, None, f"invalid input: {raw!r}")


def verdict_for_spread(spread: float) -> tuple[str, str]:
    if spread <= 15:
        return ("CONSENSUS", "detectors agree (still not proof)")
    if spread <= 30:
        return ("MIXED", "some signal, no single score is defensible")
    if spread <= 50:
        return ("DIVERGENT", "the detectors are flipping a coin")
    return ("USELESS", "spread over 50 points; the opposite detector also 'proves' it")


API_DETECTORS: list[Callable[[str], DetectorResult]] = [
    detect_gptzero,
    detect_originality,
    detect_zerogpt,
    detect_sapling,
    detect_copyleaks,
]

_DEMO_DETECTORS = ("GPTZero", "Originality.ai", "ZeroGPT", "Sapling", "Copyleaks")


def run_demo(text: str) -> list[DetectorResult]:
    digest = hashlib.sha256(text.encode("utf-8")).digest()
    results = []
    for i, name in enumerate(_DEMO_DETECTORS):
        score = round((digest[i] / 255) * 100, 1)
        results.append(DetectorResult(name, score))
    return results


def run_parallel(text: str) -> list[DetectorResult]:
    results: list[DetectorResult] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(API_DETECTORS)) as pool:
        futures = [pool.submit(fn, text) for fn in API_DETECTORS]
        for f in concurrent.futures.as_completed(futures):
            results.append(f.result())
    order = ["GPTZero", "Originality.ai", "ZeroGPT", "Sapling", "Copyleaks"]
    results.sort(key=lambda r: order.index(r.name) if r.name in order else 99)
    return results


def run_manual(text: str) -> list[DetectorResult]:
    return [detect_manual(name, url, text) for name, url in MANUAL_DETECTORS.items()]


def render_report(text: str, results: list[DetectorResult]) -> dict:
    valid = [r for r in results if r.score is not None]
    scores = [r.score for r in valid]

    print("\n" + "=" * 60)
    preview = text.strip().replace("\n", " ")[:60]
    print(f'Text: "{preview}..."')
    print(f"Length: {len(text.split())} words\n")
    print("Detector scores (% AI probability):")
    for r in results:
        if r.score is not None:
            print(f"  {r.name:<16} {r.score:>5}")
        else:
            print(f"  {r.name:<16}   --   ({r.error})")

    if len(scores) < 2:
        print("\nNot enough detectors returned a score to compute spread.")
        print("Add API keys or use --manual.")
        return {"spread": None, "verdict": "INSUFFICIENT_DATA"}

    lo, hi = min(scores), max(scores)
    spread = round(hi - lo, 1)
    label, translation = verdict_for_spread(spread)
    print(f"\nMin: {lo}   Max: {hi}   Spread: {spread}\n")
    print(f"Verdict: {label} - {translation}")
    print("=" * 60)
    return {
        "scores": {r.name: r.score for r in valid},
        "min": lo,
        "max": hi,
        "spread": spread,
        "verdict": label,
        "translation": translation,
    }


def main():
    p = argparse.ArgumentParser(
        description="Run text through hosted AI detectors and report disagreement.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""
            Examples:
              python test_detectors.py --demo --text "Some draft"
              python test_detectors.py --upload --text "Some draft"
              python test_detectors.py --upload --stdin --json out.json
        """),
    )
    src = p.add_mutually_exclusive_group(required=True)
    src.add_argument("--text", help="text to test (inline)")
    src.add_argument("--stdin", action="store_true", help="read text from stdin")
    p.add_argument("--upload", action="store_true",
                   help="consent: send the full draft to keyed hosted APIs")
    p.add_argument("--manual", action="store_true",
                   help="paste-mode for detectors without APIs")
    p.add_argument("--demo", action="store_true",
                   help="offline hash-derived scores; no network")
    p.add_argument("--json", metavar="PATH",
                   help="write the report as JSON to PATH")
    args = p.parse_args()

    text = args.text if args.text else sys.stdin.read()
    text = text.strip()
    if len(text) < 50:
        print("WARNING: text is very short. Detectors are unreliable below 100 words.\n",
              file=sys.stderr)

    if args.demo:
        results = run_demo(text)
    elif args.upload:
        print(DISCLOSURE, file=sys.stderr)
        results = run_parallel(text)
    else:
        print("Refusing live APIs without --upload (draft would leave this machine).",
              file=sys.stderr)
        print("Use --demo for offline scores, or pass --upload to consent.", file=sys.stderr)
        sys.exit(2)

    if args.manual:
        results.extend(run_manual(text))

    report = render_report(text, results)
    if args.json:
        with open(args.json, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        print(f"\nReport written to {args.json}")


if __name__ == "__main__":
    main()
