#!/usr/bin/env python3
import os
import requests

# Paths
BASE_DIR = "/Users/peifengni/plumbify-site"
GHL_ENV_PATH = "/Users/peifengni/GoHighLevel-MCP/.env"

# Load GHL config
ghl_config = {}
if os.path.exists(GHL_ENV_PATH):
    with open(GHL_ENV_PATH, "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#"):
                parts = line.split("=", 1)
                if len(parts) == 2:
                    key = parts[0].strip()
                    val = parts[1].split("#", 1)[0].strip()
                    ghl_config[key] = val

GHL_API_KEY = ghl_config.get("GHL_API_KEY", "")
GHL_LOCATION_ID = ghl_config.get("GHL_LOCATION_ID", "")
GHL_BASE_URL = ghl_config.get("GHL_BASE_URL", "https://services.leadconnectorhq.com")

if not GHL_API_KEY or not GHL_LOCATION_ID:
    print("❌ Error: GHL_API_KEY or GHL_LOCATION_ID not found in environment config.")
    exit(1)

# Targeted accounts (Google Business, Facebook, Instagram, LinkedIn)
account_ids = [
    "6a2ffbf7191efce9cc9adfef_RHROdkS0TNPBFZHcZsX0_9621667619355115125", # Google Business: Propscale ai
    "6a2ffb144e91a9964c5ab097_RHROdkS0TNPBFZHcZsX0_780908762106705_page", # Facebook Page: Propscale AI
    "6a2ffb632082a814b41eebad_RHROdkS0TNPBFZHcZsX0_17841402990063945",    # Instagram Profile: peifengni
    "6a2ffc5e7301ad5c0d482be7_RHROdkS0TNPBFZHcZsX0_AUddYTDCap_profile"    # LinkedIn Profile: peifeng ni
]

summary_text = """🔧 Plumbify: The AI-First Operating System for Plumbing Businesses! 🚀

Tired of missing phone calls and losing $10,000+ every month to competitors? 
Meet Plumbify—the all-in-one software designed to put your plumbing office on autopilot:

✅ Automated Missed-Call Text-Backs: Capture leads in seconds before they click away.
✅ AI Plumber Assistant: Automatically qualify inquiries and schedule dispatch bookings.
✅ Smart Skill-Based Routing: Maximize billable hours and wrench-time.
✅ Mobile Tap-to-Pay: Collect signatures and instant payments directly on site.

Stop chasing paperwork and start scaling your fleet. Get your 14-day free setup today!
👉 Learn more at: https://plumbify.net/landing1"""

payload = {
    "accountIds": account_ids,
    "summary": summary_text,
    "media": [
        {
            "url": "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
            "type": "image/jpeg"
        }
    ],
    "status": "published",
    "type": "post",
    "userId": "6a1f0684ee42795f3cdc4b10"
}

headers = {
    "Authorization": f"Bearer {GHL_API_KEY}",
    "Version": "2021-07-28",
    "Content-Type": "application/json"
}

print("🚀 Publishing Plumbify promotion to connected social media channels...")
url = f"{GHL_BASE_URL}/social-media-posting/{GHL_LOCATION_ID}/posts"

try:
    r = requests.post(url, headers=headers, json=payload)
    if r.status_code in [200, 201]:
        print("✅ Successfully published post to your social channels!")
        print(r.text)
    else:
        print(f"❌ Failed to publish post: {r.status_code}")
        print(r.text)
except Exception as e:
    print(f"❌ Connection error: {e}")
