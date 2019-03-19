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
          latitude: 35.658124669454075 - 0.002,
          longitude: 139.72756780246945 - 0.002,
          comment: "It was never found."
        },
        {
          title: "This is where a tanuki bit me.",
          user_id: "4",
          latitude: 35.658124669454075 - 0.004,
          longitude: 139.72756780246945 - 0.004,
          comment: "The infection is growing and is very colorful."
        }
      ]);
    });
};
