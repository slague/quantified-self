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

function deleteMealFood(meal_id, food_id){
return database.raw("DELETE FROM meal_foods WHERE meal_id=? AND food_id=?", [meal_id, food_id])
}

module.exports = {
  createMealFoodJoins: createMealFoodJoins,
  emptyMealFoodsTable: emptyMealFoodsTable,
  deleteMealFood: deleteMealFood
}

