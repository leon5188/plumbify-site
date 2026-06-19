import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("Vapi Webhook Received:", JSON.stringify(payload, null, 2));

    const messageType = payload.message?.type;

    if (messageType === "end-of-call-report") {
      const callId = payload.message.call?.id;
      const customerNumber = payload.message.call?.customer?.number;
      const transcript = payload.message.transcript;
      const summary = payload.message.summary;
      const recordingUrl = payload.message.recordingUrl;
      const endedReason = payload.message.endedReason;

      console.log(`[Vapi End of Call Report] Call: ${callId} for ${customerNumber}`);
      console.log(`Summary: ${summary}`);
      console.log(`Reason ended: ${endedReason}`);
      console.log(`Recording: ${recordingUrl}`);

      // In a production app, you would update the CRM database here:
      // await db.updateLeadCallResult(customerNumber, { summary, transcript, recordingUrl, status: 'completed' });
    }

    return NextResponse.json({ success: true, received: true });

  } catch (error: any) {
    console.error("Vapi webhook receiver error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
