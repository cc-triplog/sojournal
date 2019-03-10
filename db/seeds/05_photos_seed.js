const fs = require("fs");
let testPhoto = fs.readFileSync("./seeds/photos/bribri.jpg").toString("base64");
//console.log(testPhoto);

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("photos")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("photos").insert([
        {
          title: "Look at this guy",
          device_id: "1",
          group_id: "1",
          order_in_group: "1",
          user_id: "4",
          latitude: "35.658124669454075",
          longitude: "139.72756780246945",
          comment_id: "1"
          //document_location: testPhoto
        }
      ]);
    });
};
