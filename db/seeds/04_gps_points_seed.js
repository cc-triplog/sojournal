exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("gps_points")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("gps_points").insert([
        {
          title: "Where I lost my wallet.",
          user_id: "4",
          latitude: "35.858124669454075",
          longitude: "139.82756780246945",
          comment: "It was never found."
        },
        {
          title: "This is where a tanuki bit me.",
          user_id: "4",
          latitude: "35.958124669454075",
          longitude: "139.92756780246945",
          comment: "The infection is growing and is very colorful."
        }
      ]);
    });
};
