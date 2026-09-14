-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "priceLabel" TEXT,
    "area" REAL NOT NULL,
    "areaUnit" TEXT NOT NULL DEFAULT 'sq.ft.',
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "description" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "mapLink" TEXT,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "layoutMapUrl" TEXT,
    "brochureUrl" TEXT,
    "plotDimensions" TEXT,
    "facing" TEXT,
    "cornerPlot" BOOLEAN NOT NULL DEFAULT false,
    "boundaryWall" BOOLEAN NOT NULL DEFAULT false,
    "bhk" TEXT,
    "floor" TEXT,
    "totalFloors" INTEGER,
    "furnishing" TEXT,
    "parking" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "companyName" TEXT NOT NULL DEFAULT 'DK Associated',
    "tagline" TEXT NOT NULL DEFAULT 'Trusted plots & flats, built on transparency.',
    "email" TEXT NOT NULL DEFAULT '',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "mapLink" TEXT NOT NULL DEFAULT '',
    "aboutText" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT,
    "heroImageUrl" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "message" TEXT NOT NULL,
    "propertyId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");
