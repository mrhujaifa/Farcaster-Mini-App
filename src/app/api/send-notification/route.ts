import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getUsersNotificationDetails,
  removeInvalidNotificationTokens,
} from "~/lib/kv";

const requestSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    // ১. চেক করুন এনভায়রনমেন্ট ভেরিয়েবল আছে কি না (Debug এর জন্য)
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.error("Missing Redis Env Vars");
      return NextResponse.json(
        { error: "Server Configuration Error" },
        { status: 500 }
      );
    }

    // ২. রিকোয়েস্ট বডি ভ্যালিডেশন
    const json = await request.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Title and Body are required" },
        { status: 400 }
      );
    }

    // ৩. KV থেকে ইউজার লিস্ট আনা
    const allUsers = await getUsersNotificationDetails();
    if (!allUsers || allUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No users to notify",
      });
    }

    // ৪. URL অনুযায়ী টোকেন গ্রুপিং
    const urlGroups = allUsers.reduce((acc, curr) => {
      if (!curr.url || !curr.token) return acc; // ইনভ্যালিড ডাটা স্কিপ
      if (!acc[curr.url]) acc[curr.url] = [];
      acc[curr.url].push(curr.token);
      return acc;
    }, {} as Record<string, string[]>);

    let totalSuccessful = 0;
    const allInvalidTokens: string[] = [];

    // ৫. নোটিফিকেশন পাঠানো
    for (const [url, tokens] of Object.entries(urlGroups)) {
      // Farcaster batch limit সাধারণত ১০০
      for (let i = 0; i < tokens.length; i += 100) {
        const batch = tokens.slice(i, i + 100);

        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              notificationId: `msg-${Date.now()}`,
              title: parsed.data.title,
              body: parsed.data.body,
              targetUrl: "https://farcester-mini-app-1.vercel.app",
              tokens: batch,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            totalSuccessful += data.result?.successfulTokens?.length || 0;
            if (data.result?.invalidTokens) {
              allInvalidTokens.push(...data.result.invalidTokens);
            }
          }
        } catch (fetchErr) {
          console.error("Batch fetch failed for URL:", url, fetchErr);
        }
      }
    }

    // ৬. ইনভ্যালিড টোকেন ক্লিনআপ (Background-এ)
    if (allInvalidTokens.length > 0) {
      removeInvalidNotificationTokens(allInvalidTokens).catch((err) =>
        console.error("Cleanup error:", err)
      );
    }

    return NextResponse.json({
      success: true,
      sentCount: totalSuccessful,
      invalidCount: allInvalidTokens.length,
    });
  } catch (error: any) {
    console.error("Critical Route Error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
