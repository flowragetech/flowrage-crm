-- CreateTable
CREATE TABLE "AppMeta" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppMeta_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "SystemUpdateJob" (
    "id" TEXT NOT NULL,
    "targetKind" TEXT NOT NULL DEFAULT 'core',
    "currentVersion" TEXT NOT NULL,
    "targetVersion" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "strategy" TEXT NOT NULL,
    "manifestUrl" TEXT,
    "changelog" TEXT,
    "downloadUrl" TEXT,
    "backupPath" TEXT,
    "summary" TEXT,
    "errorMessage" TEXT,
    "log" TEXT,
    "restartRequired" BOOLEAN NOT NULL DEFAULT false,
    "triggeredByUserId" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemUpdateJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SystemUpdateJob" ADD CONSTRAINT "SystemUpdateJob_triggeredByUserId_fkey" FOREIGN KEY ("triggeredByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
