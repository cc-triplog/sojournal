const fs = require("fs");
let photoList = fs.readdirSync("./seeds/photos/", (err, data) => {
  if (err) {
    throw err;
  }
  return data;
});

let photoObjectArray = [];

for (let i in photoList) {
  let photo = fs
    .readFileSync("./seeds/photos/" + photoList[i])
    .toString("base64");
  photoObjectArray.push({
    title: "Test: Look at " + photoList[i] + "!",
    device_id: 1,
    group_id: 1,
    order_in_group: i,
    user_id: 4,
    latitude: 35.658124669454075 + 0.001 * i,
    longitude: 139.72756780246945 + 0.001 * i,
    comment:
      "This is test photo " +
      (Number(i) + 1) +
      ".<br>The file name is " +
      photoList[i],
    document_location: photo
  });
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("photos")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("photos").insert(photoObjectArray);
    });
};
