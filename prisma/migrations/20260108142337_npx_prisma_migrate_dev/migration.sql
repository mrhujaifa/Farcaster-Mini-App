-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mint" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "mintPrice" TEXT NOT NULL,
    "nftType" TEXT NOT NULL,
    "nftName" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Mint_transactionHash_key" ON "Mint"("transactionHash");

-- CreateIndex
CREATE INDEX "Mint_walletAddress_idx" ON "Mint"("walletAddress");

-- CreateIndex
CREATE INDEX "Mint_timestamp_idx" ON "Mint"("timestamp");

-- AddForeignKey
ALTER TABLE "Mint" ADD CONSTRAINT "Mint_walletAddress_fkey" FOREIGN KEY ("walletAddress") REFERENCES "User"("walletAddress") ON DELETE CASCADE ON UPDATE CASCADE;
