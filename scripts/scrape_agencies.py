#!/usr/bin/env python3
import csv
import sys
import urllib.parse
import time

try:
    from scrapling.fetchers import StealthyFetcher
except ImportError:
    print("Error: The 'scrapling' library is not installed.", file=sys.stderr)
    print("Please install it first: pip install \"scrapling[fetchers]\" && scrapling install", file=sys.stderr)
    sys.exit(1)

def scrape_duckduckgo(query):
    print(f"🔍 Searching DuckDuckGo for: {query}")
    results = []
    
    encoded_query = urllib.parse.quote(query)
    # DuckDuckGo HTML version is highly scrape-friendly
    url = f"https://html.duckduckgo.com/html/?q={encoded_query}"
    
    try:
        print(f"🌐 Fetching page: {url}")
        # Using StealthyFetcher to emulate a real browser and bypass basic bot protection
        page = StealthyFetcher.fetch(url, headless=True)
        
        # Result containers
        links = page.css('.result')
        print(f"✅ Found {len(links)} search results.")
        
        for item in links:
            title_elem = item.css('.result__title a')
            snippet_elem = item.css('.result__snippet')
            
            if title_elem:
                title = title_elem.text().strip()
                href = title_elem.attrib().get('href', '')
                
                # Decode DuckDuckGo redirect link to obtain direct URL
                actual_url = href
                if "/l/?uddg=" in href:
                    parsed = urllib.parse.parse_qs(urllib.parse.urlparse(href).query)
                    actual_url = parsed.get('uddg', [href])[0]
                
                snippet = snippet_elem.text().strip() if snippet_elem else ""
                
                # Basic filter to target actual agency websites (discarding common listings like Yelp/YellowPages)
                ignore_domains = ['yelp.com', 'yellowpages.com', 'facebook.com', 'linkedin.com', 'twitter.com', 'instagram.com', 'youtube.com']
                if not any(domain in actual_url for domain in ignore_domains):
                    results.append({
                        'Title': title,
                        'URL': actual_url,
                        'Snippet': snippet
                    })
        
        # Adaptive pause
        time.sleep(2)
        
    except Exception as e:
        print(f"❌ Error fetching results: {e}", file=sys.stderr)
        
    return results

def main():
    # Common footprints left by digital agencies in plumbing clients' website footers
    queries = [
        '"website design by" plumbing',
        '"web design by" plumbing',
        '"site designed by" plumber',
        '"marketing by" plumber',
        '"powered by" plumbing website'
    ]
    
    all_results = []
    seen_urls = set()
    
    for q in queries:
        items = scrape_duckduckgo(q)
        for item in items:
            url = item['URL']
            if url not in seen_urls:
                seen_urls.add(url)
                all_results.append(item)
                
    # Save the leads to a CSV
    csv_file = 'scripts/scraped_agencies.csv'
    with open(csv_file, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['Title', 'URL', 'Snippet'])
        writer.writeheader()
        for row in all_results:
            writer.writerow(row)
            
    print(f"\n🎉 Scraping complete! Saved {len(all_results)} unique leads to '{csv_file}'.")

if __name__ == '__main__':
    main()
