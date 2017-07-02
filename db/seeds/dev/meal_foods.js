exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE meal_foods RESTART IDENTITY')
  .then(function() {
    return Promise.all([
      knex.raw(
        'INSERT INTO meal_foods (meal_id, food_id) VALUES (?, ?)',
        [1, 5]
      ),
      knex.raw(
        'INSERT INTO meal_foods (meal_id, food_id) VALUES (?, ?)',
        [1, 7]
      ),
      knex.raw(
        'INSERT INTO meal_foods (meal_id, food_id) VALUES (?, ?)',
        [2, 2]
      ),
      knex.raw(
        'INSERT INTO meal_foods (meal_id, food_id) VALUES (?, ?)',
        [2, 4]
      ),
      knex.raw(
        'INSERT INTO meal_foods (meal_id, food_id) VALUES (?, ?)',
        [3, 6]
      ),
      knex.raw(
        'INSERT INTO meal_foods (meal_id, food_id) VALUES (?, ?)',
        [4, 1]
      ),
      knex.raw(
        'INSERT INTO meal_foods (meal_id, food_id) VALUES (?, ?)',
        [3, 3]
      )
    ]);
  });
};
