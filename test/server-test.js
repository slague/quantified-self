var assert = require('chai').assert
var app = require('../server')
var pry = require('pryjs')
var request = require('request')
var Food = require('../lib/models/food')

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
    Food.createFood("Milk", 80)
    .then(function() { done() });
  })

  afterEach(function(done) {
    Food.emptyFoodsTable().then(function() { done() });
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
    })
  })
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
})
