exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("comments")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("comments").insert([
        {
          title: "No photo. (comment)",
          user_id: "4",
          latitude: "35.658124669454075",
          longitude: "139.72756780246945"
        },
        {
          title: "Comment without a Photo. Wow!",
          user_id: "4",
          group_id: "1",
          latitude: "35.658124669454075",
          longitude: "139.72756780246945"
        }
      ]);
    });
};
