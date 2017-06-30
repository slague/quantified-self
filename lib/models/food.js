const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

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

function all(){
  return database.raw("SELECT * FROM foods")
}

module.exports = {
  createFood: createFood,
  emptyFoodsTable: emptyFoodsTable,
  find: find,
  findFirst: findFirst,
  all: all
}