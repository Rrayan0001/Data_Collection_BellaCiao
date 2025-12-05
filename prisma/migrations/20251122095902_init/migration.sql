-- CreateTable
CREATE TABLE "GuestEntry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "area" TEXT,
    "tableNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestEntry_pkey" PRIMARY KEY ("id")
);
