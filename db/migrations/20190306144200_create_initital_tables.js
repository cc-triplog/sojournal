exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("users", function(table) {
      table.increments();
      table.string("name");
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    }),
    knex.schema.createTable("devices", function(table) {
      table.increments();
      table.string("title");
      table.string("device_serial");
      table
        .integer("user_id")
        .references("id")
        .inTable("users")
        .notNullable();
    }),
    knex.schema.createTable("photos", function(table) {
      table.increments();
      table.string("title");
      table.string("longitude");
      table.string("latitude");
      table
        .integer("device_id")
        .references("id")
        .inTable("devices")
        .notNullable();
      table
        .integer("group_id")
        .references("id")
        .inTable("groups");
      table.integer("order_in_group");
      table
        .integer("user_id")
        .references("id")
        .inTable("users")
        .notNullable();
      table
        .integer("comment_id")
        .references("id")
        .inTable("comments");
      table.string("document_location");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    }),
    knex.schema.createTable("comments", function(table) {
      table.increments();
      table.string("title");
      table.string("longitude");
      table.string("latitude");
      table
        .integer("group_id")
        .references("id")
        .inTable("groups");
      table.integer("order_in_group");
      table
        .integer("user_id")
        .references("id")
        .inTable("users")
        .notNullable();
      table.text("comment");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    }),
    knex.schema.createTable("groups", function(table) {
      table.increments();
      table.string("title");
      table.string("longitude");
      table.string("latitude");
      table
        .integer("group_id")
        .references("id")
        .inTable("groups");
      table.integer("order_in_group");
      table
        .integer("user_id")
        .references("id")
        .inTable("users");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable("photos"),
    knex.schema.dropTable("comments"),
    knex.schema.dropTable("devices"),
    knex.schema.dropTable("groups"),
    knex.schema.dropTable("users")
  ]);
};
