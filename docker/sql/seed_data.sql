insert into "ADMIN_USERS" ("id", "name", "role", "username", "password" ) 
values ('1', 'Admin', 100, 'admin', '$2b$04$iuWa.uWhGjyhmWcd1ktPG.pExRxFG2r8F/Jw77VaDYkPQDoYkxbMO');

INSERT INTO "BRANDS" ("id", "name") VALUES
('b1', 'Toyota'),
('b2', 'BMW'),
('b3', 'Tesla'),
('b4', 'Ford'),
('b5', 'Audi');

INSERT INTO "ENGINES" ("id", "name") VALUES
('e1', '1.8L I4 Hybrid'),
('e2', '3.0L Turbo I6'),
('e3', '5.0L V8'),
('e4', 'Dual Motor Electric'),
('e5', '2.0L Turbo I4'),
('e6', '6.2L Supercharged V8');

INSERT INTO "PRODUCTS" (
    "id", "name", "status", "brandId", "engineId",
    "transmission", "drive_type", "driver_min_age", "seats", "doors",
    "luggage_capacity", "bluetooth", "aux", "gps"
) VALUES
('p1', 'Toyota Corolla Hybrid', 1, 'b1', 'e1', 1, 2, 21, 5, 4, '3 medium suitcases', TRUE, TRUE, TRUE),
('p2', 'BMW 340i', 1, 'b2', 'e2', 2, 2, 25, 5, 4, '3 large suitcases', TRUE, TRUE, TRUE),
('p3', 'Ford Mustang GT', 1, 'b4', 'e3', 2, 2, 25, 4, 2, '2 medium suitcases', TRUE, TRUE, TRUE),
('p4', 'Tesla Model S', 1, 'b3', 'e4', 2, 2, 25, 5, 4, '4 large suitcases', TRUE, FALSE, TRUE),
('p5', 'Audi A4', 1, 'b5', 'e5', 1, 2, 23, 5, 4, '3 medium suitcases', TRUE, TRUE, TRUE),
('p6', 'Ford Raptor', 1, 'b4', 'e6', 2, 4, 27, 5, 4, '5 large suitcases', TRUE, TRUE, TRUE);

INSERT INTO "USERS" ("id", "name", "status", "mobile", "email", "username", "password") VALUES
('u1', 'Alice Johnson', 1, '+15551230001', 'alice@example.com', 'alicej', '$2b$04$iuWa.uWhGjyhmWcd1ktPG.pExRxFG2r8F/Jw77VaDYkPQDoYkxbMO'),
('u2', 'Bob Smith', 1, '+15551230002', 'bob@example.com', 'bobsmith', '$2b$04$iuWa.uWhGjyhmWcd1ktPG.pExRxFG2r8F/Jw77VaDYkPQDoYkxbMO'),
('u3', 'Charlie Lee', 1, '+15551230003', 'charlie@example.com', 'charliel', '$2b$04$iuWa.uWhGjyhmWcd1ktPG.pExRxFG2r8F/Jw77VaDYkPQDoYkxbMO'),
('u4', 'Diana King', 1, '+15551230004', 'diana@example.com', 'dianak', '$2b$04$iuWa.uWhGjyhmWcd1ktPG.pExRxFG2r8F/Jw77VaDYkPQDoYkxbMO'),
('u5', 'Ethan Walker', 1, '+15551230005', 'ethan@example.com', 'ethanw', '$2b$04$iuWa.uWhGjyhmWcd1ktPG.pExRxFG2r8F/Jw77VaDYkPQDoYkxbMO');

INSERT INTO "ORDERS" (
    "id", "status", "productId", "userId", "mobile", "email", "startDate", "endDate", "meta"
) VALUES
('o1', 1, 'p1', 'u1', '+15551230001', 'alice@example.com',
 '2025-11-01 09:00:00+00', '2025-11-05 18:00:00+00',
 '{"productName": "Toyota Corolla Hybrid", "userName": "Alice Johnson", "notes": "Include child seat"}'),

('o2', 1, 'p4', 'u2', '+15551230002', 'bob@example.com',
 '2025-11-03 10:00:00+00', '2025-11-07 16:00:00+00',
 '{"productName": "Tesla Model S", "userName": "Bob Smith", "pickup_location": "Airport Terminal 3"}'),

('o3', 2, 'p3', 'u3', '+15551230003', 'charlie@example.com',
 '2025-10-20 08:00:00+00', '2025-10-24 20:00:00+00',
 '{"productName": "Ford Mustang GT", "userName": "Charlie Lee", "insurance": "premium"}'),

('o4', 1, 'p5', 'u4', '+15551230004', 'diana@example.com',
 '2025-11-10 09:30:00+00', '2025-11-15 17:00:00+00',
 '{"productName": "Audi A4", "userName": "Diana King", "gps_requested": true}'),

('o5', 1, 'p6', 'u5', '+15551230005', 'ethan@example.com',
 '2025-11-12 07:00:00+00', '2025-11-17 19:00:00+00',
 '{"productName": "Ford Raptor", "userName": "Ethan Walker", "offroad_package": true}');
