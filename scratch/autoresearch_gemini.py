#!/usr/bin/env python3
"""
Autoresearch Gemini Adapter: Karpathy-style optimization using Gemini API.
"""

import argparse
import json
import os
import sys
import time
import requests
from datetime import datetime, timezone
from pathlib import Path

# Content configurations
CONTENT_TYPES = {
    "landing_page": {
        "elements": ["hero_headline", "subheadline", "cta"],
        "dimensions": ["first_impression", "clarity", "trust", "urgency", "would_convert"],
    }
}

EXPERT_PANEL = [
    {"id": "cmo", "name": "CMO at a mid-market B2B company", "lens": "Would this make me stop and engage?"},
    {"id": "skeptical_founder", "name": "Skeptical founder", "lens": "Do I believe this? Would I trust this company?"},
    {"id": "cro", "name": "Conversion rate optimizer", "lens": "Is this clear, specific, and action-driving?"},
    {"id": "copywriter", "name": "Senior copywriter", "lens": "Is this compelling, differentiated, and well-crafted?"},
    {"id": "founder", "name": "Your CEO/founder", "lens": "Direct, ROI-obsessed, no BS. Would I put this on my site?"},
]

def load_gemini_key():
    """Load GEMINI_API_KEY from env or .env.local."""
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        return key
    
    # Try reading .env.local
    env_local_path = Path("/Users/peifengni/plumbify-site/.env.local")
    if env_local_path.exists():
        for line in env_local_path.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=")[1].strip('"').strip("'")
    return None

def call_gemini(prompt: str, api_key: str, model: str = "gemini-2.5-flash") -> str:
    """Call Google Gemini API via REST requests."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        res_data = response.json()
        text = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
        return text
    except Exception as e:
        print(f"Gemini API Error: {e}", file=sys.stderr)
        # Fallback if json mode fails or errors
        return ""

def extract_elements(content: str, content_type: str) -> dict[str, str]:
    lines = content.strip().split("\n")
    elements = {}
    if lines:
        elements["hero_headline"] = lines[0]
    if len(lines) > 1:
        elements["subheadline"] = lines[1]
    if len(lines) > 2:
        elements["cta"] = lines[2]
    return elements

def generate_variants(api_key: str, element_name: str, current_text: str,
                      content_type: str, num_variants: int,
                      evolution_notes: str = "", model: str = "gemini-2.5-flash") -> list[str]:
    evolution_context = ""
    if evolution_notes:
        evolution_context = f"\n\nEvolution notes from previous round (push these winning patterns further):\n{evolution_notes}"

    prompt = f"""Generate exactly {num_variants} variants of this {content_type} {element_name}.

Current text:
---
{current_text}
---
{evolution_context}

Rules:
- Each variant should be meaningfully different (not just word swaps)
- Vary approach: some direct, some curiosity-driven, some data-led, some emotional
- Keep the core value proposition intact
- Match the content type expectations for {element_name}

Return ONLY a JSON array of {num_variants} strings. No explanation.
Format: ["Variant 1 text", "Variant 2 text", ...]"""

    text = call_gemini(prompt, api_key, model)
    try:
        variants = json.loads(text)
        if isinstance(variants, list):
            return [str(v) for v in variants[:num_variants]]
    except Exception:
        pass
    return [current_text] * num_variants

def score_variants(api_key: str, variants: list[str], element_name: str,
                    content_type: str, model: str = "gemini-2.5-flash") -> list[dict]:
    dimensions = CONTENT_TYPES[content_type]["dimensions"]
    panel_desc = "\n".join(
        f"  {i+1}. {e['name']} — Lens: \"{e['lens']}\"" for i, e in enumerate(EXPERT_PANEL)
    )
    dim_desc = ", ".join(dimensions)
    variants_text = "\n".join(f"  Variant {i+1}: \"{v}\"" for i, v in enumerate(variants))

    prompt = f"""You are scoring {element_name} variants for a {content_type}.

Expert Panel:
{panel_desc}

Score Dimensions: {dim_desc}

Variants:
{variants_text}

For EACH variant, have each expert score it 0-100 on each dimension.
Then compute the average score across all experts and dimensions.

Return ONLY valid JSON in this exact format:
[
  {{
    "variant_id": 1,
    "text": "variant text",
    "expert_scores": {{
      "cmo": 72, "skeptical_founder": 68, "cro": 75, "copywriter": 70, "founder": 65
    }},
    "dimension_scores": {{
      "first_impression": 71, "clarity": 72, "trust": 73, "urgency": 74, "would_convert": 75
    }},
    "avg_score": 70
  }},
  ...
]"""

    text = call_gemini(prompt, api_key, model)
    try:
        scores = json.loads(text)
        if isinstance(scores, list):
            return scores
    except Exception:
        pass
    return [{"variant_id": i+1, "text": v, "avg_score": 0} for i, v in enumerate(variants)]

def run_optimization(api_key: str, element_name: str, current_text: str,
                      content_type: str, num_variants: int = 10,
                      max_rounds: int = 3, min_score: int = 80,
                      model: str = "gemini-2.5-flash") -> dict:
    rounds = []
    best_score = 0
    best_text = current_text
    evolution_notes = ""

    for round_num in range(1, max_rounds + 1):
        print(f"    Round {round_num}/{max_rounds}...", file=sys.stderr)
        variants = generate_variants(
            api_key, element_name, current_text, content_type,
            num_variants, evolution_notes, model
        )
        scored = score_variants(api_key, variants, element_name, content_type, model)
        scored.sort(key=lambda x: x.get("avg_score", 0), reverse=True)

        top_3 = scored[:3]
        round_data = {
            "round": round_num,
            "element": element_name,
            "variants": scored,
            "top_3_ids": [s.get("variant_id", i+1) for i, s in enumerate(top_3)],
            "winner_score": top_3[0].get("avg_score", 0) if top_3 else 0,
        }
        rounds.append(round_data)

        if top_3 and top_3[0].get("avg_score", 0) > best_score:
            best_score = top_3[0].get("avg_score", 0)
            best_text = top_3[0].get("text", current_text)

        print(f"    Best score: {best_score}", file=sys.stderr)
        if best_score >= min_score:
            break

        if top_3:
            evolution_notes = "Top performers and what they did well:\n"
            for s in top_3:
                evolution_notes += f"- Score {s.get('avg_score', 0)}: \"{s.get('text', '')[:100]}\"\n"

    return {
        "element": element_name,
        "original": current_text,
        "winner": best_text,
        "winner_score": best_score,
        "rounds": rounds,
    }

def cross_breed(api_key: str, element_winners: dict[str, dict],
                content_type: str, model: str = "gemini-2.5-flash") -> dict:
    elements_desc = "\n".join(
        f"  {name}: \"{data['winner'][:200]}\" (score: {data['winner_score']})"
        for name, data in element_winners.items()
    )

    prompt = f"""Combine these winning {content_type} elements into 5 cohesive complete versions.
Each version should naturally integrate all winning elements while maintaining their strengths.

Winning elements:
{elements_desc}

Return JSON array of 5 objects:
[
  {{
    "hero_headline": "combined text",
    "subheadline": "combined text",
    "cta": "combined text",
    "rationale": "Why this combination works"
  }},
  ...
]"""

    text = call_gemini(prompt, api_key, model)
    try:
        combinations = json.loads(text)
        if isinstance(combinations, list):
            return combinations[0] if combinations else {}
    except Exception:
        pass
    return {}

def write_report(name: str, content_type: str, element_results: dict, final_score: float, output_dir: str):
    report = f"""# Autoresearch Report: {name}
**Run date:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}
**Content type:** {content_type}
**Final score:** {final_score}/100

## Winner

"""
    for elem_name, data in element_results.items():
        report += f"### {elem_name}\n{data['winner']}\n\n"

    report += "## Score Progression\n\n"
    report += "| Element | Round 1 Best | Final |\n"
    report += "|---------|-------------|-------|\n"
    for elem_name, data in element_results.items():
        r1_score = data["rounds"][0]["winner_score"] if data["rounds"] else 0
        report += f"| {elem_name} | {r1_score} | {data['winner_score']} |\n"

    Path(output_dir).mkdir(parents=True, exist_ok=True)
    report_path = os.path.join(output_dir, f"{name}-optimization-report.md")
    with open(report_path, "w") as f:
        f.write(report)
    return report_path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output-dir", default="data")
    parser.add_argument("--name", default="landing_page_copy")
    args = parser.parse_args()

    api_key = load_gemini_key()
    if not api_key:
        print("ERROR: GEMINI_API_KEY not found.", file=sys.stderr)
        sys.exit(1)

    content = Path(args.input).read_text()
    elements = extract_elements(content, "landing_page")

    element_results = {}
    for elem_name, elem_text in elements.items():
        print(f"\n  Optimizing: {elem_name}", file=sys.stderr)
        result = run_optimization(api_key, elem_name, elem_text, "landing_page")
        element_results[elem_name] = result

    if len(element_results) > 1:
        print(f"\n  Cross-breeding winners...", file=sys.stderr)
        combined = cross_breed(api_key, element_results, "landing_page")
        for elem_name in element_results:
            if elem_name in combined:
                element_results[elem_name]["winner"] = combined[elem_name]

    scores = [r["winner_score"] for r in element_results.values()]
    final_score = round(sum(scores) / len(scores), 1) if scores else 0

    output_dir = args.output_dir
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    experiments = {
        "run_id": f"autoresearch-gemini-{int(time.time())}",
        "content_type": "landing_page",
        "elements": element_results,
        "final_score": final_score,
    }
    json_path = os.path.join(output_dir, f"{args.name}-experiments.json")
    with open(json_path, "w") as f:
        json.dump(experiments, f, indent=2, default=str)

    report_path = write_report(args.name, "landing_page", element_results, final_score, output_dir)

    print(f"\n{'='*60}")
    print(f"  AUTORESEARCH COMPLETE (GEMINI)")
    print(f"  Final score: {final_score}/100")
    print(f"  Experiments: {json_path}")
    print(f"  Report:      {report_path}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
