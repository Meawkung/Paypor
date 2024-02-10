-- CreateTable
CREATE TABLE "users" (
    "idusers" SERIAL NOT NULL,
    "email" VARCHAR(45) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "reg_date" TIMESTAMP(3) NOT NULL,
    "last_login_date" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" VARCHAR(10) NOT NULL DEFAULT 'user',

    CONSTRAINT "users_pkey" PRIMARY KEY ("idusers")
);

-- CreateTable
CREATE TABLE "banks" (
    "id" SERIAL NOT NULL,
    "bank_number" VARCHAR(20) NOT NULL,
    "bank_name" VARCHAR(50) NOT NULL,
    "branch_name" VARCHAR(45) NOT NULL,
    "account_name" VARCHAR(45) NOT NULL,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cpe65" (
    "email" VARCHAR(18) NOT NULL,
    "student_id" VARCHAR(11) NOT NULL,
    "prefix" VARCHAR(7) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "surname" VARCHAR(30) NOT NULL,
    "nickname" VARCHAR(10) NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "user_idusers" INTEGER,
    "paylists_id" INTEGER
);

-- CreateTable
CREATE TABLE "form" (
    "id" SERIAL NOT NULL,
    "datetime" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_loc" VARCHAR(45) NOT NULL,
    "status" BOOLEAN NOT NULL,
    "cpe65_email" VARCHAR(18) NOT NULL,

    CONSTRAINT "form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paylists" (
    "id" INTEGER NOT NULL,
    "july" BOOLEAN NOT NULL,
    "baisri" BOOLEAN NOT NULL,
    "august" BOOLEAN NOT NULL,
    "september" BOOLEAN NOT NULL,
    "november" BOOLEAN NOT NULL,
    "december" BOOLEAN NOT NULL,
    "january" BOOLEAN NOT NULL,
    "fabuary" BOOLEAN NOT NULL,
    "year" INTEGER NOT NULL,
    "email" VARCHAR(18) NOT NULL,

    CONSTRAINT "paylists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statements" (
    "id" SERIAL NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "cpe65_email" VARCHAR(18) NOT NULL,
    "banks_id" INTEGER NOT NULL,

    CONSTRAINT "statements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_idusers" ON "cpe65"("user_idusers");

-- CreateIndex
CREATE UNIQUE INDEX "paylists_id" ON "cpe65"("paylists_id");
