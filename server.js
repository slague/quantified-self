var express = require('express')
var app = express()
var bodyParser = require('body-parser')


app.set('port', process.env.PORT || 3000)


app.locals.title = 'Quantified Self'
app.locals.foods = [
  { name: 'apple', calorie_count: 50 },
  { name: 'banana', calorie_count: 100 },
  { name: 'carrot', calorie_count: 75 }
]

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



app.get('/api/v1/foods', function(request, response) {
  var foods = app.locals.foods

  // if(!message){ return response.sendStatus(404) }
    response.json(foods)
})



if(!module.parent){
  app.listen(app.get('port'), function() {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
