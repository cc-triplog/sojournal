exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("users", function(table) {
      table.increments();
      table.string("name").notNullable();
      table.string("email");
      table.string("password").notNullable();
      table.string("created_at").defaultTo(knex.fn.now());
      table.string("updated_at").defaultTo(knex.fn.now());
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
      table.string("created_at").defaultTo(knex.fn.now());
      table.string("updated_at").defaultTo(knex.fn.now());
    }),
    knex.schema.createTable("photos", function(table) {
      table.increments();
      table.string("title");
      table.double("longitude");
      table.double("latitude");
      table
        .integer("device_id")
        .references("id")
        .inTable("devices");
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
      table.text("image_file");
      table.double("altitude");
      table.double("bearing");
      table.string("created_at").defaultTo(knex.fn.now());
      table.string("updated_at").defaultTo(knex.fn.now());
    }),
    knex.schema.createTable("gps_points", function(table) {
      table.increments();
      table.string("title");
      table.double("longitude");
      table.double("latitude");
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
      table.double("altitude");
      table.string("created_at").defaultTo(knex.fn.now());
      table.string("updated_at").defaultTo(knex.fn.now());
    }),
    knex.schema.createTable("groups", function(table) {
      table.increments();
      table.string("title");
      table.double("longitude");
      table.double("latitude");
      table
        .integer("group_id")
        .references("id")
        .inTable("groups");
      table.integer("order_in_group");
      table
        .integer("user_id")
        .references("id")
        .inTable("users");
      table.double("altitude");
      table.string("created_at").defaultTo(knex.fn.now());
      table.string("updated_at").defaultTo(knex.fn.now());
    }),
    knex.schema.createTable("interval_configs", function(table) {
      table.increments();
      table.string("title");
      table
        .integer("user_id")
        .references("id")
        .inTable("users");
      table.integer("device_id");
      table.string("start_method");
      table.integer("start_time_of_day");
      table.bigInteger("start_epoch");
      table.integer("start_countdown");
      table.string("stop_method");
      table.integer("stop_time_of_day");
      table.bigInteger("stop_epoch");
      table.integer("stop_countdown");
      table.integer("interval");
      table.string("created_at").defaultTo(knex.fn.now());
      table.string("updated_at").defaultTo(knex.fn.now());
    }),
    knex.schema.createTable("rasppi_configs", function(table) {
      table.increments();
      table
        .integer("user_id")
        .references("id")
        .inTable("users");
      table.integer("selected_interval");
      table.integer("gps_interval");
      table.string("created_at").defaultTo(knex.fn.now());
      table.string("updated_at").defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable("rasppi_configs"),
    knex.schema.dropTable("photos"),
    knex.schema.dropTable("gps_points"),
    knex.schema.dropTable("interval_configs"),
    knex.schema.dropTable("devices"),
    knex.schema.dropTable("groups"),
    knex.schema.dropTable("users")
  ]);
};
