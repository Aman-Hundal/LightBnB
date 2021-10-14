SELECT city, COUNT(reservations.id) as total_res
FROM properties
JOIN reservations ON properties.id = property_id
GROUP BY city
ORDER BY total_res DESC;