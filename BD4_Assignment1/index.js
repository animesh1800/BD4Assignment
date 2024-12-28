const express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();

let { open } = require('sqlite');

const { resolve } = require('path');

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors());

let db;

(async () => {
  db = await open({
    filename: './BD4_Assignment1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  let results = await fetchAllRestaurants();

  res.status(200).json(results);
});

async function fetchAllRestaurantsById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);

  return { restaurants: response };
}
app.get('/restaurants/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);

  let results = await fetchAllRestaurantsById(id);
  res.status(200).json(results);
});

//-----------------------------------------------------------------

async function fetchAllRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;

  let results = await fetchAllRestaurantsByCuisine(cuisine);
  res.status(200).json(results);
});

//--------------------------------------------------------------------

async function fetchAllRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;

  let results = await fetchAllRestaurantsByFilter(
    isVeg,
    hasOutdoorSeating,
    isLuxury
  );

  res.status(200).json(results);
});

//----------------------------------------------------------------

async function SortRestaurantsByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  let results = await SortRestaurantsByRating();

  res.status(200).json(results);
});

//--------------------------------------------------------

async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  let results = await fetchAllDishes();

  res.status(200).json(results);
});

//---------------------------------------

async function fetchAllDishesById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);

  return { dishes: response };
}
app.get('/dishes/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);

  let results = await fetchAllDishesById(id);
  res.status(200).json(results);
});

//---------------------------------------------
async function fetchAllDishesByFilter(isVegg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVegg]);
  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVegg = req.query.isVeg;
  let results = await fetchAllDishesByFilter(isVegg);

  res.status(200).json(results);
});

//---------------------------------------------------------------

async function SortByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price DESC';
  let response = await db.all(query, []);

  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  let results = await SortByPrice();

  res.status(200).json(results);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
