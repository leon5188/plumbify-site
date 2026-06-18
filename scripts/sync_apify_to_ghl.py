import os
import requests
import sys

def sync_leads():
    # 1. Load configuration from GoHighLevel-MCP .env
    env_path = "/Users/peifengni/GoHighLevel-MCP/.env"
    ghl_config = {}
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    parts = line.split("=", 1)
                    if len(parts) == 2:
                        ghl_config[parts[0].strip()] = parts[1].split("#", 1)[0].strip()

    GHL_API_KEY = ghl_config.get("GHL_API_KEY", "")
    GHL_LOCATION_ID = ghl_config.get("GHL_LOCATION_ID", "")
    GHL_BASE_URL = ghl_config.get("GHL_BASE_URL", "https://services.leadconnectorhq.com")
    APIFY_TOKEN = ghl_config.get("APIFY_TOKEN", "")

    if not GHL_API_KEY or not GHL_LOCATION_ID or not APIFY_TOKEN:
        print("Error: Missing GHL_API_KEY, GHL_LOCATION_ID, or APIFY_TOKEN in GoHighLevel-MCP/.env")
        sys.exit(1)

    print("=== Config Loaded Successfully ===")
    print(f"GHL Location ID: {GHL_LOCATION_ID}")
    
    # 2. Fetch the latest dataset from Apify
    print("\nFetching latest dataset metadata from Apify...")
    apify_url = f"https://api.apify.com/v2/datasets?token={APIFY_TOKEN}&unnamed=true"
    try:
        res = requests.get(apify_url).json()
        datasets = res.get("data", {}).get("items", [])
    except Exception as e:
        print(f"Failed to fetch Apify datasets: {e}")
        sys.exit(1)

    # Sort datasets by creation date descending
    datasets.sort(key=lambda x: x.get("createdAt", ""), reverse=True)

    # Find the most recent dataset with items
    target_dataset = None
    for ds in datasets:
        if ds.get("itemCount", 0) > 0:
            target_dataset = ds
            break

    if not target_dataset:
        print("Error: No datasets with items found in your Apify account.")
        sys.exit(1)

    dataset_id = target_dataset["id"]
    dataset_name = target_dataset.get("name", "Unnamed")
    item_count = target_dataset["itemCount"]
    print(f"Found latest dataset: '{dataset_name}' (ID: {dataset_id}, Items: {item_count})")

    # 3. Retrieve dataset items
    print(f"Downloading items from dataset {dataset_id}...")
    items_url = f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={APIFY_TOKEN}"
    try:
        items = requests.get(items_url).json()
    except Exception as e:
        print(f"Failed to download dataset items: {e}")
        sys.exit(1)

    if not isinstance(items, list):
        # Apify might return dictionary on error or different format
        print(f"Unexpected response format from Apify: {items}")
        sys.exit(1)

    print(f"Downloaded {len(items)} items. Beginning sync to GHL...")

    # 4. Push to GHL
    ghl_headers = {
        "Authorization": f"Bearer {GHL_API_KEY}",
        "Version": "2021-07-28",
        "Content-Type": "application/json"
    }

    success_count = 0
    skipped_count = 0
    error_count = 0

    # We will limit to first 1000 leads to prevent API spam, user can adjust if needed
    max_sync = 1000
    for idx, item in enumerate(items[:max_sync]):
        # Extract fields with fallback names
        company_name = item.get("title") or item.get("name") or ""
        phone = item.get("phone") or item.get("phoneNumber") or ""
        website = item.get("website") or ""
        city = item.get("city") or ""
        
        # Extract email (can be list or string in Apify)
        email = ""
        emails = item.get("email") or item.get("emails") or ""
        if isinstance(emails, list) and len(emails) > 0:
            email = emails[0]
        elif isinstance(emails, str):
            email = emails.strip()

        # Clean fields
        company_name = company_name.strip()
        phone = phone.strip()
        website = website.strip()
        city = city.strip()

        if not company_name:
            print(f"[{idx+1}/{len(items)}] Skipped: No company name found.")
            skipped_count += 1
            continue

        print(f"[{idx+1}/{len(items)}] Syncing '{company_name}'...")

        # Setup GHL payload
        payload = {
            "locationId": GHL_LOCATION_ID,
            "firstName": company_name,
            "lastName": "Plumbing Lead",
            "companyName": company_name,
            "assignedTo": "kU5AqXCDBpIRoReCpbDw", # Leon
            "source": "Apify Google Maps",
            "tags": ["apify-lead", "plumber"]
        }

        if phone:
            payload["phone"] = phone
        if email:
            payload["email"] = email
        if website:
            payload["website"] = website
        if city:
            payload["city"] = city

        try:
            r = requests.post(f"{GHL_BASE_URL}/contacts/", headers=ghl_headers, json=payload)
            if r.status_code in [200, 201]:
                print(f"  -> Success: Lead created/updated in GHL.")
                success_count += 1
            else:
                # GHL returns 400 or other codes if contact exists or error
                print(f"  -> Response {r.status_code}: {r.text[:200]}")
                if "already exists" in r.text.lower() or r.status_code == 400:
                    skipped_count += 1
                else:
                    error_count += 1
        except Exception as e:
            print(f"  -> Request failed: {e}")
            error_count += 1

    print("\n=== Sync Summary ===")
    print(f"Total processed: {min(len(items), max_sync)}")
    print(f"Successfully synced: {success_count}")
    print(f"Skipped/Duplicate: {skipped_count}")
    print(f"Errors: {error_count}")

if __name__ == "__main__":
    sync_leads()
