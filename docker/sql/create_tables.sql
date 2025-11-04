create table IF NOT EXISTS "ADMIN_USERS"(
    "id" VARCHAR(32) primary KEY,
    "name" VARCHAR(50) not null,
    "role" INTEGER not null,
    "username" VARCHAR(30) not null,
    "password" VARCHAR(60),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "BRANDS" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ENGINES" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "PRODUCTS" (
    "id" VARCHAR(32) PRIMARY KEY,
    "name" VARCHAR(32) NOT NULL,
    "status" INTEGER NOT NULL,
    "brandId" VARCHAR(32) NOT NULL,
    "engineId" VARCHAR(32) NOT NULL,
    "transmission" INTEGER NOT NULL,
    "drive_type" INTEGER NOT NULL,
    "driver_min_age" INTEGER NOT NULL,
    "seats" INTEGER NOT NULL,
    "doors" INTEGER NOT NULL,
    "luggage_capacity" VARCHAR(200) NOT NULL,
    "bluetooth" BOOLEAN DEFAULT FALSE,
    "aux" BOOLEAN DEFAULT FALSE,
    "gps" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_products_brand" FOREIGN KEY ("brandId") REFERENCES "BRANDS"("id"),
    CONSTRAINT "fk_products_engine" FOREIGN KEY ("engineId") REFERENCES "ENGINES"("id")
);


CREATE TABLE IF NOT EXISTS "IMAGES" (
    "id" VARCHAR(32) PRIMARY KEY,
    "productId" VARCHAR(32) NOT NULL,
    "url" VARCHAR(1000) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_products" FOREIGN KEY ("productId") REFERENCES "PRODUCTS"("id")
);

create table IF NOT EXISTS "ORDERS"(
    "id" VARCHAR(32) primary KEY,
    "status" INTEGER not null,
    "productId" VARCHAR(32) not null,
    "userId" VARCHAR(32) not null,
    "mobile" VARCHAR(128) not null,
    "email" VARCHAR(32) not null,
    "startDate" TIMESTAMP WITH TIME ZONE not null,
    "endDate" TIMESTAMP WITH TIME ZONE not null,
    "description" VARCHAR(500),
    "meta" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_orders_product" FOREIGN KEY ("productId") REFERENCES "PRODUCTS"("id")
);

create table IF NOT EXISTS "USERS"(
    "id" VARCHAR(32) primary KEY,
    "name" VARCHAR(50) not null,
    "status" INTEGER not null,
    "mobile" VARCHAR(128) not null,
    "email" VARCHAR(32) not null,
    "username" VARCHAR(30) not null,
    "password" VARCHAR(60),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);