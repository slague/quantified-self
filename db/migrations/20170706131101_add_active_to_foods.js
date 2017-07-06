
exports.up = function(knex, Promise) {
    return knex.schema.table('foods', function(t) {
        t.boolean('active').notNull().defaultTo(true);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('foodss', function(t) {
        t.dropColumn('active');
    });
};
