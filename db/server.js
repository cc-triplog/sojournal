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
  ReadGpsPoint: (req, res) => {
    let whereObject = { user_id: currentUser };
    if (req.type.id) {
      whereObject.id = req.type.id;
    }
    return db("gps_points")
      .select(
        "id",
        "title",
        "longitude",
        "latitude",
        "group_id as groupId",
        "comment",
        "altitude",
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
        "order_in_group as orderInGroup",
        "altitude",
        "created_at as createdAt",
        "updated_at as updatedAt"
      )
      .where({ user_id: currentUser })
      .then(data => {
        return data;
      });
  },
  ReadIntervalConfig: (req, res) => {
    return db("interval_configs")
      .select(
        "id",
        "title",
        "device_id as deviceId",
        "start_method as startMethod",
        "start_time_of_day as startTimeOfDay",
        "start_epoch as startEpoch",
        "start_countdown as startCountdown",
        "stop_method as stopMethod",
        "stop_time_of_day as stopTimeOfDay",
        "stop_epoch as stopEpoch",
        "stop_count_down as stopCountDown",
        "interval",
        "created_at as createdAt",
        "updated_at as updatedAt"
      )
      .where({ user_id: currentUser })
      .then(data => {
        return data;
      });
  },
  ReadRasppiConfig: (req, res) => {
    return db("rasppi_configs").select(
      "id",
      "selected_interval as selectedInterval",
      "gps_interval as gpsInterval"
    );
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
  CreateGpsPoint: (req, res) => {
    db("gps_points").insert({
      title: req.input.title,
      longitude: req.input.longitude,
      latitude: req.input.latitude,
      group_id: req.input.groupId,
      order_in_group: req.input.orderInGroup,
      comment: req.input.comment
    });
  },
  CreateGroup: (req, res) => {
    db("groups")
      .insert({
        title: req.input.title,
        longitude: req.input.longitude,
        latitude: req.input.latitude,
        altitude: req.input.altitude,
        user_id: currentUser,
        group_id: req.input.groupId,
        order_in_group: req.input.orderInGroup
      })
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    return true;
  },
  CreateIntervalConfig: (req, res) => {
    db("create_interval_configs")
      .insert({
        title: req.input.title,
        user_id: currentUser,
        device_id: req.input.deviceId,
        start_method: req.input.startMethod,
        start_time_of_day: req.input.startTimeOfDay,
        start_epoch: req.input.startEpoch,
        start_countdown: req.input.Countdown,
        stop_method: req.input.stopMethod,
        stop_time_of_day: req.input.stopTimeOfDay,
        stop_epoch: req.input.stopEpoch,
        stop_countdown: req.input.stopCountdown,
        interval: req.input.interval,
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
  CreateRasppiConfig: (req, res) => {
    db("rasppi_configs").insert({
      selected_interval: req.input.selectedInterval,
      gps_interval: req.input.gpsInterval
    });
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
    let updateObject = { user_id: currentUser };
    if (req.input.title) {
      updateObject.title = req.input.title;
    }
    if (req.input.deviceSerial) {
      updateObject.device_serial = req.input.deviceSerial;
    }
    db("devices")
      .where({ id: req.input.id })
      .update(updateObject)
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    return true;
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
    return true;
  },
  UpdateGpsPoint: (req, res) => {
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
  },
  UpdateGroup: (req, res) => {
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
    db("groups")
      .where({ id: req.input.id })
      .update(updateObject)
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    return true;
  },
  UpdateGroup: (req, res) => {
    let updateObject = { user_id: currentUser };
    if (req.input.deviceId) {
      updateObject.device_id = req.input.deviceId;
    }
    if (req.input.startMethod) {
      updateObject.start_method = req.input.startMethod;
    }
    if (req.input.startTimeOfDay) {
      updateObject.start_time_of_day = req.input.startTimeOfDay;
    }
    if (req.input.startEpoch) {
      updateObject.start_epoch = req.input.startEpoch;
    }
    if (req.input.startCoundown) {
      updateObject.start_countdown = req.input.startCoundown;
    }
    if (req.input.stopMethod) {
      updateObject.stop_method = req.input.stopMethod;
    }
    if (req.input.stopTimeOfDay) {
      updateObject.stop_time_of_day = req.input.stopTimeOfDay;
    }
    if (req.input.stopEpoch) {
      updateObject.stop_epoch = req.input.stopEpoch;
    }
    if (req.input.stopCountdown) {
      updateObject.stop_countdown = req.input.stopCountdown;
    }
    if (req.input.interval) {
      updateObject.interval = req.input.interval;
    }
    db("groups")
      .where({ id: req.input.id })
      .update(updateObject)
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    return true;
  },
  UpdateRasppiConfig: (req, res) => {
    let updateObject = { user_id: currentUser };
    if (req.input.selectedInterval) {
      updateObject.selected_interval = req.input.selectedInterval;
    }
    if (req.input.gpsInterval) {
      updateObject.gps_interval = req.input.gpsInterval;
    }
    db("rasppi_configs")
      .where({ id: req.input.id })
      .update(updateObject)
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    return true;
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
  DestroyGpsPoint: (req, res) => {
    db("gps_points")
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
  },
  DestroyIntervalConfig: (req, res) => {
    db("log_interval_configs")
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
  DestroyRasppiConfig: (req, res) => {
    db("rasppi_configs")
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
