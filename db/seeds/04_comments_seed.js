exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("comments")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("comments").insert([
        {
          title: "Look at this guy (comment)",
          user_id: "4"
        },
        {
          title: "Comment without a Photo. Wow!",
          user_id: "4",
          group_id: "1"
        }
      ]);
    });
};
