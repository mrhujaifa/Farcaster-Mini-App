import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address required" },
        { status: 400 }
      );
    }

    const address = walletAddress.toLowerCase();

    const nfts = await prisma.mint.findMany({
      where: {
        walletAddress: address,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: nfts.length,
      nfts,
    });
  } catch (error) {
    console.error("Get NFTs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch NFTs" },
      { status: 500 }
    );
  }
}
