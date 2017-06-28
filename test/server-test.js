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


  it('should exist', function (){
    assert(app)
  })

  describe('GET /api/v1/foods', function(){

    beforeEach(function(){
      app.locals.foods = [
        { name: 'apple', calorie_count: 50 },
        { name: 'banana', calorie_count: 100 },
        { name: 'carrot', calorie_count: 75 }
      ]
    })

    it('should return a 404 if the resource is not found', function(done){
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
})
