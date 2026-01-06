import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address") || "";
    const raffleId = "raffle_1"; // তোমার রাফেল আইডি, যদি ডাইনামিক হয় তাহলে ঠিক মতো নাও

    // রাফেল ডাটা নাও
    const raffle = await prisma.raffle.findUnique({
      where: { id: raffleId },
    });

    let hasUserEntered = false;
    if (address) {
      const entry = await prisma.raffleEntry.findUnique({
        where: {
          address_raffleId: {
            address,
            raffleId,
          },
        },
      });
      hasUserEntered = !!entry;
    }

    return NextResponse.json({
      entriesCount: raffle?.entriesCount ?? 0,
      maxEntries: raffle?.maxEntries ?? 100,
      hasUserEntered,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
