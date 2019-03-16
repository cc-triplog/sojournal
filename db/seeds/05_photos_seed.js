const bucketName = "magellansmiles";
const folderName = "testing";
const photoObjectArray = [];

const seedArray = [
  {
    title: "Look at Bri Bri.",
    comment:
      "He wants to pick his nose, but knows that he can't while a photo is being taken. Such restraint!",
    imageFile: "e9bb842a-0489-4169-bcb8-38e68be163d9"
  },
  {
    title: "This is Carlos.",
    comment: "He is from Mexico, just like Salma Hayek.",
    imageFile: "a3d26387-095a-4690-bfd9-d359b96bed22"
  },
  {
    title: "Here is Kei-Love.",
    comment: "He is from Japan, his Japanese is so good! Jelz!",
    imageFile: "5421d8ab-e61c-4150-9ca6-0594b5348ca1"
  },
  {
    title: "The Tosh-master!",
    comment: "He doesn't speak often, but when he does it's often funny.",
    imageFile: "a08ce0bf-0ea1-4e9d-bb48-56dff0970a78"
  },
  {
    title: "Krista-sensei",
    comment: "Did she throw her wedding ring away on purpose?",
    imageFile: "7598a060-ea5f-4397-bde1-8f8fdd4dff55"
  },
  {
    title: "Felix-sensei",
    comment: "Dark and bitter like German chocolate.",
    imageFile: "2dc359ea-c276-410f-93c3-5d38e0344ddd"
  },
  {
    title: "Ian not Peein'",
    comment: "Nice guy. Engaged to Krista?",
    imageFile: "53c01ef6-d579-4c5e-b250-c974890a3947"
  },
  {
    title: "This is Omar.",
    comment: "He's from Palestine and doesn't like to settle.",
    imageFile: "934d18b1-fd07-4bc5-a225-191e4df75f41"
  },
  {
    title: "Be more like this guy.",
    comment: "Yuma doesn't know what chutohanpa means.",
    imageFile: "ddb0f41c-8200-406e-bf97-22aaf300e0b5"
  },
  {
    title: "This is Spazzy Chazzy.",
    comment: "Don't be like him.",
    imageFile: "281cac6d-5a64-4ced-8de7-9f6645b59526"
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
    image_file: bucketName + "/" + folderName + "/" + seedArray[i].imageFile
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
