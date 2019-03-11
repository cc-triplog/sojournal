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
    knex.schema.createTable("comments", function(table) {
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
      table.string("created_at").defaultTo(knex.fn.now());
      table.string("updated_at").defaultTo(knex.fn.now());
    }),
    knex.schema.createTable("log_cam_configs", function(table) {
      table.increments();
      table.string("title");
      table
        .integer("user_id")
        .references("id")
        .inTable("users");
      table.integer("device_id");
      table.string("interval_start_method");
      table.integer("interval_start_time_of_day");
      table.bigInteger("interval_start_epoch");
      table.integer("interval_start_countdown");
      table.string("interval_stop_method");
      table.integer("interval_stop_time_of_day");
      table.bigInteger("interval_stop_epoch");
      table.integer("interval_stop_countdown");
      table.integer("interval_interval");
      table.string("created_at").defaultTo(knex.fn.now());
      table.string("updated_at").defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable("photos"),
    knex.schema.dropTable("comments"),
    knex.schema.dropTable("log_cam_configs"),
    knex.schema.dropTable("devices"),
    knex.schema.dropTable("groups"),
    knex.schema.dropTable("users")
  ]);
};
