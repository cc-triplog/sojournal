const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

// GraphQL schema
let schema = buildSchema(`
    type User {
        id: Int
        name: String
        email: String
    }
    type Device {
        id: Int
        deviceSerial: String
        userId: Int
    }
    type Photo {
        id: Int
        title: String
        longitude: String
        latitude: String
        deviceId: Int
        groupId: Int
        orderInGroup: Int
        userId: Int
        commentId: Int
        documentLocation: String
    }
    type Comment {
        id: Int
        title: String
        longitude: String
        latitude: String
        groupId: Int
        orderInGroup: Int
        userId: Int
    }
    type Group {
        id: Int
        title: String
        longitude: String
        latitude: String
        groupId: Int
        userId: Int
    }
    input InputUser {
      name: String!
      email: String
      password: String
    }
    input InputDevice {
      deviceSerial: String
      userId: Int!
    }
    input InputPhoto {
      title: String
      longitude: String
      latitude: String
      deviceId: Int
      groupId: Int
      orderInGroup: Int
      userId: Int!
      commentId: Int
      documentLocation: String
    }
    input InputComment {
      title: String
      longitude: String
      latitude: String
      groupId: Int
      orderInGroup: Int
      userId: Int!
    }
    input InputGroup {
      title: String
      longitude: String
      latitude: String
      groupId: Int
      userId: Int!
    }
    type Query {
        Users: [User]
        Devices: [Device]
        Photos: [Photo]
        Comments: [Comment]
        Groups: [Group]
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
  message: () => "Hello World!"
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
app.listen(4000, () =>
  console.log("Express GraphQL Server Now Running On localhost:4000/graphql")
);
