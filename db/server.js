const AWS = require("aws-sdk");
AWS.config.loadFromPath("./.env.json");

//var CognitoStrategy = require("passport-cognito");

const uuid = require("uuid");
const bucketName = "sojournal";
const sharp = require("sharp");

const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const morgan = require("morgan");
const config = require("./knexfile");
const db = require("knex")(config);
//const axios = require("axios");
const schemas = require("./schema");

// Current User Needs to be replaced with login
let currentUser = 4;

// Image Hosting Server
const imageLocation = "s3-ap-northeast-1.amazonaws.com/sojournal/";

// GraphQL schema
let schema = buildSchema(schemas);

// Root resolver
let root = {
  // PHOTO AND GPS BY DATE RANGE
  GetPhotoByDate: (req, res) => {
    let whereObject = {
      user_id: currentUser
    };
    // Temporary Multiuser - INSECURE
    if (req.type.userId) {
      whereObject.user_id = req.type.userId;
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
      .where("created_at", ">=", req.type.startTime)
      .where("created_at", "<=", req.type.endTime)
      .then(data => {
        for (let i in data) {
          data[i].imageFile = imageLocation + data[i].imageFile;
        }
        return data;
      });
  },
  GetGpsByDate: (req, res) => {
    let whereObject = {
      user_id: currentUser
    };
    // Temporary Multiuser - INSECURE
    if (req.type.userId) {
      whereObject.user_id = req.type.userId;
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
      .where("created_at", ">=", req.type.startTime)
      .where("created_at", "<=", req.type.endTime)
      .then(data => {
        return data;
      });
  },
  // READ
  ReadUser: (req, res) => {
    let whereObject = { cognito_id: req.type.cognitoId };
    return db("users")
      .select(
        "id",
        "name",
        "cognito_id as cognitoId",
        "created_at as createdAt",
        "updated_at as updatedAt"
      )
      .where(whereObject)
      .then(data => {
        return data;
      });
  },
  ReadDevice: (req, res) => {
    let whereObject = { user_id: currentUser };
    if (req.type.id) {
      whereObject.id = req.type.id;
    }
    // Temporary Multiuser - INSECURE
    if (req.type.userId) {
      whereObject.user_id = req.type.userId;
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
    // Temporary Multiuser - INSECURE
    if (req.type.userId) {
      whereObject.user_id = req.type.userId;
    }
    return db("photos")
      .select(
        "id",
        "title",
        "longitude",
        "latitude",
        "user_id as userId",
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
      .orderBy("created_at", "desc")
      .then(data => {
        for (let i in data) {
          data[i].imageFile = imageLocation + data[i].imageFile;
        }
        return data;
      });
  },
  ReadGpsPoint: (req, res) => {
    let whereObject = { user_id: currentUser };
    if (req.type.id) {
      whereObject.id = req.type.id;
    }
    // Temporary Multiuser - INSECURE
    if (req.type.userId) {
      whereObject.user_id = req.type.userId;
    }
    return db("gps_points")
      .select(
        "id",
        "title",
        "longitude",
        "latitude",
        "user_id as userId",
        "group_id as groupId",
        "comment",
        "altitude",
        "created_at as createdAt",
        "updated_at as updatedAt"
      )
      .where(whereObject)
      .orderBy("created_at", "desc")
      .then(data => {
        return data;
      });
  },
  ReadGroup: (req, res) => {
    let whereObject = { user_id: currentUser };
    if (req.type.id) {
      whereObject.id = req.type.id;
    }
    // Temporary Multiuser - INSECURE
    if (req.type.userId) {
      whereObject.user_id = req.type.userId;
    }
    return db("groups")
      .select(
        "id",
        "title",
        "comment",
        "longitude",
        "latitude",
        "start_time as startTime",
        "end_time as endTime",
        "group_id as groupId",
        "order_in_group as orderInGroup",
        "altitude",
        "created_at as createdAt",
        "updated_at as updatedAt"
      )
      .where(whereObject)
      .orderBy("start_time", "desc")
      .then(data => {
        return data;
      });
  },
  ReadIntervalConfig: (req, res) => {
    let whereObject = { user_id: currentUser };
    if (req.type.id) {
      whereObject.id = req.type.id;
    }
    // Temporary Multiuser - INSECURE
    if (req.type.userId) {
      whereObject.user_id = req.type.userId;
    }
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
        "stop_countdown as stopCountdown",
        "interval",
        "created_at as createdAt",
        "updated_at as updatedAt"
      )
      .where(whereObject)
      .then(data => {
        return data;
      });
  },
  ReadRasppiConfig: (req, res) => {
    let whereObject = { user_id: currentUser };
    if (req.type.id) {
      whereObject.id = req.type.id;
    }
    // Temporary Multiuser - INSECURE
    if (req.type.userId) {
      whereObject.user_id = req.type.userId;
    }
    return db("rasppi_configs")
      .select(
        "id",
        "selected_interval as selectedInterval",
        "gps_interval as gpsInterval"
      )
      .where(whereObject)
      .then(data => {
        return data;
      });
  },
  // CREATE
  CreateUser: (req, res) => {
    db("users")
      .insert({
        name: req.input.name,
        cognito_id: req.input.cognitoId,
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
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
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
    currentUser = 4;
    return true;
  },
  CreatePhoto: (req, res) => {
    // Temporary Multiuser - INSECURE
    let uuidNumber = uuid.v4();
    const keyName = currentUser + "/" + uuidNumber + "-full.jpg";
    const midKeyName = currentUser + "/" + uuidNumber + "-mid.jpg";
    const thumbKeyName = currentUser + "/" + uuidNumber + ".jpg";
    if (req.input.userId) {
      currentUser = req.input.userId;
    }

    let objectParams = {
      Bucket: bucketName,
      Key: keyName,
      ContentType: "image/jpeg",
      Body: Buffer.from(req.input.imageFile, "base64")
    };
    let uploadPromise = new AWS.S3({ apiVersion: "2006-03-01" })
      .putObject(objectParams)
      .promise();
    uploadPromise
      .then(function(data) {
        console.log("Successfully uploaded" + bucketName + "/" + keyName);
      })
      .catch(function(err) {
        console.error(err, err.stack);
      });
    // UPLOAD THUMB
    sharp(Buffer.from(req.input.imageFile, "base64"))
      .rotate()
      .resize(200, 200, {
        fit: "outside"
      })
      .toBuffer()
      .then(data => {
        let objectThumbParams = {
          Bucket: bucketName,
          Key: thumbKeyName,
          ContentType: "image/jpeg",
          Body: data
        };
        uploadPromise = new AWS.S3({ apiVersion: "2006-03-01" })
          .putObject(objectThumbParams)
          .promise();
        uploadPromise
          .then(function(data) {
            console.log(
              "Successfully uploaded" + bucketName + "/" + thumbKeyName
            );
          })
          .catch(function(err) {
            console.error(err, err.stack);
          });
      });
    // UPLOAD thumbKeyNameMID
    sharp(Buffer.from(req.input.imageFile, "base64"))
      .rotate()
      .resize(800, 800, {
        fit: "outside"
      })
      .toBuffer()
      .then(data => {
        let objectMidParams = {
          Bucket: bucketName,
          Key: midKeyName,
          ContentType: "image/jpeg",
          Body: data
        };
        uploadPromise = new AWS.S3({ apiVersion: "2006-03-01" })
          .putObject(objectMidParams)
          .promise();
        uploadPromise
          .then(function(data) {
            console.log(
              "Successfully uploaded" + bucketName + "/" + midKeyName
            );
          })
          .catch(function(err) {
            console.error(err, err.stack);
          });
      });
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
        image_file: thumbKeyName,
        altitude: req.input.altitude,
        bearing: req.input.bearing,
        created_at: Number(req.input.createdAt)
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    // Temporary
    currentUser = 4;
    return true;
  },
  CamCreatePhoto: async (req, res) => {
    let currentUser = await db("devices")
      .select("user_id as userId")
      .where({ device_serial: req.input.deviceSerial })
      .then(data => {
        if (data.length != 0) {
          return data[0].userId;
        }
      })
      .catch(err => console.log(err));

    // Temporary Multiuser - INSECURE
    let uuidNumber = uuid.v4();
    const keyName = currentUser + "/" + uuidNumber + "-full.jpg";
    const midKeyName = currentUser + "/" + uuidNumber + "-mid.jpg";
    const thumbKeyName = currentUser + "/" + uuidNumber + ".jpg";

    let objectParams = {
      Bucket: bucketName,
      Key: keyName,
      ContentType: "image/jpeg",
      Body: Buffer.from(req.input.imageFile, "base64")
    };
    let uploadPromise = new AWS.S3({ apiVersion: "2006-03-01" })
      .putObject(objectParams)
      .promise();
    uploadPromise
      .then(function(data) {
        console.log("Successfully uploaded" + bucketName + "/" + keyName);
      })
      .catch(function(err) {
        console.error(err, err.stack);
      });
    // UPLOAD THUMB
    sharp(Buffer.from(req.input.imageFile, "base64"))
      .rotate()
      .resize(200, 200, {
        fit: "outside"
      })
      .toBuffer()
      .then(data => {
        let objectThumbParams = {
          Bucket: bucketName,
          Key: thumbKeyName,
          ContentType: "image/jpeg",
          Body: data
        };
        uploadPromise = new AWS.S3({ apiVersion: "2006-03-01" })
          .putObject(objectThumbParams)
          .promise();
        uploadPromise
          .then(function(data) {
            console.log(
              "Successfully uploaded" + bucketName + "/" + thumbKeyName
            );
          })
          .catch(function(err) {
            console.error(err, err.stack);
          });
      });
    // UPLOAD thumbKeyNameMID
    sharp(Buffer.from(req.input.imageFile, "base64"))
      .rotate()
      .resize(800, 800, {
        fit: "outside"
      })
      .toBuffer()
      .then(data => {
        let objectMidParams = {
          Bucket: bucketName,
          Key: midKeyName,
          ContentType: "image/jpeg",
          Body: data
        };
        uploadPromise = new AWS.S3({ apiVersion: "2006-03-01" })
          .putObject(objectMidParams)
          .promise();
        uploadPromise
          .then(function(data) {
            console.log(
              "Successfully uploaded" + bucketName + "/" + midKeyName
            );
          })
          .catch(function(err) {
            console.error(err, err.stack);
          });
      });

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
        image_file: thumbKeyName,
        altitude: req.input.altitude,
        bearing: req.input.bearing,
        created_at: req.input.createdAt
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    // Temporary
    currentUser = 4;
    return true;
  },
  CamCreateGps: async (req, res) => {
    let currentUser = await db("devices")
      .select("user_id as userId")
      .where({ device_serial: req.input.deviceSerial })
      .then(data => {
        if (data.length != 0) {
          return data[0].userId;
        }
      })
      .catch(err => console.log(err));

    db("gps_points")
      .insert({
        longitude: req.input.longitude,
        latitude: req.input.latitude,
        user_id: currentUser
      })
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    // Temporary
    currentUser = 4;
    return true;
  },
  CreateGpsPoint: (req, res) => {
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
    db("gps_points")
      .insert({
        title: req.input.title,
        longitude: req.input.longitude,
        latitude: req.input.latitude,
        group_id: req.input.groupId,
        order_in_group: req.input.orderInGroup,
        comment: req.input.comment,
        user_id: currentUser
      })
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    // Temporary
    currentUser = 4;
    return true;
  },
  CreateGroup: (req, res) => {
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
    db("groups")
      .insert({
        title: req.input.title,
        comment: req.input.comment,
        longitude: req.input.longitude,
        latitude: req.input.latitude,
        altitude: req.input.altitude,
        start_time: req.input.startTime,
        end_time: req.input.endTime,
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
    // Temporary
    currentUser = 4;
    return true;
  },
  CreateIntervalConfig: (req, res) => {
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
    db("interval_configs")
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
    // Temporary
    currentUser = 4;
    return true;
  },
  CreateRasppiConfig: (req, res) => {
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
    db("rasppi_configs")
      .insert({
        selected_interval: req.input.selectedInterval,
        gps_interval: req.input.gpsInterval,
        user_id: currentUser
      })
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      }); // Temporary
    currentUser = 4;
    return true;
  },
  // UPDATE - not working
  UpdateUser: (req, res) => {
    const updatedUser = req.input;
    db("users")
      .update({
        name: req.input.name,
        cognito_id: req.input.cognitoId,
        password: "fake"
      })
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      }); // Temporary
    currentUser = 4;
    return updatedUser;
  },
  UpdateDevice: (req, res) => {
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
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
    // Temporary
    currentUser = 4;
    return true;
  },
  UpdatePhoto: (req, res) => {
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
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
    // Temporary
    currentUser = 4;
    return true;
  },
  UpdateGpsPoint: (req, res) => {
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
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
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
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
    if (req.input.startTime) {
      updateObject.start_time = req.input.startTime;
    }
    if (req.input.endTime) {
      updateObject.end_time = req.input.endTime;
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
    // Temporary
    currentUser = 4;
    return true;
  },
  UpdateIntervalConfig: (req, res) => {
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
    let updateObject = { user_id: currentUser };
    if (req.input.title) {
      updateObject.title = req.input.title;
    }
    if (req.input.deviceId) {
      updateObject.device_id = req.input.deviceId;
    }
    if (req.input.startMethod) {
      updateObject.start_method = req.input.startMethod;
    }
    if (typeof req.input.startTimeOfDay === "number") {
      updateObject.start_time_of_day = req.input.startTimeOfDay;
    }
    if (typeof req.input.startEpoch === "number") {
      updateObject.start_epoch = req.input.startEpoch;
    }
    if (typeof req.input.startCountdown === "number") {
      updateObject.start_countdown = req.input.startCountdown;
    }
    if (req.input.stopMethod) {
      updateObject.stop_method = req.input.stopMethod;
    }
    if (typeof req.input.stopTimeOfDay === "number") {
      updateObject.stop_time_of_day = req.input.stopTimeOfDay;
    }
    if (typeof req.input.stopEpoch === "number") {
      updateObject.stop_epoch = req.input.stopEpoch;
    }
    if (typeof req.input.stopCountdown === "number") {
      updateObject.stop_countdown = req.input.stopCountdown;
    }
    if (req.input.interval) {
      updateObject.interval = req.input.interval;
    }
    db("interval_configs")
      .where({ id: req.input.id })
      .update(updateObject)
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    // Temporary
    currentUser = 4;
    return true;
  },
  UpdateRasppiConfig: (req, res) => {
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
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
    // Temporary
    currentUser = 4;
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
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
    db("devices")
      .where({ device_serial: req.input.deviceSerial, user_id: currentUser })
      .del()
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    // Temporary
    currentUser = 4;
    return true;
  },
  DestroyPhoto: (req, res) => {
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
    // Post MVP - delete files from S3
    db("photos")
      .where({ id: req.input.id, user_id: currentUser })
      .del()
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    // Temporary
    currentUser = 4;
    return true;
  },
  DestroyGpsPoint: (req, res) => {
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
    db("gps_points")
      .where({ id: req.input.id, user_id: currentUser })
      .del()
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    // Temporary
    currentUser = 4;
    return true;
  },
  DestroyGroup: (req, res) => {
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
    db("groups")
      .where({ id: req.input.id, user_id: currentUser })
      .del()
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    // Temporary
    currentUser = 4;
    return true;
  },
  DestroyIntervalConfig: (req, res) => {
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
    db("interval_configs")
      .where({ id: req.input.id, user_id: currentUser })
      .del()
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    // Temporary
    currentUser = 4;
    return true;
  },
  DestroyRasppiConfig: (req, res) => {
    // Temporary Multiuser - INSECURE
    if (req.input.userId) {
      currentUser = req.input.userId;
    }
    db("rasppi_configs")
      .where({ id: req.input.id, user_id: currentUser })
      .del()
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    // Temporary
    currentUser = 4;
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
