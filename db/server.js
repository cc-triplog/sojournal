const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const config = require("./knexfile");
const db = require("knex")(config);

const currentUser = 4;

// GraphQL schema
let schema = buildSchema(`
    type User {
        id: Int
        name: String
        email: String
        createdAt: Int
        updatedAt: Int
    }
    type Device {
        id: Int
        title: String
        deviceSerial: String
        createdAt: Int
        updatedAt: Int
    }
    type Photo {
        id: Int
        title: String
        longitude: Float
        latitude: Float
        deviceId: Int
        groupId: Int
        orderInGroup: Int
        comment: String
        documentLocation: String
        altitude: Float
        bearing: Float
        createdAt: Int
        updatedAt: Int
    }
    type Comment {
        id: Int
        title: String
        longitude: Float
        latitude: Float
        groupId: Int
        orderInGroup: Int
        createdAt: Int
        updatedAt: Int
    }
    type Group {
        id: Int
        title: String
        longitude: Float
        latitude: Float
        groupId: Int
        createdAt: Int
        updatedAt: Int
    }
    input InputUser {
      id: Int
      name: String
      email: String
      password: String
      createdAt: Int
      updatedAt: Int
    }
    input InputDevice {
      id: Int
      title: String
      deviceSerial: String
      createdAt: Int
      updatedAt: Int
    }
    input InputPhoto {
      id: Int
      title: String
      longitude: Float
      latitude: Float
      deviceId: Int
      groupId: Int
      orderInGroup: Int
      comment: String
      documentLocation: String
      altitude: Float
      bearing: Float
      createdAt: Int
      updatedAt: Int
    }
    input InputComment {
      id: Int
      title: String
      longitude: Float
      latitude: Float
      groupId: Int
      orderInGroup: Int
      createdAt: Int
      updatedAt: Int
    }
    input InputGroup {
      id: Int
      title: String
      longitude: Float
      latitude: Float
      groupId: Int
      createdAt: Int
      updatedAt: Int
    }

    input UpdateUser {
      id: Int!
      name: String
      email: String
      password: String
      createdAt: Int
      updatedAt: Int
    }
    input UpdateDevice {
      id: Int!
      title: String
      deviceSerial: String
      createdAt: Int
      updatedAt: Int
    }
    input UpdatePhoto {
      id: Int!
      title: String
      longitude: Float
      latitude: Float
      deviceId: Int
      groupId: Int
      orderInGroup: Int
      comment: String
      documentLocation: String
      altitude: Float
      bearing: Float
      createdAt: Int
      updatedAt: Int
    }
    input UpdateComment {
      id: Int!
      title: String
      longitude: Float
      latitude: Float
      groupId: Int
      orderInGroup: Int
      createdAt: Int
      updatedAt: Int
    }
    input UpdateGroup {
      id: Int!
      title: String
      longitude: Float
      latitude: Float
      groupId: Int
      createdAt: Int
      updatedAt: Int
    }

    input DestroyUser {
      id: Int!
    }
    input DestroyDevice {
      id: Int!
    }
    input DestroyPhoto {
      id: Int!
    }
    input DestroyComment {
      id: Int!
    }
    input DestroyGroup {
      id: Int!
    }

    type Query {
        ReadUser(type: InputUser): [User]
        ReadDevice(type: InputDevice): [Device]
        ReadPhoto(type: InputPhoto): [Photo]
        ReadComment(type: InputComment): [Comment]
        ReadGroup(type: InputGroup): [Group]
    }

    type Mutation {
        CreateUser(input: InputUser): Boolean
        CreateDevice(input: InputDevice): Boolean
        CreatePhoto(input: InputPhoto): Boolean
        CreateComment(input: InputComment): Boolean
        CreateGroup(input: InputGroup): Boolean
        UpdateUser(input: UpdateUser): User
        UpdateDevice(input: UpdateDevice): Device
        UpdatePhoto(input: UpdatePhoto): Photo
        UpdateComment(input: UpdateComment): Comment
        UpdateGroup(input: UpdateGroup): Group
        DestroyUser(input: DestroyUser): Boolean
        DestroyDevice(input: DestroyDevice): Boolean
        DestroyPhoto(input: DestroyPhoto): Boolean
        DestroyComment(input: DestroyComment): Boolean
        DestroyGroup(input: DestroyGroup): Boolean
    }
`);

let result;

// Root resolver
let root = {
  // READ
  ReadUser: (req, res) => {
    return db("users")
      .select(
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
    return db("devices")
      .select(
        "title",
        "device_serial as deviceSerial",
        "user_id as userId",
        "created_at as createdAt",
        "updated_at as updatedAt"
      )
      .where({ user_id: currentUser })
      .then(data => {
        return data;
      });
  },
  ReadPhoto: (req, res) => {
    return db("photos")
      .select(
        "title",
        "longitude",
        "latitude",
        "device_id as deviceId",
        "group_id as groupId",
        "user_id as userId",
        "comment",
        "document_location as documentLocation",
        "altitude",
        "bearing",
        "created_at as createdAt",
        "updated_at as updatedAt"
      )
      .where({ user_id: currentUser })
      .then(data => {
        return data;
      });
  },
  ReadComment: (req, res) => {
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
      .where({ user_id: currentUser })
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
      document_location: req.input.documentLocation,
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
