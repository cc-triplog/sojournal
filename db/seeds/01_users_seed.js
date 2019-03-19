exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        {
          name: "Brian",
          cognito_id: "1"
        },
        {
          name: "Omar",
          cognito_id: "2"
        },
        {
          name: "Keisuke",
          cognito_id: "3"
        },
        {
          name: "Chaz",
          cognito_id: "4"
        }
      ]);
    });
};
