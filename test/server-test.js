var assert = require('chai').assert
var app = require('../server')

var request = require('request')

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

  beforeEach(function(){
    app.locals.foods = [
      { id: 1, name: 'apple', calorieCount: 50 },
      { id: 2, name: 'banana', calorieCount: 100 },
      { id: 3, name: 'carrot', calorieCount: 75 }
    ]
  })


  it('should exist', function (){
    assert(app)
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
      this.request.get('/api/v1/foods', function(error, response){
        if(error){done(error)}

        var foodsCount = Object.keys(app.locals.foods).length
        assert.equal(response.body, JSON.stringify(app.locals.foods))
        assert.equal(foodsCount, 3)
        done()
      })
    })

  })
  describe('GET /api/v1/foods/:id', function(){
    it('should return 404 if the resource is not found', function(done){
      this.request.get('/api/v1/foods/hi', function(error, response){
        if(error){done(error)}
        assert.equal(response.statusCode, 404)
        done()
      })
    })
    it('should have an id, name, and calorie count from the resource', function(done){
      var id = app.locals.foods[0][id]
      var name = app.locals.foods[0][name]
      var calorieCount = app.locals.foods[0][calorieCount]
      this.request.get('/api/v1/foods'+id, function(error, response){
        if(error){done(error)}
        assert.include(response.body, id)
        assert.include(response.body, name)
        assert.include(response.body, calorieCount)
        done()
      })
    })
  })
})
