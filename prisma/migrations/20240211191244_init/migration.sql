/*
  Warnings:

  - You are about to drop the column `last_login_date` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `reg_date` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "last_login_date",
DROP COLUMN "reg_date";
