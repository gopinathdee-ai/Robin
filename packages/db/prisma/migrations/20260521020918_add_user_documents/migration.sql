-- CreateEnum
CREATE TYPE "user_document_type" AS ENUM ('RED_SEAL', 'SAFETY_WHMIS', 'SAFETY_FALL_PROTECTION', 'SAFETY_FIRST_AID', 'OTHER');

-- CreateEnum
CREATE TYPE "user_document_status" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "user_documents" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "document_type" "user_document_type" NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "status" "user_document_status" NOT NULL DEFAULT 'PENDING',
    "verified_at" TIMESTAMP(3),
    "verified_by_id" TEXT,
    "rejection_reason" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_documents_user_id_idx" ON "user_documents"("user_id");

-- CreateIndex
CREATE INDEX "user_documents_status_idx" ON "user_documents"("status");

-- AddForeignKey
ALTER TABLE "user_documents" ADD CONSTRAINT "user_documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
