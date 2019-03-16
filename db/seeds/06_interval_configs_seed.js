exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("interval_configs")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("interval_configs").insert([
        {
          user_id: "4",
          start_method: "startTimeOfDay",
          start_time_of_day: 60,
          stop_method: "startTimeOfDay",
          stop_time_of_day: 120,
          interval: 1
        },
        {
          user_id: "4",
          start_method: "startButton",
          stop_method: "stopButton",
          interval: 2
        },
        {
          user_id: "4",
          start_method: "startCountDown",
          start_countdown: 10,
          stop_method: "stopCountDown",
          stop_countdown: 30,
          interval: 3
        },
        {
          user_id: "4",
          start_method: "startButton",
          stop_method: "stopCountDown",
          stop_countdown: 30,
          interval: 5
        }
      ]);
    });
};
