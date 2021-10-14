--users
INSERT INTO users (name, email, password) VALUES ('Aragorn', 'aragorn@gondor.com','.JBIDRh70tGevYzYzQgFId2u');
INSERT INTO users (name, email, password) VALUES ('Walter White', 'wwhite@lospojoshermanos.com','BOAVhpuLvpOREQVmvmezD4ED');
INSERT INTO users (name, email, password) VALUES ('Donald Draper', 'DDraper@sterlingcooper.com','$2a$10$FB');

--properties
INSERT INTO properties (owner_id, title, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (3, 'Madion Avenue Suite', 'https://www.thecoolist.com/mad-men-don-drapers-apartment/mad-men-season-5-3/', 'https://www.thecoolist.com/mad-men-don-drapers-apartment/mad-men-season-5-3/', 1500, 1, 3, 3, 'United States', '5445 Madson Avenue', 'New York', 'New York', '90085'),
(1, 'Minas Tirith Suite', 'https://api.time.com/wp-content/uploads/2015/07/the-lord-of-the-rings-the-return-of-the-king.jpg', 'https://api.time.com/wp-content/uploads/2015/07/the-lord-of-the-rings-the-return-of-the-king.jpg', 2000, 0, 20, 20, 'Gondor', 'Gondor Street', 'Minas Tirith', 'Minas Tirith', '988500'),
(2, 'New Alberquierky House', 'https://www.cbc.ca/news/entertainment/breaking-bad-house-gets-fence-1.4355313', 'https://www.cbc.ca/news/entertainment/breaking-bad-house-gets-fence-1.4355313', 400, 4, 3, 4, 'United States', '343 Arthur Drive', 'Alberquierky', 'New Mexico', '90048');

--reservations
INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 2),
('2019-01-04', '2019-02-01', 2, 3),
('2021-10-01', '2021-10-14', 3, 1);

--reviews
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating)
VALUES (2, 1, 1, 5), (3, 2, 2, 5), (1, 3, 3, 5);