exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("devices")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("devices").insert([
        {
          title: "Keisuke's FrankenCam",
          device_serial: "0000000076a55e56",
          user_id: "5"
        },
        {
          title: "Alien's iPhone",
          device_serial: "fake_serial_1",
          user_id: "1"
        },
        {
          title: "Zombie's Android",
          device_serial: "fake_serial_2",
          user_id: "2"
        },
        {
          title: "Chaz's iPhone",
          device_serial: "fake_serial_4",
          user_id: "4"
        },
        {
          title: "Poop Head's Fake Cam",
          device_serial: "fake_serial_3",
          user_id: "3"
        }
      ]);
    });
};
