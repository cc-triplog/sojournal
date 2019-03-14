exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("interval_configs")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("interval_configs").insert([
        {
          user_id: "4"
        },
        {
          user_id: "4"
        }
      ]);
    });
};
