Quantified Self API

We built an API with  Node.js and Express that provides endpoints consumed by [Quantified Self](https://lukyans.github.io/quantified-self-fe/foods.html) app.

Setup

Clone this repo.

`npm install`

Run the app locally

`npm start`

Navigate to http://127.0.0.1:3000

Visit the production site here:

Base Url: https://quantified-self-1701.herokuapp.com/

API Endpoints:

  1. Foods:
  Get all Foods GET `/api/v1/foods`

  Get a single Food GET `/api/v1/foods/:id`

  Create a Food POST `api/v1/foods`
  + body: {name: nameOfFood, calories: numberOfCalories}

  Update a Food `/api/v1/foods/:id`
  + body: {name: nameOfFood, calories: numberCals}

  Delete a Food `/api/v1/foods/:id`

  2. Meals
  Get all Foods GET `/api/v1/meals`

  Get a single Meal GET `/api/v1/meals/:id`
  **Note: Breakfast(id=1), Lunch(id=2), Dinner(id=3), Snack(id=4)**

  Add a Food to a Meal POST `/api/v1/meals/:id`
  + body: {food_id: idOfFood}

  Remove a Food from a Meal DELETE `/api/v1/meals/:id`
  + body: {food_id: idOfFood}
