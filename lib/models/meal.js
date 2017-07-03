const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
var pry = require('pryjs')


function createMeal(name){
  return database.raw(
    'INSERT INTO meals (name, created_at) VALUES (?, ?)',
    [name, new Date]
  )
}

function emptyMealsTable() {
  return database.raw('TRUNCATE meals RESTART IDENTITY')
}

function findFirstMeal() {
 return database.raw("SELECT * FROM meals LIMIT 1")
}

function findMeal(id){
  return database.raw("SELECT * FROM meals WHERE id=?", [id])
}

function allMeals(){
  return database.raw("SELECT * FROM meals")
}


module.exports = {
  createMeal: createMeal,
  emptyMealsTable: emptyMealsTable,
  findMeal: findMeal,
  findFirstMeal: findFirstMeal,
  allMeals: allMeals
}
