/*
  Warnings:

  - You are about to drop the column `className` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `courseCode` on the `Course` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `auth0Id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[courseName]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseName` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Course" DROP CONSTRAINT "Course_userId_fkey";

-- DropIndex
DROP INDEX "public"."Course_courseCode_userId_key";

-- DropIndex
DROP INDEX "public"."course_code_index";

-- DropIndex
DROP INDEX "public"."User_auth0Id_key";

-- DropIndex
DROP INDEX "public"."User_email_key";

-- AlterTable
ALTER TABLE "public"."Course" DROP COLUMN "className",
DROP COLUMN "courseCode",
ADD COLUMN     "courseName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "auth0Id",
DROP COLUMN "id",
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("email");

-- CreateIndex
CREATE UNIQUE INDEX "Course_courseName_key" ON "public"."Course"("courseName");

-- CreateIndex
CREATE INDEX "course_name_index" ON "public"."Course"("courseName");

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
