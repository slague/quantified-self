var Food = require("./lib/models/food")
var Meal = require("./lib/models/meal")
var MealFood = require("./lib/models/meal_foods")
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cors = require('cors')
var pry = require('pryjs')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Quantified Self'


app.get('/', function(request, response){
  response.send(app.locals.title)
})

// FOOD API ENDPOINTS
app.get('/api/v1/foods', function(request, response) {
  Food.allFoods()
  .then(function(data){
    if(data.rowCount == 0){
      return response.sendStatus(404)
    }
    response.json(data.rows)
  })
})

app.get('/api/v1/foods/:id', function(request, response){
  var id = request.params.id
  Food.find(id)
  .then(function(data){
    if(data.rowCount == 0) {
      return response.sendStatus(404)
    }
    response.json(data.rows[0])
  })
})

app.post('/api/v1/foods', function(request, response){
  // NEEDS HELP! request.query allows for function to work in postman, but fails tests
  // request.body allows tests to pass, but does not work in postman!

  var name = request.body.name
  var calories = request.body.calories
  if(name && calories){
    Food.createFood(name, calories)
    .then(function(data){
      Food.findByName(name).then(function(data){
      // eval(pry.it)
        return response.status(201).json(data.rows[0])
      })
    })
  }
    if(!name){
      return response.status(422).send({ error: "A food item must have a name"})
    }
    if(!calories){
      return response.status(422).send({ error: "A food item must have calories"})
    }
})

app.put('/api/v1/foods/:id', function(request, response){
  // NEEDS HELP! request.query allows for function to work in postman, but fails tests
  // request.body allows tests to pass, but does not work in postman!
  var id = request.params.id
  var name = request.body.name
  var calories = request.body.calories

  Food.find(id)
  .then(function(data){
    if(data.rowCount == 0) {
      return response.sendStatus(404)
    }

    if(name && calories){
      Food.updateAll(id, name, calories)
      .then(function(data){
        Food.allFoods().then(function(data){
          return response.status(201).json(data)
        })
      })
    }

    if(!calories){
      Food.updateName(id, name)
      .then(function(data){
        Food.allFoods().then(function(data){
          return response.status(201).json(data)
        })
      })
    }

    if(!name){
      Food.updateCalories(id, calories)
      .then(function(data){
        Food.allFoods().then(function(data){
          return response.status(201).json(data)
        })
      })
    }
  })
})

app.delete('/api/v1/foods/:id', function(request, response){
  var id = request.params.id

  Food.find(id)
  .then(function(data){
    if(data.rowCount == 0) {
      return response.sendStatus(404)
    }
    Food.deleteFood(id)
    .then(function(data){
      Food.allFoods().then(function(data){
        return response.status(200).json(data)
      })
    })
  })
})


// MEALS API ENDPOINTS
app.get('/api/v1/meals', function(request, response) {
  Meal.allMeals()
  .then(function(data){
    if(data.rowCount == 0){
      return response.sendStatus(404)
    }
    response.json(data)
  })
})

app.get('/api/v1/meals/:id', function(request, response){
  var id = request.params.id
  Meal.findMeal(id)
  .then(function(data){
    response.json(data)
  })
})

app.post('/api/v1/meals/:id', function(request, response){
  var id = request.params.id
  var foodName = request.query.foodName
  var ourFood = Food.findByName(foodName).then(function(data){
    var ourFood = data.rows[0]
    if(!ourFood){
      return response.sendStatus(404)
    }
    MealFood.createMealFoodJoins(id, ourFood.id).then(function(data){
      Meal.findMeal(id).then(function(data){
        return response.status(201).json(data)
      })
    })
  })
})

  app.delete('/api/v1/meals/:id', function(request, response){
    var id = request.params.id
    var name = request.query.name

    var ourFood = Food.findByName(name).then(function(data){
      var ourFood = data.rows[0]
      MealFood.deleteMealFood(id, ourFood.id).then(function(data){
        Meal.findMeal(id).then(function(data){
          return response.status(200).json(data)
        })
      })
    })
  })

if(!module.parent){
  app.listen(app.get('port'), function() {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
