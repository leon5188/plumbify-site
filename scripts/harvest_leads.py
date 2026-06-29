#!/usr/bin/env python3
"""
Plumbify AI Sales Team - Agent 1: Lead Harvesting & CRM Sync
This script searches for local plumbing/HVAC websites, scrapes their contents using Jina Reader,
extracts B2B contact details using Gemini API, and syncs them to GoHighLevel CRM.
"""

import os
import re
import sys
import json
import urllib.request
import urllib.parse
import argparse

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

# Search DuckDuckGo HTML (API-keyless search fallback)
def search_websites(query, limit=5):
    # Auto-exclude common directories inside the search query to force direct sites
    search_exclusions = [
        "yelp.com", "angi.com", "yellowpages.com", "expertise.com", 
        "thumbtack.com", "bbb.org", "homeadvisor.com", "houzz.com",
        "bestprosintown.com", "plumbersup.com"
    ]
    query_suffix = " " + " ".join([f"-site:{domain}" for domain in search_exclusions])
    enhanced_query = query + query_suffix

    print(f"[*] Searching for leads with query: '{query}'...")
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote_plus(enhanced_query)}"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    )
    try:
        with urllib.request.urlopen(req) as res:
            html = res.read().decode("utf-8")
        
        # Extract redirect URLs from DuckDuckGo search result links
        links = re.findall(r'class="result__url"[^>]*href="([^"]+)"', html)
        
        filtered_links = []
        for l in links:
            if "uddg=" in l:
                parsed = urllib.parse.urlparse(l)
                queries = urllib.parse.parse_qs(parsed.query)
                if "uddg" in queries:
                    l = queries["uddg"][0]
            
            # Exclude directory portals and social media to find direct local plumber websites
            exclusions = [
                "duckduckgo.com", "google.com", "facebook.com", "instagram.com", 
                "youtube.com", "wikipedia.org", "yelp.com", "yellowpages.com", 
                "angi.com", "homeadvisor.com", "bbb.org", "linkedin.com",
                "expertise.com", "bestprosintown.com", "plumbersup.com", 
                "thumbtack.com", "houzz.com", "directory", "top-10", "best-plumbers"
            ]
            if not any(domain in l.lower() for domain in exclusions):
                filtered_links.append(l)
                if len(filtered_links) >= limit:
                    break
        return filtered_links
    except Exception as e:
        print(f"[-] Search failed: {e}", file=sys.stderr)
        return []

# Fetch webpage markdown text using Jina Reader (Agent-Reach Web protocol)
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
        print(f"[-] Failed to scrape {target_url}: {e}", file=sys.stderr)
        return ""

# Analyze webpage markdown text and extract B2B lead info using Gemini API
def extract_lead_info_with_gemini(markdown_text, api_key):
    if not markdown_text:
        return None
    
    print("[*] Running Gemini AI extraction on webpage contents...")
    # Truncate text if it is extremely long to conserve context window
    truncated_text = markdown_text[:12000]

    prompt = (
        "You are an expert B2B sales development AI. Analyze the following webpage text of a local plumbing/HVAC service business.\n"
        "Your task is to extract contact information. You MUST output a clean JSON object following this JSON schema exactly, "
        "and nothing else (do not include markdown tags or wrapper text outside the JSON object):\n"
        "{\n"
        "  \"companyName\": \"string or null\",\n"
        "  \"ownerName\": \"string or null (extract owner, founder, president, or manager name if mentioned)\",\n"
        "  \"email\": \"string or null (must be a valid email found on page)\",\n"
        "  \"phone\": \"string or null (must be a valid phone number found on page)\",\n"
        "  \"city\": \"string or null\",\n"
        "  \"state\": \"string or null\"\n"
        "}\n\n"
        "Only extract factual data explicitly present in the text. If a field is not found, return null.\n"
        f"Webpage Text:\n{truncated_text}"
    )

    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
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
            content_text = res_data["candidates"][0]["content"]["parts"][0]["text"]
            # Parse the structured JSON output
            lead_data = json.loads(content_text.strip())
            return lead_data
    except Exception as e:
        print(f"[-] Gemini AI extraction failed: {e}", file=sys.stderr)
        return None

# Push harvested lead to GoHighLevel CRM contacts endpoint
def sync_lead_to_gohighlevel(lead, token, location_id):
    if not lead or (not lead.get("email") and not lead.get("phone")):
        print("[-] Skipping GHL sync: No email or phone found.")
        return None

    # Split full name into first and last name
    name = lead.get("ownerName") or ""
    parts = name.strip().split()
    first_name = parts[0] if len(parts) > 0 else "Contact"
    last_name = " ".join(parts[1:]) if len(parts) > 1 else "Owner"
    
    company = lead.get("companyName") or "Unknown Plumbing Co."
    email = lead.get("email")
    phone = lead.get("phone")

    print(f"[*] Syncing lead '{company}' ({first_name} {last_name}) to GoHighLevel...")

    # Set workflow tags: email candidates get cold-email-pending, phone-only get cold-sms-pending
    tags = ["agent-reach-harvest", "2026-outreach"]
    if email:
        tags.append("cold-email-pending")
    elif phone:
        tags.append("cold-sms-pending")

    payload = {
        "firstName": first_name,
        "lastName": last_name,
        "email": email,
        "phone": phone,
        "companyName": company,
        "locationId": location_id,
        "tags": tags,
        "city": lead.get("city"),
        "state": lead.get("state")
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
        "Version": "2021-07-28",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    req = urllib.request.Request(
        "https://services.leadconnectorhq.com/contacts/",
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode("utf-8"))
            contact_id = res_data.get("contact", {}).get("id")
            print(f"[+] Success! Contact synced with ID: {contact_id}")
            return contact_id
    except Exception as e:
        # If lead already exists, GHL usually throws an error, but let's log it
        print(f"[-] GHL Sync failed for {company}: {e}", file=sys.stderr)
        return None

def main():
    parser = argparse.ArgumentParser(description="Plumbify AI Lead Harvesting Agent (Agent 1)")
    parser.add_argument("--query", type=str, help="Search query (e.g. 'plumbers in Houston, TX')")
    parser.add_argument("--urls", type=str, help="Comma-separated list of custom URLs to crawl directly")
    parser.add_argument("--limit", type=int, default=5, help="Max number of leads to scrape")
    args = parser.parse_args()

    # Load environmental tokens
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    env_vars = load_env(os.path.join(project_root, ".env.local"))

    gemini_key = env_vars.get("GEMINI_API_KEY")
    ghl_token = env_vars.get("GHL_PRIVATE_TOKEN")
    ghl_location = env_vars.get("GHL_LOCATION_ID")

    if not gemini_key:
        print("[-] Error: GEMINI_API_KEY is missing from .env.local.", file=sys.stderr)
        sys.exit(1)
    if not ghl_token or not ghl_location:
        print("[-] Error: GoHighLevel credentials missing from .env.local.", file=sys.stderr)
        sys.exit(1)

    # Compile URLs list
    target_urls = []
    if args.urls:
        target_urls = [u.strip() for u in args.urls.split(",") if u.strip()]
    elif args.query:
        target_urls = search_websites(args.query, limit=args.limit)
    else:
        print("[-] Error: Please specify either --query or --urls parameter.", file=sys.stderr)
        parser.print_help()
        sys.exit(1)

    if not target_urls:
        print("[-] No business websites found. Exiting.")
        sys.exit(0)

    print(f"[+] Found {len(target_urls)} potential websites to scrape.")
    
    success_count = 0
    for idx, url in enumerate(target_urls, 1):
        print(f"\n--- Processing Lead {idx}/{len(target_urls)}: {url} ---")
        # Step 1: Scrape text
        markdown = fetch_webpage_markdown(url)
        if not markdown:
            continue

        # Step 2: Extract B2B details
        lead_data = extract_lead_info_with_gemini(markdown, gemini_key)
        if not lead_data:
            continue

        print(f"[+] Extracted Data: {json.dumps(lead_data, indent=2)}")

        # Step 3: Push to GHL CRM
        contact_id = sync_lead_to_gohighlevel(lead_data, ghl_token, ghl_location)
        if contact_id:
            success_count += 1

    print(f"\n[+] Lead harvesting completed. Successfully synced {success_count} leads to GoHighLevel CRM.")

if __name__ == "__main__":
    main()
