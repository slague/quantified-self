exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE meals RESTART IDENTITY')
  .then(function() {
    return Promise.all([
      knex.raw(
        'INSERT INTO meals (name, created_at) VALUES (?, ?)',
        ["Breakfast", new Date]
      ),
      knex.raw(
        'INSERT INTO meals (name, created_at) VALUES (?, ?)',
        ["Lunch", new Date]
      ),
      knex.raw(
        'INSERT INTO meals (name, created_at) VALUES (?, ?)',
        ["Dinner", new Date]
      ),
      knex.raw(
        'INSERT INTO meals (name, created_at) VALUES (?, ?)',
        ["Snack", new Date]
      )
    ]);
  });
};
