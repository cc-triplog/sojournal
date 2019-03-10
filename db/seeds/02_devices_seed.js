exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("devices")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("devices").insert([
        {
          title: "Chazzy",
          device_serial: "fake_serial",
          user_id: "4"
        }
      ]);
    });
};
