-- Migration: Add union_local_name column to users table
-- Date: 2026-05-28
-- Description: Add a freeform text field to store union local information

ALTER TABLE "users" ADD COLUMN "union_local_name" VARCHAR(200);
