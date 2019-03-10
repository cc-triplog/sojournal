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
    }
    type Device {
        id: Int
        title: String
        deviceSerial: String
    }
    type Photo {
        id: Int
        title: String
        longitude: Float
        latitude: Float
        deviceId: Int
        groupId: Int
        orderInGroup: Int
        commentId: Int
        documentLocation: String
    }
    type Comment {
        id: Int
        title: String
        longitude: Float
        latitude: Float
        groupId: Int
        orderInGroup: Int
    }
    type Group {
        id: Int
        title: String
        longitude: Float
        latitude: Float
        groupId: Int
    }
    input InputUser {
      id: Int
      name: String
      email: String
      password: String
    }
    input InputDevice {
      id: Int
      title: String
      deviceSerial: String
    }
    input InputPhoto {
      id: Int
      title: String
      longitude: Float
      latitude: Float
      deviceId: Int
      groupId: Int
      orderInGroup: Int
      commentId: Int
      documentLocation: String
    }
    input InputComment {
      id: Int
      title: String
      longitude: Float
      latitude: Float
      groupId: Int
      orderInGroup: Int
    }
    input InputGroup {
      id: Int
      title: String
      longitude: Float
      latitude: Float
      groupId: Int
    }
    type Query {
        ReadUser(type: InputUser): [User]
        ReadDevice(type: InputDevice): [Device]
        ReadPhoto(type: InputPhoto): [Photo]
        ReadComment(type: InputComment): [Comment]
        ReadGroup(type: InputGroup): [Group]
    }
    type Mutation {
        CreateUser(input: InputUser): User
        CreateDevice(input: InputDevice): Device
        CreatePhoto(input: InputPhoto): Photo
        CreateComment(input: InputComment): Comment
        CreateGroup(input: InputGroup): Group
        UpdateUser(input: InputUser): User
        UpdateDevice(input: InputDevice): Device
        UpdatePhoto(input: InputPhoto): Photo
        UpdateComment(input: InputComment): Comment
        UpdateGroup(input: InputGroup): Group
        DestroyUser(input: InputUser): Boolean
        DestroyDevice(input: InputDevice): Boolean
        DestroyPhoto(input: InputPhoto): Boolean
        DestroyComment(input: InputComment): Boolean
        DestroyGroup(input: InputGroup): Boolean
    }
`);

// Root resolver
let root = {
  ReadUser: (req, res) => {
    //let key = req.type.name || req.type.email;
    return db("users")
      .select()
      .where({ id: currentUser })
      .then(data => {
        return data;
      });
  },
  ReadDevice: (req, res) => {
    return db("devices")
      .select()
      .where({ user_id: currentUser })
      .then(data => {
        return data;
      });
  },
  ReadPhoto: (req, res) => {
    return db("photos")
      .select()
      .where({ user_id: currentUser })
      .then(data => {
        return data;
      });
  },
  ReadComment: (req, res) => {
    return db("comments")
      .select()
      .where({ user_id: currentUser })
      .then(data => {
        return data;
      });
  },
  ReadGroup: (req, res) => {
    return db("groups")
      .select()
      .where({ user_id: currentUser })
      .then(data => {
        return data;
      });
  },
  CreateUser: (req, res) => {
    const newUser = req.input;
    db("users")
      .insert({
        name: req.input.name,
        email: req.input.email,
        password: "fake"
      })
      .then(function(result) {
        console.log(result);
      });
    return newUser;
  },
  CreateDevice: (req, res) => {
    const newDevice = req.input;
    db("devices")
      .insert({
        title: "fake device",
        device_serial: req.input.deviceSerial,
        user_id: currentUser
      })
      .then(function(result) {
        console.log(result);
      });
    return newDevice;
  },
  CreatePhoto: (req, res) => {
    const newPhoto = req.input;
    db("photos")
      .insert({
        title: req.input.title,
        longitude: req.input.longitude,
        latitude: req.input.latitude,
        device_id: "1",
        group_id: req.input.groupId,
        order_in_group: req.input.orderInGroup,
        user_id: currentUser,
        comment_id: req.input.commentId,
        document_location: "fake"
      })
      .then(function(result) {
        console.log(result);
      });
    return newPhoto;
  },
  CreateGroup: (req, res) => {
    const newGroup = req.input;
    db("groups")
      .insert({
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
    return newGroup;
  }
};

// Create an express server and a groupsgroupsgroupsgroupsgroupsgroupsgroupsgroupsGraphQL endpoint
let app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);
app.listen(4000, () =>
  console.log("Express GraphQL Server Now Running On localhost:4000/graphql")
);
