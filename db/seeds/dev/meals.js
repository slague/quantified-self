exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE meals RESTART IDENTITY')
  .then(function() {
    return Promise.all([
      knex.raw(
        'INSERT INTO meals (id, name, created_at) VALUES (?, ?, ?)',
        [1, "Breakfast", new Date]
      ),
      knex.raw(
        'INSERT INTO meals (id, name, created_at) VALUES (?, ?, ?)',
        [2, "Lunch", new Date]
      ),
      knex.raw(
        'INSERT INTO meals (id, name, created_at) VALUES (?, ?, ?)',
        [3, "Dinner", new Date]
      ),
      knex.raw(
        'INSERT INTO meals (id, name, created_at) VALUES (?, ?, ?)',
        [4, "Snack", new Date]
      )
    ]);
  });
};
