create table IF NOT EXISTS "ADMIN_USERS"(
    "id" VARCHAR(32) primary KEY,
    "name" VARCHAR(50) not null,
    "role" INTEGER not null,
    "username" VARCHAR(30) not null,
    "password" VARCHAR(60),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

create table IF NOT EXISTS "USERS"(
    "id" VARCHAR(32) primary KEY,
    "name" VARCHAR(50) not null,
    "ref" VARCHAR(32) not null,
    "role" INTEGER not null,
    "employeeCard" VARCHAR(16),
    "mobile" VARCHAR(128) not null,
    "status" INTEGER not null,
    "merchantId" VARCHAR(32) not null,
    "username" VARCHAR(30) not null,
    "password" VARCHAR(60),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);