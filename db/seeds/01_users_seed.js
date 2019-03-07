exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        {
          name: "Bri Bri",
          email: "llbribri@naver.co.ko",
          password: "gullible"
        },
        {
          name: "Omarlicious",
          email: "unoccupied@palestine.com",
          password: "bumblebee"
        },
        {
          name: "Kei Love",
          email: "Iliketo@yahoo.co.jp",
          password: "brokencamera"
        },
        {
          name: "Chaz Spazism",
          email: "IllSpazYou@gmail.com",
          password: "spazzy"
        }
      ]);
    });
};
