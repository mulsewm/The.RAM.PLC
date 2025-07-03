-- AlterTable
ALTER TABLE "registrations" ADD COLUMN     "statusNotes" TEXT,
ADD COLUMN     "statusUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "statusUpdatedBy" TEXT;
