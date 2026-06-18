import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, language } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 500 });
    }

    // Map message roles: user -> user, agent -> model
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

System Tool Execution:
You are equipped with tools to execute actions on the user's interface. Whenever the user requests one of these actions, call the corresponding tool. Do not just talk about it—execute the tool.
- If the user wants to start the tour or walkthrough, call 'startOnboardingTour'.
- If the user wants to check/scan API status, call 'checkApiStatus'.
- If the user wants to upgrade/pricing, call 'upgradeSubscription'.
- If the user wants to export leads/contacts to CSV, call 'exportLeadsToCsv'.
- If the user wants Leon/representative/human handover, call 'routeToHumanLeon'.
- If the user asks about reputation, reviews, or rating slider, call 'showReputationDashboard'.`;

    // Define function declarations for Gemini
    const tools = [
      {
        functionDeclarations: [
          {
            name: "startOnboardingTour",
            description: "Starts the interactive 3-minute self-serve onboarding tour of the Plumbify dashboards."
          },
          {
            name: "checkApiStatus",
            description: "Scans and checks the integration status of Twilio SMS gateway, WeChat/WeCom gateway, and GoHighLevel CRM."
          },
          {
            name: "upgradeSubscription",
            description: "Triggers the mobile billing terminal to upgrade the subscription tier.",
            parameters: {
              type: "OBJECT",
              properties: {
                tier: {
                  type: "STRING",
                  enum: ["starter", "growth", "enterprise"],
                  description: "The target subscription tier to upgrade to."
                }
              },
              required: ["tier"]
            }
          },
          {
            name: "exportLeadsToCsv",
            description: "Stages, compiles, and exports all synced leads and GHL CRM contacts into a downloadable CSV file."
          },
          {
            name: "routeToHumanLeon",
            description: "Packages dialogue history and routes the customer to Leon, our master plumber representative, for human handover."
          },
          {
            name: "showReputationDashboard",
            description: "Shows the Google Maps reputation reviews dashboard mockup illustrating rating filtering."
          }
        ]
      }
    ];

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
        tools: tools,
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
    const candidate = data.candidates?.[0];
    const replyText = candidate?.content?.parts?.[0]?.text || "";
    const functionCall = candidate?.content?.parts?.[0]?.functionCall;

    // If Gemini decided to call a function, map it to a structured response
    if (functionCall) {
      const toolName = functionCall.name;
      const args = functionCall.args || {};
      
      let description = "Executing tool...";
      if (toolName === "startOnboardingTour") {
        description = language === "zh-TW" 
          ? "正在為您啟動 Plumbify 系統功能導覽。請注意左側手機模擬器。"
          : "Initiating the Plumbify dashboards interactive tour now. Please look at the left pane.";
      } else if (toolName === "checkApiStatus") {
        description = language === "zh-TW" 
          ? "正在連線並掃描 API 閘道... 正在檢查 Twilio、企業微信與 GHL 接口。"
          : "Scanning connected API gateways... Checking Twilio SMS, WeChat work, and GHL CRM webhook integrations.";
      } else if (toolName === "upgradeSubscription") {
        const targetTier = args.tier || "growth";
        description = language === "zh-TW" 
          ? `已為您載入行動信用卡感應感應升級終端。已選擇方案：${targetTier.toUpperCase()}。`
          : `Triggering subscription upgrade to ${targetTier.toUpperCase()}. Safety contactless payment terminal loaded on the left pane.`;
      } else if (toolName === "exportLeadsToCsv") {
        description = language === "zh-TW" 
          ? "正在從資料庫撈取已同步的水電客戶資料... 正在彙整並匯出為 CSV 檔案。"
          : "Querying contact databases... Staging synced leads compilation and exporting to CSV.";
      } else if (toolName === "routeToHumanLeon") {
        description = language === "zh-TW" 
          ? "正在打包我們此對對話記錄... 正在為您轉接人工專員 Leon。請在左側留下您的聯繫方式。"
          : "Packaging conversation logs... Routing you to our master plumber representative, Leon. Please fill out the contact form on the left.";
      } else if (toolName === "showReputationDashboard") {
        description = language === "zh-TW" 
          ? "已載入口碑與商家評價過濾看板。您可以查看左側評分統計與對應導向。"
          : "Loading Google Maps reputation review gate dashboard mockup on the left pane.";
      }

      return NextResponse.json({
        reply: description,
        toolCall: {
          name: toolName,
          args: args
        }
      });
    }

    return NextResponse.json({ reply: replyText });
  } catch (err: any) {
    console.error("Gemini route error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
