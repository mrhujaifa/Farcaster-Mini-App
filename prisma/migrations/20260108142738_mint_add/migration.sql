-- CreateEnum
CREATE TYPE "MintStatus" AS ENUM ('pending', 'confirmed', 'failed');

-- AlterTable
ALTER TABLE "Mint" ADD COLUMN     "status" "MintStatus" NOT NULL DEFAULT 'pending';
