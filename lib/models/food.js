const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
var pry = require('pryjs')

function createFood(name, calories){
  return database.raw(
    'INSERT INTO foods (name, calories, created_at) VALUES (?, ?, ?)',
    [name, calories, new Date]
  )
}

// function createFoods(foods){
//   for(var i=0; i<foods.length; i++){
//   return database.raw("INSERT INTO foods (name, calories, created_at) VALUES (?, ?, ?)"),
//   [foods[i].name, foods[i].calories, new Date]
//   }
// }

function emptyFoodsTable() {
  return database.raw('TRUNCATE foods RESTART IDENTITY')
}

function findFirst() {
 return database.raw("SELECT * FROM foods LIMIT 1")
}

function find(id){
  return database.raw("SELECT * FROM foods WHERE id=?", [id])
}

function allFoods(){
  return database.raw("SELECT * FROM foods")
}

function updateAll(id, name, calories){
  return database.raw("UPDATE foods SET name=?, calories=? WHERE id=?", [name, calories, id])
}
function updateName(id, name){
  return database.raw("UPDATE foods SET name=? WHERE id=?", [name, id])
}
function updateCalories(id, calories){
  return database.raw("UPDATE foods SET calories=? WHERE id=?", [calories, id])
}

function deleteFood(id){
  return database.raw("DELETE FROM foods WHERE id = ?", id)
}

module.exports = {
  createFood: createFood,
  emptyFoodsTable: emptyFoodsTable,
  find: find,
  findFirst: findFirst,
  allFoods: allFoods,
  // createFoods: createFoods,
  updateAll: updateAll,
  updateName: updateName,
  updateCalories: updateCalories,
  deleteFood: deleteFood
}
