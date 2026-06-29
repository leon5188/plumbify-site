#!/usr/bin/env python3
"""
Plumbify AI Sales Team - Agent 2: Personalized Outreach & GHL Note Sync
This script fetches pending contacts from GoHighLevel CRM, scrapes their websites,
generates a custom-crafted cold email or SMS script using Gemini AI,
and saves the result as a Note on the contact profile in GHL, updating their tags.
"""

import os
import sys
import json
import urllib.request
import urllib.parse
import argparse
import re

# Load Next.js local environment variables
def load_env(env_path):
    env_vars = {}
    if not os.path.exists(env_path):
        return env_vars
    try:
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    env_vars[key] = val
    except Exception as e:
        print(f"[-] Warning: Failed to read .env.local file: {e}", file=sys.stderr)
    return env_vars

# Fetch contacts from GoHighLevel
def fetch_ghl_contacts(token, location_id):
    print("[*] Fetching all contacts list from GoHighLevel (paginated)...")
    contacts = []
    url = f"https://services.leadconnectorhq.com/contacts/?locationId={location_id}&limit=100"
    headers = {
        "Authorization": f"Bearer {token}",
        "Version": "2021-07-28",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    while url:
        req = urllib.request.Request(url, headers=headers, method="GET")
        try:
            with urllib.request.urlopen(req) as res:
                data = json.loads(res.read().decode("utf-8"))
                page_contacts = data.get("contacts", [])
                contacts.extend(page_contacts)
                
                meta = data.get("meta", {})
                url = meta.get("nextPageUrl")
                if not page_contacts:
                    break
        except Exception as e:
            print(f"[-] Failed to fetch contacts from GHL: {e}", file=sys.stderr)
            break
            
    print(f"[+] Successfully fetched {len(contacts)} contacts from GoHighLevel.")
    return contacts

# Dynamic search fallback: Find website URL from company name via DuckDuckGo
def find_company_website(company_name, city):
    if not company_name:
        return None
    query = f"{company_name} {city or ''} plumbing service website"
    print(f"[*] Website missing in GHL. Searching website for '{company_name}' in '{city or ''}'...")
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote_plus(query)}"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    )
    try:
        with urllib.request.urlopen(req) as res:
            html = res.read().decode("utf-8")
        links = re.findall(r'class="result__url"[^>]*href="([^"]+)"', html)
        for l in links:
            if "uddg=" in l:
                parsed = urllib.parse.urlparse(l)
                queries = urllib.parse.parse_qs(parsed.query)
                if "uddg" in queries:
                    l = queries["uddg"][0]
            exclusions = ["duckduckgo.com", "google.com", "facebook.com", "instagram.com", 
                          "youtube.com", "wikipedia.org", "yelp.com", "yellowpages.com", 
                          "angi.com", "homeadvisor.com", "bbb.org", "linkedin.com"]
            if not any(domain in l.lower() for domain in exclusions):
                print(f"[+] Found website: {l}")
                return l
        return None
    except Exception as e:
        print(f"[-] Website search failed: {e}", file=sys.stderr)
        return None

# Fetch webpage markdown using Jina Reader (Agent-Reach)
def fetch_webpage_markdown(target_url):
    print(f"[*] Scraping website: {target_url}...")
    jina_url = f"https://r.jina.ai/{target_url}"
    req = urllib.request.Request(
        jina_url,
        headers={
            "User-Agent": "Mozilla/5.0",
            "X-Return-Format": "markdown"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            return res.read().decode("utf-8")
    except Exception as e:
        print(f"[-] Failed to scrape website: {e}", file=sys.stderr)
        return ""

# Generate personalized outreach text using Gemini API
def generate_outreach_content(contact, website_markdown, mode, api_key):
    name = f"{contact.get('firstName', '')} {contact.get('lastName', '')}".strip() or "Business Owner"
    company = contact.get("companyName") or "your company"
    city = contact.get("city") or ""
    state = contact.get("state") or ""

    print(f"[*] Generating customized {mode} outreach copy for {company}...")

    # Truncate website text to save context window tokens
    site_text = website_markdown[:10000] if website_markdown else "No website available."

    prompt = (
        f"You are a highly converting B2B SaaS Sales Development Representative (SDR) representing Plumbify (https://plumbify.net).\n"
        "Plumbify is an AI-first operating system for local plumbing/HVAC businesses that solves core operational leakages:\n"
        "1. Missed-Call Text-Back: Automatically texts back missed calls in <30 seconds so leads don't call Google Maps competitors.\n"
        "2. 24/7 AI Receptionist: A floating website widget that pre-qualifies customers and books jobs directly into their calendar.\n"
        "3. Auto Google Reviews: Instantly requests reviews upon job completion to boost local SEO rankings.\n\n"
        f"Your task is to write a highly customized, natural {mode} outreach copy targeting:\n"
        f"- Contact Person: {name}\n"
        f"- Company Name: {company}\n"
        f"- Business Location: {city}, {state}\n\n"
        f"Below is the text crawled from their website:\n"
        f"\"\"\"\n{site_text}\n\"\"\"\n\n"
        f"Guidelines for {mode}:\n"
    )

    if mode == "email":
        prompt += (
            "- Subject Line: Must be punchy, direct, and mention their company name or city (no clickbait).\n"
            "- Email Body: Must be concise (under 150 words), conversational, friendly, and professional.\n"
            "- Personalization: Mention a specific detail from their website text (e.g. their services, localized area, or lack of online booking chat widget).\n"
            "- Call-to-Action: A low-friction ask (e.g., asking if they are open to a quick 10-minute call next week or a 14-day free trial).\n"
            "- Sign-off: 'Leon, Founder at Plumbify'.\n"
            "- Do NOT include any intro or markdown tags like ```email or ```html. Output ONLY the raw subject and email body."
        )
    else: # SMS
        prompt += (
            "- Character Limit: Must be under 160 characters.\n"
            "- Style: Extremely direct, friendly, and conversational.\n"
            "- Sign-off: Must end with 'Leon @ Plumbify' (do NOT use placeholders like '[Your Name]' or '[Leon]').\n"
            "- Example: 'Hey John, saw Texas Elite Plumbing online. Quick question: do you guys text back missed calls automatically, or is that manual? - Leon @ Plumbify'\n"
            "- Do NOT include any intro or formatting tags. Output ONLY the raw text message."
        )

    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }

    req = urllib.request.Request(
        api_url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode("utf-8"))
            content = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
            # Clean up potential markdown wrappers
            content = content.replace("```markdown", "").replace("```text", "").replace("```", "").strip()
            return content
    except Exception as e:
        print(f"[-] Gemini API text generation failed: {e}", file=sys.stderr)
        return ""

# Create a Note inside the Contact profile in GoHighLevel CRM
def create_ghl_contact_note(contact_id, note_body, token):
    print(f"[*] Posting generated outreach copy as a Note to GHL Contact ID: {contact_id}...")
    url = f"https://services.leadconnectorhq.com/contacts/{contact_id}/notes"
    payload = {
        "body": note_body
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
        "Version": "2021-07-28",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as res:
            json.loads(res.read().decode("utf-8"))
            print("[+] Note successfully posted.")
            return True
    except Exception as e:
        print(f"[-] Failed to post GHL note: {e}", file=sys.stderr)
        return False

# Update Contact Tags in GoHighLevel CRM
def update_ghl_contact_tags(contact_id, tags, target_mode, token):
    print(f"[*] Updating contact tags to mark outreach as drafted...")
    
    # Remove pending tag and add finalized tag
    new_tags = [t for t in tags if t not in ["cold-email-pending", "cold-sms-pending"]]
    new_tags.append("outreach-drafted")

    url = f"https://services.leadconnectorhq.com/contacts/{contact_id}"
    payload = {
        "tags": new_tags
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
        "Version": "2021-07-28",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="PUT"
    )
    try:
        with urllib.request.urlopen(req) as res:
            json.loads(res.read().decode("utf-8"))
            print(f"[+] GHL Tags updated successfully: {new_tags}")
            return True
    except Exception as e:
        print(f"[-] Failed to update GHL tags: {e}", file=sys.stderr)
        return False

def main():
    parser = argparse.ArgumentParser(description="Plumbify AI Outreach Script Generator Agent (Agent 2)")
    parser.add_argument("--limit", type=int, default=5, help="Max number of pending contacts to process")
    args = parser.parse_args()

    # Load environmental tokens
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    env_vars = load_env(os.path.join(project_root, ".env.local"))

    gemini_key = env_vars.get("GEMINI_API_KEY")
    ghl_token = env_vars.get("GHL_PRIVATE_TOKEN")
    ghl_location = env_vars.get("GHL_LOCATION_ID")

    if not gemini_key or not ghl_token or not ghl_location:
        print("[-] Error: Credentials missing from .env.local.", file=sys.stderr)
        sys.exit(1)

    # Fetch contacts
    contacts = fetch_ghl_contacts(ghl_token, ghl_location)
    if not contacts:
        print("[-] No contacts found in GHL location. Exiting.")
        sys.exit(0)

    # Filter for pending tags
    pending_leads = []
    for c in contacts:
        tags = c.get("tags", [])
        if "cold-email-pending" in tags:
            pending_leads.append((c, "email"))
        elif "cold-sms-pending" in tags:
            pending_leads.append((c, "sms"))

    if not pending_leads:
        print("[+] No contacts found with 'cold-email-pending' or 'cold-sms-pending' tags. Ready for next harvest.")
        sys.exit(0)

    print(f"[+] Found {len(pending_leads)} pending outreach candidates. Processing up to {args.limit}...")
    
    processed = 0
    for contact, mode in pending_leads:
        if processed >= args.limit:
            break

        company = contact.get("companyName") or "Unknown Company"
        contact_id = contact.get("id")
        current_tags = contact.get("tags", [])

        print(f"\n--- Processing Outreach for: {company} (ID: {contact_id}) ---")

        # Step 1: Resolve website URL
        website = contact.get("website")
        if not website:
            city = contact.get("city", "")
            website = find_company_website(company, city)

        # Step 2: Fetch website markdown text
        markdown = ""
        if website:
            markdown = fetch_webpage_markdown(website)
        else:
            print("[-] Website URL could not be resolved. Generating generic outreach...")

        # Step 3: Call Gemini AI to write personalized copy
        outreach_copy = generate_outreach_content(contact, markdown, mode, gemini_key)
        if not outreach_copy:
            print("[-] Failed to generate outreach copy. Skipping.")
            continue

        print(f"[+] Generated Script:\n{outreach_copy}\n")

        # Step 4: Write draft note to GoHighLevel contact profile
        note_body = f"--- PLUMBIFY AI OUTREACH DRAFT ({mode.upper()}) ---\n\n{outreach_copy}"
        note_success = create_ghl_contact_note(contact_id, note_body, ghl_token)

        # Step 5: Update tags to prevent double runs
        if note_success:
            update_ghl_contact_tags(contact_id, current_tags, mode, ghl_token)
            processed += 1

    print(f"\n[+] Outreach processing completed. Drafted scripts for {processed} contacts in GoHighLevel.")

if __name__ == "__main__":
    main()
