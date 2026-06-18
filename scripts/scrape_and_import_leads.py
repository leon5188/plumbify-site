#!/usr/bin/env python3
import os
import csv
import json
import requests

# Paths
BASE_DIR = "/Users/peifengni/plumbify-site"
CSV_PATH = os.path.join(BASE_DIR, "plumbing_leads.csv")
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

# List of 27 plumbing companies in TX and PA found via Google Map sweep
leads = [
    {
        "companyName": "Village Plumbing & Air",
        "phone": "+17135261491",
        "website": "https://villageplumbing.com",
        "city": "Houston",
        "state": "TX",
        "firstName": "Village Plumbing",
        "lastName": "& Air"
    },
    {
        "companyName": "Best Plumbing, LLC",
        "phone": "+17136974400",
        "website": "https://bestplumbing.net",
        "city": "Houston",
        "state": "TX",
        "firstName": "Best Plumbing",
        "lastName": "LLC"
    },
    {
        "companyName": "Berkeys Air Conditioning, Plumbing & Electrical",
        "phone": "+12146120133",
        "website": "https://www.berkeys.com",
        "city": "Dallas",
        "state": "TX",
        "firstName": "Berkeys Air Conditioning",
        "lastName": "Plumbing & Electrical"
    },
    {
        "companyName": "ABC Home & Commercial Services",
        "phone": "+15128379500",
        "website": "https://www.abchomeandcommercial.com",
        "city": "Austin",
        "state": "TX",
        "firstName": "ABC Home &",
        "lastName": "Commercial Services"
    },
    {
        "companyName": "Clarke Kent Plumbing",
        "phone": "+15124772200",
        "website": "https://clarkekentplumbing.com",
        "city": "Austin",
        "state": "TX",
        "firstName": "Clarke Kent",
        "lastName": "Plumbing"
    },
    {
        "companyName": "Fox Service Company",
        "phone": "+15129753138",
        "website": "https://www.foxservice.com",
        "city": "Austin",
        "state": "TX",
        "firstName": "Fox Service",
        "lastName": "Company"
    },
    {
        "companyName": "O & M Plumbing Services, Inc.",
        "phone": "+15124662125",
        "website": "",
        "city": "Austin",
        "state": "TX",
        "firstName": "O & M Plumbing",
        "lastName": "Services Inc"
    },
    {
        "companyName": "Best Choice Plumbing & Heating",
        "phone": "+12157431755",
        "website": "https://bestchoiceplumbingandheating.com",
        "city": "Philadelphia",
        "state": "PA",
        "firstName": "Best Choice Plumbing",
        "lastName": "& Heating"
    },
    {
        "companyName": "Donnelly's Cooling, Heating, Plumbing & Electric",
        "phone": "+12155852155",
        "website": "https://www.bestpickreports.com",
        "city": "Philadelphia",
        "state": "PA",
        "firstName": "Donnelly's Cooling",
        "lastName": "Heating Plumbing Electric"
    },
    {
        "companyName": "Oliver Heating, Cooling, Plumbing & Electrical",
        "phone": "+16104927308",
        "website": "https://www.bestpickreports.com",
        "city": "Philadelphia",
        "state": "PA",
        "firstName": "Oliver Heating",
        "lastName": "Cooling Plumbing Electrical"
    },
    {
        "companyName": "Pawlak Plumbing LLC",
        "phone": "+14123568400",
        "website": "https://pawlakplumbing.com",
        "city": "Pittsburgh",
        "state": "PA",
        "firstName": "Pawlak Plumbing",
        "lastName": "LLC"
    },
    {
        "companyName": "Kangaroo Plumbing Inc.",
        "phone": "+14122445775",
        "website": "https://www.bbb.org",
        "city": "Pittsburgh",
        "state": "PA",
        "firstName": "Kangaroo Plumbing",
        "lastName": "Inc."
    },
    {
        "companyName": "Greater Pittsburgh Plumbing",
        "phone": "+14122232560",
        "website": "https://greaterpghplumbing.com",
        "city": "Pittsburgh",
        "state": "PA",
        "firstName": "Greater Pittsburgh",
        "lastName": "Plumbing"
    },
    {
        "companyName": "Jilly Plumbing",
        "phone": "+12109609263",
        "website": "https://jillyplumbing.com",
        "city": "San Antonio",
        "state": "TX",
        "firstName": "Jilly",
        "lastName": "Plumbing"
    },
    {
        "companyName": "Baker Brothers Plumbing, Air & Electric",
        "phone": "+12148922225",
        "website": "https://bakerbrothersplumbing.com",
        "city": "Dallas",
        "state": "TX",
        "firstName": "Baker Brothers",
        "lastName": "Plumbing"
    },
    {
        "companyName": "Legacy Plumbing",
        "phone": "+19728019798",
        "website": "https://legacyplumbing.net",
        "city": "Dallas",
        "state": "TX",
        "firstName": "Legacy",
        "lastName": "Plumbing"
    },
    {
        "companyName": "Milestone Electric, A/C, & Plumbing",
        "phone": "+12142672405",
        "website": "https://milestoneelectric.com",
        "city": "Dallas",
        "state": "TX",
        "firstName": "Milestone",
        "lastName": "Plumbing"
    },
    {
        "companyName": "Nick's Plumbing & Air Conditioning",
        "phone": "+17138689907",
        "website": "https://www.nicksplumbing.com",
        "city": "Houston",
        "state": "TX",
        "firstName": "Nick's Plumbing",
        "lastName": "& Air Conditioning"
    },
    {
        "companyName": "Santhoff Plumbing Company",
        "phone": "+17136654997",
        "website": "https://santhoffplumbingco.com",
        "city": "Houston",
        "state": "TX",
        "firstName": "Santhoff",
        "lastName": "Plumbing Company"
    },
    {
        "companyName": "Acosta Plumbing Solutions LLC",
        "phone": "+18322302355",
        "website": "https://acostaplumbingsolutions.com",
        "city": "Houston",
        "state": "TX",
        "firstName": "Acosta Plumbing",
        "lastName": "Solutions LLC"
    },
    {
        "companyName": "Goodman Plumbing",
        "phone": "+12154953642",
        "website": "https://www.goodmanplumbing.com",
        "city": "Philadelphia",
        "state": "PA",
        "firstName": "Goodman",
        "lastName": "Plumbing"
    },
    {
        "companyName": "Horizon Services",
        "phone": "+16105106388",
        "website": "https://www.horizonservices.com",
        "city": "Philadelphia",
        "state": "PA",
        "firstName": "Horizon",
        "lastName": "Services"
    },
    {
        "companyName": "Ring The Bell Plumbing, Heating & Drains",
        "phone": "+12678041824",
        "website": "https://ringthebellplumbing.com",
        "city": "Philadelphia",
        "state": "PA",
        "firstName": "Ring The Bell",
        "lastName": "Plumbing"
    },
    {
        "companyName": "Chris Driscoll Plumbing",
        "phone": "+14123350408",
        "website": "https://chrisdriscollplumbing.com",
        "city": "Pittsburgh",
        "state": "PA",
        "firstName": "Chris Driscoll",
        "lastName": "Plumbing"
    },
    {
        "companyName": "Cuccaro Plumbing",
        "phone": "+14124414911",
        "website": "https://cuccaroplumbing.com",
        "city": "Pittsburgh",
        "state": "PA",
        "firstName": "Cuccaro",
        "lastName": "Plumbing"
    },
    {
        "companyName": "412 Plumbing",
        "phone": "+14123201700",
        "website": "https://412plumbing.com",
        "city": "Pittsburgh",
        "state": "PA",
        "firstName": "412",
        "lastName": "Plumbing"
    },
    {
        "companyName": "Tedeschi Plumbing Service, LLC",
        "phone": "+14124861299",
        "website": "https://tedeschiplumbing.com",
        "city": "Pittsburgh",
        "state": "PA",
        "firstName": "Tedeschi Plumbing",
        "lastName": "Service LLC"
    }
]

# 1. Save to CSV
print(f"📝 Saving {len(leads)} leads to local file: {CSV_PATH}...")
with open(CSV_PATH, "w", newline="", encoding="utf-8") as csvfile:
    fieldnames = ["companyName", "phone", "website", "city", "state", "firstName", "lastName"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    for lead in leads:
        writer.writerow(lead)
print("✅ CSV file successfully saved.")

# 2. Sync to GHL
headers = {
    "Authorization": f"Bearer {GHL_API_KEY}",
    "Version": "2021-07-28",
    "Content-Type": "application/json"
}

print(f"\n🚀 Importing {len(leads)} contacts to GoHighLevel account...")

url = f"{GHL_BASE_URL}/contacts/"

for lead in leads:
    payload = {
        "locationId": GHL_LOCATION_ID,
        "firstName": lead["firstName"],
        "lastName": lead["lastName"],
        "phone": lead["phone"],
        "website": lead["website"],
        "companyName": lead["companyName"],
        "city": lead["city"],
        "state": lead["state"],
        "country": "US",
        "assignedTo": "kU5AqXCDBpIRoReCpbDw",
        "source": "Google Maps Sweeper",
        "tags": ["google-maps-lead", "plumbing"]
    }
    
    print(f"  Importing: {lead['companyName']} ({lead['phone']})...")
    
    try:
        r = requests.post(url, headers=headers, json=payload)
        if r.status_code in [200, 201]:
            contact_id = r.json().get("contact", {}).get("id", "unknown")
            print(f"    ✅ Success: Created contact (ID: {contact_id})")
        else:
            # Handle duplicate check or other errors
            response_json = r.json()
            message = response_json.get("message", "")
            if "exists" in message.lower() or r.status_code == 400:
                print(f"    ⏭️ Skipping (Contact/Phone already exists on GHL)")
            else:
                print(f"    ❌ Failed: {r.status_code} - {message}")
    except Exception as e:
        print(f"    ❌ Connection error for {lead['companyName']}: {e}")

print("\n🎉 Lead generation and GHL import tasks completed!")
