exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("devices")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("devices").insert([
        {
          title: "Not a Device",
          device_serial: "fake_serial",
          user_id: "4"
        },
        {
          title: "Keisuke's Raspberry Pi",
          device_serial: "0000000076a55e56",
          user_id: "4"
        }
      ]);
    });
};
