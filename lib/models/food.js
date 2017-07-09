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

function emptyFoodsTable() {
  return database.raw('TRUNCATE foods RESTART IDENTITY')
}

function findFirst() {
 return database.raw("SELECT * FROM foods LIMIT 1")
}

function find(id){
  return database.raw("SELECT * FROM foods WHERE id=?", [id])
}

function findByName(name){
  return database.raw("SELECT * FROM foods WHERE lower(name)=?", [name])
}

function allFoods(){
  return database.raw("SELECT * FROM foods WHERE active=true ORDER BY id")
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
  return database.raw("UPDATE foods SET active=false WHERE id=?", id)
}

module.exports = {
  createFood: createFood,
  emptyFoodsTable: emptyFoodsTable,
  find: find,
  findFirst: findFirst,
  allFoods: allFoods,
  updateAll: updateAll,
  updateName: updateName,
  updateCalories: updateCalories,
  deleteFood: deleteFood,
  findByName: findByName
}
