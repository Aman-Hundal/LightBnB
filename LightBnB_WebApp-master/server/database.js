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
  INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`;
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


  // return getAllProperties(null, 2);
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
  const queryString = 
  `SELECT *
  FROM properties
  LIMIT $1`;
  const values = [limit];
  
  return pool // you need a return here so that this entire pool promise object is returned as a promise object to the .then /properties in the api routes. The /properties calls this function and cahins to a .then WHICH ONLY CAN TAKE A PROMISE OBJECT. So this entire promise pool object must be returned so the function call which chains to a .then in /properties can be executed.
  .query(queryString, values) 
  .then((res) => {
    // console.log(res.rows);
    return res.rows; // THIS RETURN IS NEEDED SO THAT THE PROMISE OBJECT (RETURN POOL) CARRIES WITH IT THE RESULT OF THIS QUERY PROMISE. THIS REUTRN RES.ROWS IS PIGGIED BACK AS A RESULT WITH THE RESULT POOL AND THE RESULT QUERY DATA CAN BE PASED TO /PROPERTIES .THEN CHAIN. 
  })
  .catch((e) => {
    // console.log(e.message);
    return e.message;
  });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
