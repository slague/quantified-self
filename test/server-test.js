var assert = require('chai').assert
var app = require('../server')
var pry = require('pryjs')
var request = require('request')
var Food = require('../lib/models/food')
var Meal = require('../lib/models/meal')
var MealFood = require('../lib/models/meal_foods')

describe('server', function (){
  before(function(done){
    this.port = 9876
    this.server = app.listen(this.port, function(err, result){
      if(err) { return done(err) }
      done()
    })
    this.request = request.defaults({
      baseUrl: 'http://localhost:9876'
    })
  })

  after(function(){
    this.server.close()
  })

  it('should exist', function (){
    assert(app)
  })

  beforeEach(function(done) {
    Food.createFood("Milk", 80).then(function() {
      Food.createFood("Hamburger", 400).then(function(){
        Food.createFood("Chips", 200).then(function(){
          Food.createFood("Carrots", 50).then(function(){
            Food.createFood("Pancake", 175).then(function(){
              Food.createFood("Bread", 90).then(function(){
                Meal.createMeal("Breakfast").then(function(){
                  Meal.createMeal("Lunch").then(function(){
                    Meal.createMeal("Dinner").then(function(){
                      Meal.createMeal("Snack").then(function(){
                        MealFood.createMealFoodJoins(1,1).then(function(){
                          MealFood.createMealFoodJoins(1,5).then(function(){
                            MealFood.createMealFoodJoins(2, 2).then(function(){
                              MealFood.createMealFoodJoins(2,3).then(function(){
                                done()
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })

  afterEach(function(done) {
    Food.emptyFoodsTable().then(function() {
      Meal.emptyMealsTable().then(function(){
        done()
      })
    })
  })

  describe('Get / ', function(){

    it('should return a 200', function(done){
      this.request.get('/', function(error, response){
        if (error) { done(error) }
        assert.equal(response.statusCode, 200)
        done()
      })
    })

    it('should have a body with the name of the application', function(done){
      this.request.get('/', function(error, response){
        if (error) { done(error) }
        assert.include(response.body, app.locals.title)
        done()
      })
    })
  })

  describe('GET /api/v1/foods', function(){
    it('should return a 404 if the resource does not exist', function(done){
      this.request.get('/api/v1/hello', function(error, response){
      if(error){ done(error) }
      assert.equal(response.statusCode, 404)
      done()
      })
    })

    it('should return a list of all foods', function(done){
      var ourRequest = this.request
      Food.allFoods()
      .then(function(data){

        ourRequest.get('/api/v1/foods', function(error, response){
          if(error){done(error)}
          var parsedFoods = JSON.parse(response.body)
          var parsedFood = parsedFoods[0]

          assert.isArray(parsedFoods)
          assert.equal(parsedFood.name, 'Milk')
          assert.equal(parsedFood.calories, 80)
          assert.equal(parsedFoods.length, 1)
        done()
      })

  describe('GET /api/v1/foods/:id', function(){
    it('should return 404 if the resource is not found', function(done){
      this.request.get('/api/v1/foods/1000', function(error, response){
        if(error){done(error)}
        assert.equal(response.statusCode, 404)
        done()
      })
    })

    it('should have an id, name, and calorie count from the resource', function(done){
      var ourRequest = this.request
      Food.findFirst()
      .then(function(data){
        var id = data.rows[0].id
        var name = data.rows[0].name
        var calories = data.rows[0].calories
        var created_at = data.rows[0].created_at
        ourRequest.get('/api/v1/foods/'+id, function(error, response){
          if(error){done(error)}

          var parsedFood = JSON.parse(response.body)
          assert.equal(parsedFood.id, id)
          assert.equal(parsedFood.name, name)
          assert.equal(parsedFood.calories, calories)
          assert.ok(parsedFood.created_at)
          done()
        })
      })
    })
  })
  describe('POST /api/v1/foods', function(){
    it('it receives and stores data', function(done) {
      var newFood = { name: "Pizza", calories: 350 }

      this.request.post('/api/v1/foods', {form: newFood}, function(error, response){
        if (error) { done(error) }

        Food.find(7)
        .then(function(data){

          var addedFood = data.rows[0]
          assert.equal(response.statusCode, 201)
          assert.equal(addedFood.name, newFood.name)
          assert.equal(addedFood.calories, newFood.calories)
          assert.equal(addedFood.id, 7)
          assert.include(response.body, newFood.calories)
          assert.include(response.body, newFood.name)
          done()
        })
      })
    })
    it('it must have a name, it returns 422 without a name', function(done){
      var newFood = {calories: 100}

      this.request.post('api/v1/foods', {form: newFood}, function(error, response){
        if (error) {done(error)}
        Food.find(7)
        .then(function(data){

          assert.equal(response.statusCode, 422)
          assert.equal(data.rowCount, 0)
          done()
        })
      })
    })
    it('it must have calories, it returns 422 without calories', function(done){
      var newFood = {name: 'Chicken'}
      this.request.post('api/v1/foods', {form: newFood}, function(error, response){
        if (error) {done(error)}
        Food.find(7)
        .then(function(data){

          assert.equal(response.statusCode, 422)
          assert.equal(data.rowCount, 0)
          done()
        })
      })
    })
  })

  describe('PUT /api/v1/foods/:id', function(){
    it('updates an existing record with an new/edited name', function(done){

      var editFood = {name: "Chocolate Milk"}

      this.request.put('api/v1/foods/1', {form: editFood}, function(error, response){
        if (error) {done(error)}
        Food.find(1)
        .then(function(data){

          var updatedFood = data.rows[0]
          assert.equal(response.statusCode, 201)
          assert.equal(updatedFood.name, editFood.name)
          assert.equal(updatedFood.calories, 80)
          done()
        })
      })
    })


    it('updates an existing record with new/edited calories', function(done){
      var editFood = {calories: 150}

      this.request.put('api/v1/foods/1', {form: editFood}, function(error, response){
        if (error) {done(error)}
        Food.find(1)
        .then(function(data){

          var updatedFood = data.rows[0]
          assert.equal(response.statusCode, 201)
          assert.equal(updatedFood.calories, editFood.calories)
          assert.equal(updatedFood.name, "Milk")
          done()
        })
      })
    })

    it('updates an existing record with a new/edited name and new/edited calories', function(done){
      var editFood = {name: "Chocolate Milk", calories: 150}

      this.request.put('api/v1/foods/1', {form: editFood}, function(error, response){
        if (error) {done(error)}
        Food.find(1)
        .then(function(data){

          var updatedFood = data.rows[0]
          assert.equal(response.statusCode, 201)
          assert.equal(updatedFood.calories, editFood.calories)
          assert.equal(updatedFood.name, editFood.name)
          done()
        })
      })
    })

    it('returns a 404 if the resource is not found', function(done){
      this.request.put('/api/v1/foods/1000', function(error, response){
        if(error){done(error)}
        assert.equal(response.statusCode, 404)
        done()
      })
    })
  })
  describe('DELETE /api/v1/foods/:id', function(){
    this.timeout(100000);
    it('removes an existing record', function(done){
      this.request.delete('/api/v1/foods/1', function(error, response){
        if(error){done(error)}
        Food.allFoods()
        .then(function(data){
          assert.equal(response.statusCode, 200)
          assert.equal(data.rowCount, 5)
          done()
        })
      })
    })
    it('returns a 404 if the resource is not found', function(done){
      this.request.delete('/api/v1/foods/1000', function(error, response){
        if(error){done(error)}
        assert.equal(response.statusCode, 404)
        done()
      })
    })
  })

  describe('GET /api/v1/meals', function(){
    this.timeout(10000000);

    it('should return a 404 if the resource does not exist', function(done){
      this.request.get('/api/v1/hello', function(error, response){
      if(error){ done(error) }
      assert.equal(response.statusCode, 404)
      done()
      })
    })
    it('should return a list of all meals', function(done){
      Meal.allMeals()
      .then(function(data){

        ourRequest.get('/api/v1/meals', function(error, response){
          if(error){done(error)}
          var parsedMeals = JSON.parse(response.body)
          var parsedMeal = parsedMeals[0]
// eval(pry.it)
          assert.isArray(parsedMeals)
          assert.equal(parsedMeals.length, 4)
          assert.equal(parsedMeal.name, 'Breakfast')
          assert.equal(parsedMeal.foods, [ {name: "Yogurt", calories: 155 }, {name:"Banana", calories: 100}])
        done()
        })
      })
    })
  })
})
