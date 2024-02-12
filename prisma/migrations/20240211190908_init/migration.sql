/*
  Warnings:

  - Added the required column `selected_months` to the `form` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "form" ADD COLUMN     "selected_months" VARCHAR(100) NOT NULL;
