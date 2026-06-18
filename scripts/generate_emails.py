import csv
import os

def generate_emails():
    csv_path = '/Users/peifengni/plumbify-site/plumbing_leads.csv'
    output_path = '/Users/peifengni/plumbify-site/personalized_outreach_emails.txt'

    if not os.path.exists(csv_path):
        print(f"Error: Could not find CSV at {csv_path}")
        return

    # Missed Call Text-Back Template (with website)
    template_with_website = """=========================================
Company: {company_name}
To: {first_name} {last_name}
Subject: Quick question about {company_name}'s missed calls

Hi {first_name},

I was looking at {company_name} online and noticed you service the {city} area. 

Quick question: If a homeowner calls your line ({phone}) while your crew is busy on a job and you can't pick up, do you have an automated text-back set up?

In our experience, when a caller gets sent to voicemail, they immediately hang up and call the next plumber on Google Maps. We help local shops set up an instant auto-text response to secure those leads before they go to a competitor.

Do you have 5 minutes this Thursday afternoon to see how we set this up for {city} plumbing businesses?

Best,

Leon
Founder, Plumbify.net
"""

    # Reviews / Local SEO Template (no website or placeholder)
    template_without_website = """=========================================
Company: {company_name}
To: {first_name} {last_name}
Subject: Getting more jobs in {city} (review automation)

Hi {first_name},

I was checking out {company_name}'s reviews in {city} and wanted to reach out. 

Most homeowners choose the plumber with the most recent 5-star reviews on Google Maps. We help local businesses automate review requests—sending a text right after the job is done so customers actually leave them.

It usually doubles a shop's review volume in the first 30 days, pushing you ahead of local competitors.

Would you be open to a quick 5-minute call this week to see how it works?

Best,

Leon
Founder, Plumbify.net
"""

    emails_generated = 0
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        with open(output_path, mode='w', encoding='utf-8') as out_f:
            for row in reader:
                company_name = row.get('companyName', '').strip()
                phone = row.get('phone', '').strip()
                website = row.get('website', '').strip()
                city = row.get('city', '').strip()
                first_name = row.get('firstName', '').strip()
                last_name = row.get('lastName', '').strip()

                if not company_name:
                    continue

                # Determine if they have a real website
                has_website = website and not any(ph in website.lower() for ph in ['bbb.org', 'bestpickreports.com', 'yelp.com', 'facebook.com'])

                if has_website:
                    email_body = template_with_website.format(
                        company_name=company_name,
                        first_name=first_name,
                        last_name=last_name,
                        city=city,
                        phone=phone
                    )
                else:
                    email_body = template_without_website.format(
                        company_name=company_name,
                        first_name=first_name,
                        last_name=last_name,
                        city=city
                    )

                out_f.write(email_body)
                out_f.write("\n\n")
                emails_generated += 1

    print(f"Successfully generated {emails_generated} personalized emails in {output_path}")

if __name__ == '__main__':
    generate_emails()
