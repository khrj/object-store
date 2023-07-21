-- CreateTable
CREATE TABLE "file" (
    "path" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "link" (
    "content" TEXT NOT NULL PRIMARY KEY,
    "filePath" TEXT NOT NULL,
    CONSTRAINT "link_filePath_fkey" FOREIGN KEY ("filePath") REFERENCES "file" ("path") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "token" (
    "content" TEXT NOT NULL PRIMARY KEY
);
