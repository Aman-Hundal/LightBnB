SELECT properties.*, AVG(property_reviews.rating) AS avg_rating
FROM properties
JOIN property_reviews ON properties.id = property_id
WHERE city = 'Vancouver'
GROUP BY properties.id
HAVING avg(property_reviews.rating) >= 4
ORDER BY cost_per_night ASC
LIMIT 10;


-- NEED HAVING ON ALL AGGREGATE DATA FILTERs ITS THE ORDER BY FOR AGGREGATE FUNCS