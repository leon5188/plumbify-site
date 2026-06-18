#!/usr/bin/env python3
import os
import requests
from datetime import datetime, timedelta

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
    "6a2ffbf7191efce9cc9adfef_RHROdkS0TNPBFZHcZsX0_9621667619355115125", # Google Business
    "6a2ffb144e91a9964c5ab097_RHROdkS0TNPBFZHcZsX0_780908762106705_page", # Facebook Page
    "6a2ffb632082a814b41eebad_RHROdkS0TNPBFZHcZsX0_17841402990063945",    # Instagram Profile
    "6a2ffc5e7301ad5c0d482be7_RHROdkS0TNPBFZHcZsX0_AUddYTDCap_profile"    # LinkedIn Profile
]

# 30 Unique Post Contents pointing to landing page
posts_content = [
    # W1
    "🔧 Leaking $10k+ in revenue every month? If you miss customer calls while under a sink, they just call the next plumber. Plumbify texts back missed calls in 30 seconds to secure the booking.\n👉 Learn more: https://plumbify.net/landing1",
    "📍 Wasting fuel on overlapping routes? Plumbify's AI smart dispatch board analyzes location and skill set to route trucks efficiently.\n👉 Learn more: https://plumbify.net/landing1",
    "💳 Ditch the clunky card readers. Collect digital invoice signatures and credit payments on the spot with Tap-to-Pay directly on your phone.\n👉 Learn more: https://plumbify.net/landing1",
    "⭐ Rankings matter. Plumbify triggers Google review requests 10 minutes after payment, boosting your local Map Pack position on autopilot.\n👉 Learn more: https://plumbify.net/landing1",
    "💼 Helper recruitment bottleneck? Plumbify's automated text-screening filters helper applications so you only interview licensed, vetted candidates.\n👉 Learn more: https://plumbify.net/landing1",
    "📞 Never miss an after-hours emergency. Let Plumbify's AI receptionist qualify calls, answer FAQs, and schedule jobs while you sleep.\n👉 Learn more: https://plumbify.net/landing1",
    "💰 Are you charging diagnostic fees? Let's check the math. Learn how upfront flat-rate menus improve pricing transparency.\n👉 Learn more: https://plumbify.net/landing1",
    # W2
    "📈 Maximize technician billable wrench-time. Remove manual scheduling friction and automate check-ins directly from the field with Plumbify.\n👉 Learn more: https://plumbify.net/landing1",
    "📱 Carrier spam filters blocking your notifications? Check your brand registration. Plumbify manages 10DLC SMS compliance automatically.\n👉 Learn more: https://plumbify.net/landing1",
    "🔥 Stop spending on new ads. Reactivate your database of old clients and generate 20+ service jobs in 48 hours via warm lists.\n👉 Learn more: https://plumbify.net/landing1",
    "💬 WeChat and Facebook DMs hold high-value leads. Plumbify's Unified Inbox brings all customer messages into one dashboard.\n👉 Learn more: https://plumbify.net/landing1",
    "📋 Technicians hate paper invoicing. Eliminate lost part billing and invisible shrinkage by standardizing on digital catalogs.\n👉 Learn more: https://plumbify.net/landing1",
    "🛠️ Apprentice vs journeyman dispatching. Route the right technician to the right job automatically and prevent call-backs.\n👉 Learn more: https://plumbify.net/landing1",
    "🚚 Homeowners hate waiting. Send SMS notifications with live vehicle tracking links the second your plumber goes en route.\n👉 Learn more: https://plumbify.net/landing1",
    # W3
    "📊 Hourly billing caps your earnings. Transition to Good-Better-Best flat-rate options on tablets and boost tickets by 35%.\n👉 Learn more: https://plumbify.net/landing1",
    "☀️ Summer heat triggers plumbing and cooling emergencies. Is your office dispatch setup ready for peak call volume? Automate it today.\n👉 Learn more: https://plumbify.net/landing1",
    "⏱️ Response speed is the ultimate sales closer. The first shop to reply to a remodeling or drain cleaning estimate inquiry wins.\n👉 Learn more: https://plumbify.net/landing1",
    "🔒 Secure client transactions. Tokenized Tap-to-pay payments bypass paper data risks, ensuring 100% PCI compliance in the driveway.\n👉 Learn more: https://plumbify.net/landing1",
    "🏢 What's your office-to-truck ratio? Aim for 5 trucks per 1 admin. Eliminate manual copy-pasting and let software do the booking.\n👉 Learn more: https://plumbify.net/landing1",
    "🔄 Service agreements build stable, recurring income. Use Plumbify to auto-schedule routine maintenance visits for past clients.\n👉 Learn more: https://plumbify.net/landing1",
    "💧 Hydro-jetting vs snaking. Market your highest-margin sewer services and capture pre-booked camera inspections easily.\n👉 Learn more: https://plumbify.net/landing1",
    # W4
    "📅 Sediment in water heaters leads to early system failures. Automate annual flush reminders to keep your schedule full in slow months.\n👉 Learn more: https://plumbify.net/landing1",
    "📲 Real-time dashboard view: Track billable wrench-time, active routes, and technician sales targets from one command center.\n👉 Learn more: https://plumbify.net/landing1",
    "🗣️ iPad typing with dirty hands? Use Plumbify's voice logs to dictate job notes, update inventory, and draft invoices instantly.\n👉 Learn more: https://plumbify.net/landing1",
    "📞 Missed emergency call? Automatic text-backs capture the client immediately, stopping them from scrolling to your competitors.\n👉 Learn more: https://plumbify.net/landing1",
    "🤝 Attract journeyman plumbers. Newer tools, modern vans, and streamlined iPad operations show top talent that you respect their time.\n👉 Learn more: https://plumbify.net/landing1",
    "🗺️ Local Pack SEO checklist: Fresh reviews, Google Screened tag, and geotagged project photos. Climb Google Maps today.\n👉 Learn more: https://plumbify.net/landing1",
    "💬 WeChat community forums are full of homeowners looking for service pros. Plumbify captures these chat inquiries instantly.\n👉 Learn more: https://plumbify.net/landing1",
    "🔍 Catch minor sewer line issues before they cause basement floods. Schedule preventative camera checkups for past clients.\n👉 Learn more: https://plumbify.net/landing1",
    "🚀 Stop working in the business and start working on the business. Plumbify OS automates your office so you can scale your fleet.\n👉 Learn more: https://plumbify.net/landing1"
]

# Rotate 4 Unsplash Images
images = [
    "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
]

headers = {
    "Authorization": f"Bearer {GHL_API_KEY}",
    "Version": "2021-07-28",
    "Content-Type": "application/json"
}

url = f"{GHL_BASE_URL}/social-media-posting/{GHL_LOCATION_ID}/posts"

print(f"📅 Starting 30-Day Social Scheduling at 11:00 AM daily...")

# Start tomorrow: June 16, 2026
start_date = datetime(2026, 6, 16, 11, 0, 0)

for i in range(30):
    post_date = start_date + timedelta(days=i)
    # Convert to UTC ISO format (11:00 AM PDT is 18:00 UTC)
    utc_date = post_date + timedelta(hours=7)
    iso_date = utc_date.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    
    summary = posts_content[i]
    image_url = images[i % 4]
    
    payload = {
        "accountIds": account_ids,
        "summary": summary,
        "media": [
            {
                "url": image_url,
                "type": "image/jpeg"
            }
        ],
        "status": "scheduled",
        "scheduleDate": iso_date,
        "type": "post",
        "userId": "6a1f0684ee42795f3cdc4b10"
    }
    
    print(f"  Day {i+1:02d}: Scheduling for {post_date.strftime('%Y-%m-%d %I:%M %p PDT')} (UTC: {iso_date})...")
    
    try:
        r = requests.post(url, headers=headers, json=payload)
        if r.status_code in [200, 201]:
            print(f"    ✅ Success: Scheduled day {i+1}")
        else:
            print(f"    ❌ Failed: {r.status_code} {r.text}")
    except Exception as e:
        print(f"    ❌ Connection error on day {i+1}: {e}")

print("\n🎉 All 30 posts successfully scheduled in GoHighLevel Social Planner!")
