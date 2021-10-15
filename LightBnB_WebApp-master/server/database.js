const { query } = require('express');
const { Pool } = require('pg');
const pool = new Pool ({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

// this file sets up/creates functions w/ promises for userroutes and api routes to use to run datbases queries on. The API and User routes will do this to access data to create/redner the webpages.


const getUserWithEmail = function(email) {
  const queryString = `
  SELECT *
  FROM users
  WHERE email = $1;
  `;
  const values = [email];

  return pool // this is to reutnr the promise object 
  .query(queryString, values)
  .then(res => {
    console.log(res.rows[0])
    return res.rows[0]; // this will return the result of hte prmomise when this promise object is called in apiroutes.
  })
  .catch(err => {
    console.log(err.message);
  })

  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `
  SELECT *
  FROM users
  WHERE id = $1;
  `;
  const values = [id];

  return pool // this is to reutnr the promise object 
  .query(queryString, values)
  .then(res => {
    console.log(res.rows[0])
    return res.rows[0]; // this will return the result of hte prmomise when this promise object is called in apiroutes.
  })
  .catch(err => {
    console.log(err.message);
  })
}
exports.getUserWithId = getUserWithId;



/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const queryString = `
  INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`;
  const values = [user.name, user.email, user.password];

  return pool
  .query(queryString, values)
  .then((res) => {
    return res;
  })
  .catch((err) => {
    console.error(err.message);
  });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
  SELECT properties.*, reservations.*, AVG(property_reviews.rating) AS avg_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_reviews.property_id
  JOIN reservations ON properties.id = reservations.property_id
  WHERE reservations.guest_id = $1 AND reservations.end_date < now()::date 
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `;
  const values = [guest_id, limit];

  return pool
  .query(queryString, values)
  .then((res) => {
    console.log(res.rows);
    return res.rows
  })
  .catch((err) => {
    console.error(err.message);
  });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function(options, limit = 10) { // PROMISE OBJECT IS NEEDED HERE BECUASE When getAllProperties is called in the routes file, it is chained to .then, which can only consume a promise.
    const queryParams = [];
    let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    WHERE 1 = 1
    `;

    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `AND city LIKE $${queryParams.length} `;
    }
    
    if (options.owner_id) {
      queryParams.push(options.owner_id);
      queryString += `AND owner_id = $${queryParams.length} `;
    }

    if (options.minimum_price_per_night && options.maximum_price_per_night) {
      queryParams.push(options.minimum_price_per_night * 100);
      queryParams.push(options.maximum_price_per_night * 100);
      queryString += `AND cost_per_night BETWEEN $${queryParams.length-1} AND $${queryParams.length} `;
    }
    
    queryString += `GROUP BY properties.id ` 
    
    if (options.minimum_rating) {
      queryParams.push(options.minimum_rating);
      queryString += `HAVING avg(rating) >= $${queryParams.length} `;
    }

    queryParams.push(limit);
    queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  
    console.log(queryString, queryParams);

    return pool.query(queryString, queryParams).then((res) => res.rows);
  
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;
  const values = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code];

  return pool
  .query(queryString, values)
  .then((res) => {
    return res;
  })
  .catch((err) => {
    console.error(err.message);
  });
};

exports.addProperty = addProperty;
