/*
  Warnings:

  - Changed the type of `july` on the `paylists` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `baisri` on the `paylists` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `august` on the `paylists` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `september` on the `paylists` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `november` on the `paylists` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `december` on the `paylists` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `january` on the `paylists` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fabuary` on the `paylists` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "paylists" DROP COLUMN "july",
ADD COLUMN     "july" INTEGER NOT NULL,
DROP COLUMN "baisri",
ADD COLUMN     "baisri" INTEGER NOT NULL,
DROP COLUMN "august",
ADD COLUMN     "august" INTEGER NOT NULL,
DROP COLUMN "september",
ADD COLUMN     "september" INTEGER NOT NULL,
DROP COLUMN "november",
ADD COLUMN     "november" INTEGER NOT NULL,
DROP COLUMN "december",
ADD COLUMN     "december" INTEGER NOT NULL,
DROP COLUMN "january",
ADD COLUMN     "january" INTEGER NOT NULL,
DROP COLUMN "fabuary",
ADD COLUMN     "fabuary" INTEGER NOT NULL;
