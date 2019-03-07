# Trip Log

## How to Setup the Database

\$ createdb triplog

\$ yarn knex migrate:latest

\$ yarn knex migrate:rollback

\$ knex seed:run

<div height="400px" width="800px">
    <h1 align="center">
    <img src="./src/img/trip.jpg" alt="Trip Log Image" />
    </h1>
</div>

<div align="center">

[About](#1-about)&nbsp;&nbsp;&nbsp; |&nbsp;&nbsp;&nbsp;[Features](#2-features)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Setup](#3-setup)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Deployment](#4-deployment)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Contributions](#5-contributions)

**ChazGaz** is the application created by a team **Omar**.

</div>

---

## 1. About

Trip Log™ is a cloud image storage based on geographic location. Though Trip Log is aimed to expand creativity of our users through automatic mapping of photos and user friendly text editing interface, with Trip Cam, it can be expanded infinately more.Trip Log™ respects the privacy of our users. Although our users can share their stories via integrated image export or url, user decides if it is partially shared or the whole.

<div width="400px">
<img alt="Node.js" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png" width="100px">
<img alt="React" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png" width="100px">
<img alt="Redux" src="https://redux.js.org/img/redux-logo-landscape.png" width="100px">
<img alt="Heroku" src="https://i2.wp.com/gluonhq.com/wp-content/uploads/2018/05/heroku-logotype-vertical-purple.png?fit=576%2C684&ssl=1" width="100px">
</div>

## 2. Features

### a) _Upload Photos That Automatically Locates on Map_

Once you open the app, you will see your geographical location zoomed into google map.

<img alt="PicOfApp" src="./img/map1.png">

Click on the **Upload** button and it will direct you to your image gallery on your mobile device. Select one or multiple images to upload.

<img alt="PicOfApp" src="./img/map2.png">

Once photos are chosen, you will be able to see it on the map. Please refer to the instruction below to learn more about writting comments for each photo uploads.

### b) _Check out the name of a truck stop_

If you click a marker, an informational pop-up balloon with the name of that truck stop will appear just above the marker.

<img alt="PicOfApp" src="./img/map3.png">

To close a pop-up balloon, click the marker or the close button (marked with an 'x') in the upper-right hand corner of the balloon.

## 3. Setup

Install the dependencies and devDependencies and start the server.

```
yarn
```

Install postgres, if it isn't already installed.

```
Create a database called "truckstop"
```

createdb truckstop

```
To view your project locally (on http://localhost:9000/) you need to run the build script and connect to the localhost.
```

yarn build
yarn start

```
To work on Heroku, you need to be added as a collaborator by the project manager. Follow [this tutorial](https://devcenter.heroku.com/articles/getting-started-with-nodejs) to set your machine up for Heroku. To access Heroku from your machine, you need to be added as a collaborator by the project manager.

Useful: add Heroku as a remote using:
```

heroku git:remote -a truck-stops

## 4. Deployment

The master branch is the stage and production.
Therefore, when working locally, please make sure you are working from a branch and not directly on the master branch, create your branch and set up upstream as below.

```
git remote add upstream https://github.com/codechrysalis/cc7-project.continuous-delivery-react.git
```

If your change is to be merged with the master branch, it will be automatically deployed via Heroku.

## 5. Contributions

In order to make contributions be sure that your changes are created in a new branch with descriptive name that explains what is being changed (e.g. "truckstop-ui-fix") and in your pull request be sure to provide a detailed description of the changes made.

**Note:** It is best to discuss your proposed changes before starting on a contribution to be sure that your contribution is suitable for the project.

<div align="center">©︎Created by <b>TEAM OMAR 2019</b></div>
