const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
var pry = require('pryjs')
var async = require('async')


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
  database.raw("SELECT * FROM meals").then(function(data){
    return data.rows
  }).then(function(meals){
      return Promise.all(meals.map(function(meal){
        return foods(meal.id).then(function(data){
          meal['foods']= data.rows
          return meal
        })
      })
    )
    }).then(function(data){
      eval(pry.it)
      return data
    })
}



function foods(id){
  return database.raw(`SELECT foods.name, foods.calories
                    FROM foods
                    JOIN meal_foods
                    ON foods.id=meal_foods.food_id
                    JOIN meals
                    ON meal_foods.meal_id = meals.id
                    WHERE meals.id =?`, [id])
}





module.exports = {
  createMeal: createMeal,
  emptyMealsTable: emptyMealsTable,
  findMeal: findMeal,
  findFirstMeal: findFirstMeal,
  allMeals: allMeals,
  foods: foods
}
