exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("photos")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("photos").insert([
        {
          title: "Look at this guy",
          camera_id: "fake_serial",
          group_id: "1",
          user_id: "4",
          comment_id: "1",
          document_location: "???"
        }
      ]);
    });
};
