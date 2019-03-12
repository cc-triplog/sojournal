// try {
//   const result = require("dotenv").config();
// } catch (err) {
//   console.log("have you thought about using an env file?");
// }

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
        "id",
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
        "id",
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
        "id",
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
        "id",
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
    db("users")
      .insert({
        name: req.input.name,
        email: req.input.email,
        password: "fake"
      })
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    return true;
  },
  CreateDevice: (req, res) => {
    db("devices")
      .insert({
        title: req.input.title,
        device_serial: req.input.deviceSerial,
        user_id: currentUser
      })
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    return true;
  },
  CreatePhoto: (req, res) => {
    db("photos")
      .insert({
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
      })
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    return true;
  },
  UpdateGroup: (req, res) => {
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
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
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
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
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
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    return updatedDevice;
  },
  UpdatePhoto: (req, res) => {
    let updateObject = { user_id: currentUser };
    if (req.input.title) {
      updateObject.title = req.input.title;
    }
    if (req.input.longitude) {
      updateObject.longitude = req.input.longitude;
    }
    if (req.input.latitude) {
      updateObject.latitude = req.input.latitude;
    }
    if (req.input.groupId) {
      updateObject.group_id = req.input.groupId;
    }
    if (req.input.orderInGroup) {
      updateObject.order_in_group = req.input.orderInGroup;
    }
    if (req.input.comment) {
      updateObject.comment = req.input.comment;
    }
    if (req.input.altitude) {
      updateObject.altitude = req.input.altitude;
    }
    if (req.input.bearing) {
      updateObject.bearing = req.input.bearing;
    }
    db("photos")
      .where({ id: req.input.id })
      .update(updateObject)
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
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
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    return updatedGroup;
  },
  //DESTROY
  DestroyUser: (req, res) => {
    db("users")
      .where({ id: req.input.id })
      .del()
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    return true;
  },
  DestroyDevice: (req, res) => {
    db("devices")
      .where({ id: req.input.id, user_id: currentUser })
      .del()
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    return true;
  },
  DestroyPhoto: (req, res) => {
    db("photos")
      .where({ id: req.input.id, user_id: currentUser })
      .del()
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    return true;
  },
  DestroyGroup: (req, res) => {
    db("groups")
      .where({ id: req.input.id, user_id: currentUser })
      .del()
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    return true;
  }
};

// Create an express server and a GraphQL endpoint
let app = express();
app.use(morgan("common"));
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
