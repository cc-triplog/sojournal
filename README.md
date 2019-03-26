<div align="center">
    <img src="./assets/images/sojournal.jpg" align="center" width="100%" alt="sojournal">
</div>
<h1 align="center" >SOJOURNAL</h1>

## Remember your sojourns.

<div height="400px" width="800px">
    <h1 align="center">
    <img src="./src/img/trip.jpg" alt="Trip Log Image" />
    </h1>
</div>
<div align="center">
    <div >
        ***********************************************************************
        <br/>
        <a href="https://sojournal.wixsite.com/sojournal">Our landing page</a>
        <br/>
        <br/>
        App available at Google Play
        <br/>
        <a href="https://play.google.com/store/apps/details?id=com.codechrysalis.magellansmiles">
        <img src="./assets/images/playstore.svg" width="150px">
        </a>
        <br/>
        ***********************************************************************
    </div>
</div>
<div align="center">

[Overview](#1-overview)&nbsp;&nbsp;&nbsp; |&nbsp;&nbsp;&nbsp;
[Technology](#2-technology)&nbsp;&nbsp;&nbsp; |&nbsp;&nbsp;&nbsp;
[Architecture](#3-architecture)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
[Features](#4-features)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Setup](#5-setup)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Deployment](#4-deployment)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Contributions](#5-contributions)

</div>

---

## 1. Overview

Trip Log™ is a cloud image storage based on geographic location. Though Trip Log is aimed to expand creativity of our users through automatic mapping of photos and user friendly text editing interface, with Trip Cam, it can be expanded infinately more.Trip Log™ respects the privacy of our users. Although our users can share their stories via integrated image export or url, user decides if it is partially shared or the whole.

## 2. Technology

### Frontend

<div width="300px">
<img alt="ReactNative" src="./assets/images/react_native.png" width="150px">
<img alt="Redux" src="./assets/images/redux.png" width="150px">
<img alt="Android" src="./assets/images/android.png" width="50px">
</div>

### Backend

<div width="400px">
<img alt="AWS" src="./assets/images/aws.jpg" width="90px">
<img alt="S3" src="./assets/images/amazons3.jpg" width="120px">
<img alt="EC2" src="./assets/images/ec2.png" width="150px">
<img alt="express" src="./assets/images/express.png" width="120px">
<img alt="graphql" src="./assets/images/graphql.png" width="150px">
<img alt="knex" src="./assets/images/knex.png" width="50px">
<img alt="postgres" src="./assets/images/postgres.png" width="50px">
<img alt="ubuntu.png" src="./assets/images/ubuntu.png" width="50px">
</div>

### Hardware

<div width="300px">
<img alt="raspberry pi" src="./assets/images/raspberrypi.png" width="50px">
<img alt="python" src="./assets/images/python.png" width="50px">
<img alt="redis" src="./assets/images/redis.png" width="150px">
</div>

## 3. Architecture

### Frontend

<img alt="screenshot_hard" src="./assets/images/frontend-screenshot.png">

### Backend

<img alt="screenshot_hard" src="./assets/images/backend-screenshot.png">

### Hardware

<img alt="screenshot_hard" src="./assets/images/hardware_screenshot.png">

## 4. Features

### Frontend

<img alt="screenshot_hard" src="./assets/images/frontend-current-feature.png">

### Backend

<img alt="screenshot_hard" src="./assets/images/backend-current-feature.png">

### Hardware

<img alt="screenshot_hard" src="./assets/images/hardware-current-feature.png">

## 5. Setup

### Frontend

1. Clone our repositry from GitHub

```
$ git clone https://github.com/sojournalists/sojournal.git
```

2. Install and set up [Android Studio](https://developer.android.com/studio)

3. Install dependencies

```
$ yarn install
```

4. Run Android emulator from Android Studio

5. Start Application

```
$ yarn android
```

### Backend

1. Clone our repositry from GitHub

```
$ git clone https://github.com/sojournalists/sojournal.git
```

2. Install dependencies

```
$ yarn install
```

3. Setup the Database

```
#Create database
$ createdb triplog

#Drop database
$ dropdb triplog

#Migration
$ yarn knex --knexfile=./db/knexfile.js migrate:latest

#Rollback
$ yarn knex --knexfile=./db/knexfile.js migrate:rollback

#Seed data
yarn knex --knexfile=./db/knexfile.js seed:run
```

3. Run Server

```
$ yarn node db/server.js
```

4. Run Server (Development)

```
$ yarn nodemon db/server.js
```

5. Now you can test server at localhost:4000/graphql

### Hardware

See Hardware [README](./raspberry-pi/README.md)

## 6. Contributions

To contribute to this app, make sure you create a branch and **ALWAYS** make a pull request. **DO NOT EDIT THE MASTER!**

`git checkout -b <branch_name>`

If you want to push your edited files to your remote file, run the following:

`git push <remote_name> <branch_name>`

---

<div align="center">
<b>LICENSE</b>: CC7 TEAM CYAN
</div>
<br/>
<div align="center">
<b>Linkedin</b>: <br/>

[Brian Lee](https://www.linkedin.com/in/briansunghaklee/)&nbsp;&nbsp;&nbsp; |&nbsp;&nbsp;&nbsp;[Omar Kalouti](https://www.linkedin.com/in/omar-kalouti/)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Chaz Wilson](https://www.linkedin.com/in/chaz-wilson/)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Keisuke Mori](https://www.linkedin.com/in/keisuke-mori/)
