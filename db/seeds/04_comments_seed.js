exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("comments")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("comments").insert([
        {
          title: "Look at this guy (comment)",
          camera_id: "fake_serial",
          user_id: "4"
        }
      ]);
    });
};
