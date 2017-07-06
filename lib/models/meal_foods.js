const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
var pry = require('pryjs')


function createMealFoodJoins(meal_id, food_id){
  return database.raw(
    'INSERT INTO meal_foods (meal_id, food_id) VALUES (?, ?)',
    [meal_id, food_id]
  )
}

function emptyMealFoodsTable(){
   return database.raw('TRUNCATE meal_foods RESTART IDENTITY')
}

module.exports = {
  createMealFoodJoins: createMealFoodJoins,
  emptyMealFoodsTable: emptyMealFoodsTable
}
