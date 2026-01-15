import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getUsersNotificationDetails,
  removeInvalidNotificationTokens,
} from "~/lib/kv";

const requestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
});

export const maxDuration = 30; // Vercel timeout বাড়াবে

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const allUsers = await getUsersNotificationDetails();
    if (!allUsers || allUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No subscribers found",
      });
    }

    // URL অনুযায়ী গ্রুপিং
    const urlGroups = allUsers.reduce((acc, curr) => {
      if (curr?.url && curr?.token) {
        if (!acc[curr.url]) acc[curr.url] = [];
        acc[curr.url].push(curr.token);
      }
      return acc;
    }, {} as Record<string, string[]>);

    let totalSent = 0;
    const allInvalid: string[] = [];

    for (const [url, tokens] of Object.entries(urlGroups)) {
      // ১০ট করে ব্যাচ পাঠানো (বেশি বড় করলে সার্ভার স্লো হতে পারে)
      for (let i = 0; i < tokens.length; i += 100) {
        const batch = tokens.slice(i, i + 100);
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
          const result = await res.json();
          totalSent += result.result?.successfulTokens?.length || 0;
          if (result.result?.invalidTokens)
            allInvalid.push(...result.result.invalidTokens);
        }
      }
    }

    if (allInvalid.length > 0) {
      await removeInvalidNotificationTokens(allInvalid).catch(console.error);
    }

    return NextResponse.json({ success: true, sent: totalSent });
  } catch (error: any) {
    console.error("Broadcast Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
