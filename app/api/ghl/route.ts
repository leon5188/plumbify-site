import { NextResponse } from "next/server";

// This is a secure server-side route to handle lead capture to GHL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, phone, company } = body;

    // Retrieve the token from environment variables (NEVER hardcode in source)
    const GHL_API_KEY = process.env.GHL_PRIVATE_TOKEN;
    const LOCATION_ID = process.env.GHL_LOCATION_ID;

    if (!GHL_API_KEY) {
      return NextResponse.json({ error: "GHL API Key missing" }, { status: 500 });
    }

    // Call GoHighLevel API to create/update contact
    // Documentation: https://api.gohighlevel.com/
    const response = await fetch("https://services.leadconnectorhq.com/contacts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GHL_API_KEY}`,
        "Version": "2021-07-28" // GHL Versioning
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        companyName: company,
        locationId: LOCATION_ID,
        tags: ["plumbify-site-lead", "2026-campaign"]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("GHL Error:", data);
      return NextResponse.json({ error: "Failed to sync with GHL" }, { status: response.status });
    }

    return NextResponse.json({ success: true, contactId: data.contact?.id });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
