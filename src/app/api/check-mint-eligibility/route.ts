import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address required", canMint: false },
        { status: 400 }
      );
    }

    const address = walletAddress.toLowerCase();

    // Today starting at 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if user minted today
    const todayMint = await prisma.mint.findFirst({
      where: {
        walletAddress: address,
        timestamp: {
          gte: today,
        },
      },
    });

    return NextResponse.json({
      canMint: todayMint ? false : true,
      message: todayMint ? "Already minted today" : "Can mint",
      lastMintDate: todayMint?.timestamp || null,
    });
  } catch (error) {
    console.error("Check eligibility error:", error);

    return NextResponse.json(
      { error: "Server error", canMint: false },
      { status: 500 }
    );
  }
}
