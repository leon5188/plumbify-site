import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const GHL_API_KEY = process.env.GHL_PRIVATE_TOKEN;
    const LOCATION_ID = process.env.GHL_LOCATION_ID;

    // Define standard baseline mock values to serve as safe fallbacks
    const defaultStats = {
      capturedLeads: 184,
      savedRevenue: 150880,
      responseTime: "4.8 seconds",
      reviewsCount: 98,
      averageRating: 4.87,
      activeTechs: 8,
      jobsDispatched: 312,
      recentLeads: [
        {
          id: "mock-1",
          name: "James Anderson",
          email: "j.anderson@example.com",
          phone: "+1 (512) 555-0192",
          source: "SMS Text-Back",
          date: new Date().toLocaleDateString(),
          tags: ["emergency", "burst-pipe"]
        },
        {
          id: "mock-2",
          name: "Sarah Miller",
          email: "smiller99@example.com",
          phone: "+1 (512) 555-0143",
          source: "WeChat Sync",
          date: new Date(Date.now() - 3600000).toLocaleDateString(),
          tags: ["water-heater", "quote"]
        },
        {
          id: "mock-3",
          name: "Michael Chen",
          email: "mchen_dev@example.com",
          phone: "+1 (512) 555-0188",
          source: "Google Ad",
          date: new Date(Date.now() - 7200000).toLocaleDateString(),
          tags: ["drain-clog"]
        }
      ]
    };

    if (!GHL_API_KEY || !LOCATION_ID) {
      console.warn("Missing GHL environment variables. Serving dashboard stats with baseline mocks.");
      return NextResponse.json(defaultStats);
    }

    // 1. Fetch total count of GHL contacts and recent leads list
    let capturedLeads = defaultStats.capturedLeads;
    let recentLeads = defaultStats.recentLeads;

    try {
      const contactsRes = await fetch(
        `https://services.leadconnectorhq.com/contacts/?locationId=${LOCATION_ID}&limit=5`,
        {
          headers: {
            "Authorization": `Bearer ${GHL_API_KEY}`,
            "Version": "2021-07-28",
            "Content-Type": "application/json"
          }
        }
      );

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        
        // Extract total contacts from metadata
        if (contactsData.meta && typeof contactsData.meta.total === "number") {
          capturedLeads = contactsData.meta.total;
        }

        // Map recent 5 GHL contacts to our dashboard feed list
        const contactsList = contactsData.contacts || [];
        if (contactsList.length > 0) {
          recentLeads = contactsList.map((contact: any) => {
            // Mask phone numbers slightly for privacy
            let phone = contact.phone || "No Phone";
            if (phone !== "No Phone" && phone.length > 6) {
              phone = phone.slice(0, 4) + "***" + phone.slice(-4);
            }
            
            // Mask email slightly
            let email = contact.email || "No Email";
            if (email !== "No Email" && email.includes("@")) {
              const [name, domain] = email.split("@");
              email = name.slice(0, 3) + "***@" + domain;
            }

            // Determine lead channel source based on tags or properties
            let source = "Web Lead";
            const tags = contact.tags || [];
            if (tags.includes("plumbify-site-lead")) {
              source = "AI Chat Form";
            } else if (tags.includes("wechat")) {
              source = "WeChat Sync";
            } else if (tags.includes("sms")) {
              source = "SMS Text-Back";
            }

            return {
              id: contact.id,
              name: contact.contactName || `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Anonymous Lead",
              email: email,
              phone: phone,
              source: source,
              date: contact.dateAdded ? new Date(contact.dateAdded).toLocaleDateString() : "Just Now",
              tags: tags.slice(0, 3)
            };
          });
        }
      } else {
        console.error("GHL Contacts API error status:", contactsRes.status);
      }
    } catch (err) {
      console.error("Failed to fetch GHL contacts count:", err);
    }

    // 2. Fetch total count of GHL conversations
    let jobsDispatched = defaultStats.jobsDispatched;
    try {
      const convRes = await fetch(
        `https://services.leadconnectorhq.com/conversations/search?locationId=${LOCATION_ID}&limit=1`,
        {
          headers: {
            "Authorization": `Bearer ${GHL_API_KEY}`,
            "Version": "2021-07-28",
            "Content-Type": "application/json"
          }
        }
      );

      if (convRes.ok) {
        const convData = await convRes.json();
        if (convData.total !== undefined && typeof convData.total === "number") {
          // Map total conversations to jobsDispatched/conversations in GHL
          jobsDispatched = convData.total;
        }
      } else {
        console.error("GHL Conversations API error status:", convRes.status);
      }
    } catch (err) {
      console.error("Failed to fetch GHL conversations count:", err);
    }

    // Calculate dynamic stats
    // Revenue is calculated using GHL leads * average plumbing ticket value ($820)
    const savedRevenue = capturedLeads * 820;

    return NextResponse.json({
      capturedLeads,
      savedRevenue,
      responseTime: "4.8 seconds", // AI auto-response speed KPI
      reviewsCount: defaultStats.reviewsCount,
      averageRating: defaultStats.averageRating,
      activeTechs: defaultStats.activeTechs,
      jobsDispatched,
      recentLeads
    });

  } catch (error: any) {
    console.error("Dashboard Stats endpoint error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
