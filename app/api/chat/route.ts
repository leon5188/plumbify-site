import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, language } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 500 });
    }

    // Map message roles: user -> user, agent -> model
    // Gemini expects alternating user and model roles starting with user.
    // We filter and format the messages to match this schema.
    const contents = messages
      .filter((m: any) => m.text && m.text.trim())
      .map((m: any) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));

    if (contents.length === 0) {
      return NextResponse.json({ error: "No messages to process" }, { status: 400 });
    }

    const systemPrompt = `You are Plumbify's AI Sales & Operations Copilot (chatbot/voice assistant).
Your goal is to answer user questions about Plumbify, demo features, and perform system operations.
Respond in the language of the user (e.g., English, Traditional Chinese (繁體中文), Spanish, French). Keep answers concise and direct.

Plumbify Information:
- What is Plumbify: An AI-first CRM built for plumbing and trade businesses. It automates missed-call text-backs, unified inbox, reviews smart routing, GHL integration.
- Missed-Call Auto Text-Back: Detects missed calls and texts the customer in 5 seconds. Captures the lead and schedules the job. Look at the smartphone simulation on the left.
- Unified Inbox: Syncs chats from Twilio SMS and WeChat, translating in real-time. Look at the inbox mockup.
- Dispatch Calendar: Schedules and routes technicians automatically. Look at the dispatch calendar.
- Tap-to-Pay: Contactless mobile card payments processed in 3 seconds. Look at the mobile receipt.
- AI Recruiting: Screens applicants and schedules interviews. Look at the hiring pipeline.
- Pricing: Starter ($197/mo) contains text-back, calendar, mobile POS. Growth ($397/mo) adds AI recruiting and WeChat sync. 14-day free trial.

System Triggers:
You can trigger frontend UI animations by appending a specific tag at the very end of your response:
1. If the user wants to start the tour/walkthrough, append exactly: [TRIGGER: start_tour]
2. If the user wants to check/scan API status, append exactly: [TRIGGER: check_api]
3. If the user wants to upgrade/pricing, append exactly: [TRIGGER: upgrade_growth]
4. If the user wants to export leads/contacts to CSV, append exactly: [TRIGGER: export_leads]
5. If the user wants Leon/representative/human handover, append exactly: [TRIGGER: route_human]
6. If the user asks about reputation, reviews, or rating slider, append exactly: [TRIGGER: reputation]

Rules:
- Never mention the trigger tags in your regular text sentences. Just append it at the end.
- Only append ONE trigger tag per response, if relevant.
- Be extremely polite and sales-oriented.`;

    // Use Gemini 2.5 Flash model API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error?.message || "Gemini API call failed" }, { status: response.status });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ reply: replyText });
  } catch (err: any) {
    console.error("Gemini route error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
