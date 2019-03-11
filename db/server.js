const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const morgan = require("morgan");
const config = require("./knexfile");
const db = require("knex")(config);
const schemas = require("./schema");

// Current User Needs to be replaced with login
const currentUser = 4;

// GraphQL schema
let schema = buildSchema(schemas);

// Root resolver
let root = {
  // READ
  ReadUser: (req, res) => {
    return db("users")
      .select(
        "id",
        "name",
        "email",
        "created_at as createdAt",
        "updated_at as updatedAt"
      )
      .where({ id: req.type.id })
      .then(data => {
        return data;
      });
  },
  ReadDevice: (req, res) => {
    let whereObject = { user_id: currentUser };
    if (req.type.id) {
      whereObject.id = req.type.id;
    }
    return db("devices")
      .select(
        "title",
        "device_serial as deviceSerial",
        "user_id as userId",
        "created_at as createdAt",
        "updated_at as updatedAt"
      )
      .where(whereObject)
      .then(data => {
        return data;
      });
  },
  ReadPhoto: (req, res) => {
    let whereObject = { user_id: currentUser };
    if (req.type.id) {
      whereObject.id = req.type.id;
    }
    return db("photos")
      .select(
        "title",
        "longitude",
        "latitude",
        "device_id as deviceId",
        "group_id as groupId",
        "user_id as userId",
        "comment",
        "image_file as imageFile",
        "altitude",
        "bearing",
        "created_at as createdAt",
        "updated_at as updatedAt"
      )
      .where(whereObject)
      .then(data => {
        return data;
      });
  },
  ReadComment: (req, res) => {
    let whereObject = { user_id: currentUser };
    if (req.type.id) {
      whereObject.id = req.type.id;
    }
    return db("comments")
      .select(
        "title",
        "longitude",
        "latitude",
        "group_id as groupId",
        "user_id as userId",
        "created_at as createdAt",
        "updated_at as updatedAt"
      )
      .where(whereObject)
      .then(data => {
        return data;
      });
  },
  ReadGroup: (req, res) => {
    return db("groups")
      .select(
        "title",
        "longitude",
        "latitude",
        "group_id as groupId",
        "user_id as userId",
        "created_at as createdAt",
        "updated_at as updatedAt"
      )
      .where({ user_id: currentUser })
      .then(data => {
        return data;
      });
  },
  // CREATE
  CreateUser: (req, res) => {
    db("users").insert({
      name: req.input.name,
      email: req.input.email,
      password: "fake"
    });
    return true;
  },
  CreateDevice: (req, res) => {
    db("devices").insert({
      title: req.input.title,
      device_serial: req.input.deviceSerial,
      user_id: currentUser
    });
    return true;
  },
  CreatePhoto: (req, res) => {
    db("photos").insert({
      title: req.input.title,
      longitude: req.input.longitude,
      latitude: req.input.latitude,
      device_id: req.input.deviceId,
      group_id: req.input.groupId,
      order_in_group: req.input.orderInGroup,
      user_id: currentUser,
      comment: req.input.comment,
      image_file: req.input.imageFile,
      altitude: req.input.altitude,
      bearing: req.input.bearing
    });
    return true;
  },
  UpdateGroup: (req, res) => {
    db("groups").insert({
      title: req.input.title,
      longitude: req.input.longitude,
      latitude: req.input.latitude,
      user_id: currentUser,
      group_id: req.input.groupId,
      order_in_group: req.input.orderInGroup,
      user_id: currentUser
    });
    return true;
  },
  // UPDATE - not working
  UpdateUser: (req, res) => {
    const updatedUser = req.input;
    db("users")
      .update({
        name: req.input.name,
        email: req.input.email,
        password: "fake"
      })
      .then(function(result) {
        console.log(result);
      });
    return updatedUser;
  },
  UpdateDevice: (req, res) => {
    const updatedDevice = req.input;
    db("devices")
      .update({
        title: "fake device",
        device_serial: req.input.deviceSerial,
        user_id: currentUser
      })
      .then(function(result) {
        console.log(result);
      });
    return updatedDevice;
  },
  UpdatePhoto: (req, res) => {
    const updatedPhoto = req.input;
    db("photos")
      .update({
        title: req.input.title,
        longitude: req.input.longitude,
        latitude: req.input.latitude,
        device_id: "1",
        group_id: req.input.groupId,
        order_in_group: req.input.orderInGroup,
        user_id: currentUser,
        comment: req.input.comment,
        altitude: req.input.altitude,
        bearing: req.input.bearing
      })
      .then(function(result) {
        console.log(result);
      });
    return updatedPhoto;
  },
  UpdateGroup: (req, res) => {
    const updatedGroup = req.input;
    db("groups")
      .update({
        title: req.input.title,
        longitude: req.input.longitude,
        latitude: req.input.latitude,
        user_id: currentUser,
        group_id: req.input.groupId,
        order_in_group: req.input.orderInGroup,
        user_id: currentUser
      })
      .then(function(result) {
        console.log(result);
      });
    return updatedGroup;
  },
  //DESTROY
  DestroyUser: (req, res) => {
    db("users")
      .where({ id: req.input.id })
      .del()
      .then(function(result) {
        console.log(result);
      });
    return true;
  },
  DestroyDevice: (req, res) => {
    db("devices")
      .where({ id: req.input.id, user_id: currentUser })
      .del()
      .then(function(result) {
        console.log(result);
      });
    return true;
  },
  DestroyPhoto: (req, res) => {
    db("photos")
      .where({ id: req.input.id, user_id: currentUser })
      .del()
      .then(function(result) {
        console.log(result);
      });
    return true;
  },
  DestroyGroup: (req, res) => {
    db("groups")
      .where({ id: req.input.id, user_id: currentUser })
      .del()
      .then(function(result) {
        console.log(result);
      });
    return true;
  }
};

// Create an express server and a GraphQL endpoint
let app = express();
app.use(morgan("tiny"));
app.use(express.json({ extended: true, limit: "100mb" }));
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);
app.listen(process.env.DB_PORT || 4000, () =>
  console.log("Express GraphQL Server Now Running On localhost:4000/graphql")
);
