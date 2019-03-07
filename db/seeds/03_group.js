exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("groups")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("groups").insert([
        {
          title: "A Fun Day!",
          user_id: "4"
        }
      ]);
    });
};
