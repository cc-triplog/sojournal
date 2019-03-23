const folderName = "testing";
const photoObjectArray = [];

const seedArray = [
  {
    title: "Look at Bri Bri.",
    comment:
      "He wants to pick his nose, but knows that he can't while a photo is being taken. Such restraint!",
    imageFile: "c486849c-0d03-4e6c-9cad-c0a246b1243b.jpg"
  },
  {
    title: "This is Carlos.",
    comment: "He is from Mexico, just like Salma Hayek.",
    imageFile: "3f55fc15-6023-43f6-ae3f-b9d0504159b7.jpg"
  },
  {
    title: "Here is Kei-Love.",
    comment: "He is from Japan, his Japanese is so good! Jelz!",
    imageFile: "5d59df26-bd5a-46b7-8f28-67c69b41353d.jpg"
  },
  {
    title: "The Tosh-master!",
    comment: "He doesn't speak often, but when he does it's often funny.",
    imageFile: "06c6ba40-e73d-45fb-9dd2-d2e2225371bc.jpg"
  },
  {
    title: "Krista-sensei",
    comment: "Did she throw her wedding ring away on purpose?",
    imageFile: "d1dbd7e1-171c-4760-8459-ac922d15804c.jpg"
  },
  {
    title: "Felix-sensei",
    comment: "Dark and bitter like German chocolate.",
    imageFile: "18f063ef-c2d3-41b6-af52-5a1f4bb77d2e.jpg"
  },
  {
    title: "Ian not Peein'",
    comment: "Nice guy. Engaged to Krista?",
    imageFile: "4d9ac667-5a78-48fc-8b67-d4b7ef519d59.jpg"
  },
  {
    title: "This is Omar.",
    comment: "He's from Geneva, Palestine and doesn't like to settle.",
    imageFile: "2699e7de-6dc2-43ae-a102-10e5ab44103c.jpg"
  },
  {
    title: "Be more like this guy.",
    comment: "Yuma doesn't know what chutohanpa means.",
    imageFile: "505e419c-ec06-49ae-a9ed-b3ed6875bc97.jpg"
  },
  {
    title: "This is Spazzy Chazzy.",
    comment: "Don't be like him.",
    imageFile: "b0408de5-9acc-408b-9c48-fcd6a8be8466.jpg"
  }
];

for (let i in seedArray) {
  photoObjectArray.push({
    title: seedArray[i].title,
    device_id: 1,
    group_id: 1,
    order_in_group: i,
    user_id: 4,
    latitude: 35.658124669454075 + 0.002 * i,
    longitude: 139.72756780246945 + 0.002 * i,
    comment: seedArray[i].comment,
    image_file: folderName + "/" + seedArray[i].imageFile
  });
}

for (let i in seedArray) {
  photoObjectArray.push({
    title: seedArray[i].title,
    device_id: 1,
    group_id: 1,
    order_in_group: i,
    user_id: 5,
    latitude: 35.658124669454075 + 0.002 * i,
    longitude: 139.72756780246945 + 0.002 * i,
    comment: seedArray[i].comment,
    image_file: folderName + "/" + seedArray[i].imageFile
  });
}

for (let i in seedArray) {
  photoObjectArray.push({
    title: seedArray[i].title,
    device_id: 1,
    group_id: 1,
    order_in_group: i,
    user_id: 6,
    latitude: 35.658124669454075 + 0.002 * i,
    longitude: 139.72756780246945 + 0.002 * i,
    comment: seedArray[i].comment,
    image_file: folderName + "/" + seedArray[i].imageFile
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
