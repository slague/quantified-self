var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var Food = require("./lib/models/food")


app.set('port', process.env.PORT || 3000)
app.locals.title = 'Quantified Self'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', function(request, response){
  response.send(app.locals.title)
})

// app.get('/api/v1/foods', function(request, response) {
//   // var foods = app.locals.foods
//
//   // if(!message){ return response.sendStatus(404) }
//     response.json(foods)
// })

app.get('/api/v1/foods/:id', function(request, response){
  var id = request.params.id
  Food.find(id)
  .then(function(data){
    if(data.rowCount == 0) { return response.sendStatus(404)}
    response.json(data.rows[0])
  })
})



if(!module.parent){
  app.listen(app.get('port'), function() {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
