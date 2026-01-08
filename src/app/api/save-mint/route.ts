import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { MintStatus } from "../../../../generated/prisma/enums";

export async function POST(req: NextRequest) {
  try {
    const {
      walletAddress,
      transactionHash,
      contractAddress,
      mintPrice,
      nftType,
      nftName,
      timestamp,
    } = await req.json();

    if (!walletAddress || !transactionHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const address = walletAddress.toLowerCase();

    // Check if transactionHash already saved
    const existing = await prisma.mint.findFirst({
      where: { transactionHash },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Transaction already recorded" },
        { status: 400 }
      );
    }

    // Daily mint limit check
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMint = await prisma.mint.findFirst({
      where: {
        walletAddress: address,
        timestamp: { gte: today },
      },
    });

    if (todayMint) {
      return NextResponse.json(
        { error: "Daily limit reached" },
        { status: 403 }
      );
    }

    // Ensure user exists or create
    await prisma.user.upsert({
      where: { walletAddress: address },
      update: {},
      create: {
        walletAddress: address,
      },
    });

    // Create mint record
    const mintRecord = await prisma.mint.create({
      data: {
        walletAddress: address,
        transactionHash,
        contractAddress,
        mintPrice,
        nftType,
        nftName,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        status: MintStatus.confirmed, // enum value
      },
    });

    return NextResponse.json({
      success: true,
      message: "Mint saved successfully",
      data: mintRecord,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Save mint error:", error.message, error.stack);
    } else {
      console.error("Save mint error:", error);
    }
    return NextResponse.json({ error: "Failed to save mint" }, { status: 500 });
  }
}
