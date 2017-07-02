var Food = require("./lib/models/food")
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var pry = require('pryjs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('port', process.env.PORT || 3000)
app.locals.title = 'Quantified Self'


app.get('/', function(request, response){
  response.send(app.locals.title)
})

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
  var name = request.query.name
  var calories = request.query.calories

  if(name && calories){
    Food.createFood(name, calories)
    .then(function(data){
      Food.allFoods().then(function(data){
        return response.status(201).json(data)
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

if(!module.parent){
  app.listen(app.get('port'), function() {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
