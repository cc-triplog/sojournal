module.exports = `
    type User {
      id: Int
      name: String
      email: String
      createdAt: String
      updatedAt: String
    }
    type Device {
      id: Int
      title: String
      deviceSerial: String
      createdAt: String
      updatedAt: String
    }
    type Photo {
      id: Int
      title: String
      longitude: Float
      latitude: Float
      altitude: Float
      deviceId: Int
      groupId: Int
      orderInGroup: Int
      comment: String
      imageFile: String
      bearing: Float
      createdAt: String
      updatedAt: String
    }
    type GpsPoint {
      id: Int  
      title: String
      longitude: Float
      latitude: Float
      altitude: Float
      groupId: Int
      orderInGroup: Int
      comment: String
      createdAt: String
      updatedAt: String
    }
    type Group {
      id: Int
      title: String
      longitude: Float
      latitude: Float
      altitude: Float
      groupId: Int
      orderInGroup: Int
      createdAt: String
      updatedAt: String
    }
    type IntervalConfig {
        id: Int
        title: String
        deviceId: Int
        startMethod: String
        startTimeOfDay: Int
        startEpoch: Int
        startCountdown: Int
        stopMethod: String
        stopTimeOfDay: Int
        stopEpoch: Int
        stopCountdown: Int
        interval: Int
        createdAt: String
        updatedAt: String
    }
    type RasppiConfig {
      id: Int
      selectedInterval: Int
      gpsInterval: Int
      createdAt: String
      updatedAt: String
    }

    input InputUser {
      id: Int
      name: String
      email: String
      password: String
      createdAt: String
      updatedAt: String
    }
    input InputDevice {
      id: Int
      title: String
      deviceSerial: String
      createdAt: String
      updatedAt: String
    }
    input InputPhoto {
      id: Int
      title: String
      longitude: Float
      latitude: Float
      altitude: Float
      deviceId: Int
      groupId: Int
      orderInGroup: Int
      comment: String
      imageFile: String
      bearing: Float
      createdAt: String
      updatedAt: String
    }
    input InputGpsPoint {
      id: Int
      title: String
      longitude: Float
      latitude: Float
      altitude: Float
      groupId: Int
      orderInGroup: Int
      comment: String
      createdAt: String
      updatedAt: String
    }
    input InputGroup {
      id: Int
      title: String
      longitude: Float
      latitude: Float
      altitude: Float
      groupId: Int
      orderInGroup: Int
      createdAt: String
      updatedAt: String
    }
    input InputIntervalConfig {
      id: Int
      title: String
      deviceId: Int
      startMethod: String
      startTimeOfDay: Int
      startEpoch: Int
      startCountdown: Int
      stopMethod: String
      stopTimeOfDay: Int
      stopEpoch: Int
      stopCountdown: Int
      interval: Int
      createdAt: String
      updatedAt: String
    }
    input InputRasppiConfig {
      id: Int
      selectedInterval: Int
      gpsInterval: Int
      createdAt: String
      updatedAt: String
    }


    input UpdateUser {
      id: Int!
      name: String
      email: String
      password: String
      createdAt: String
      updatedAt: String
    }
    input UpdateDevice {
      id: Int!
      title: String
      deviceSerial: String
      createdAt: String
      updatedAt: String
    }
    input UpdatePhoto {
      id: Int!
      title: String
      longitude: Float
      latitude: Float
      altitude: Float
      deviceId: Int
      groupId: Int
      orderInGroup: Int
      comment: String
      imageFile: String
      bearing: Float
      createdAt: String
      updatedAt: String
    }
    input UpdateGpsPoint {
      id: Int!
      title: String
      longitude: Float
      latitude: Float
      altitude: Float
      groupId: Int
      orderInGroup: Int
      comment: String
      createdAt: String
      updatedAt: String
    }
    input UpdateGroup {
      id: Int!
      title: String
      longitude: Float
      latitude: Float
      altitude: Float
      groupId: Int
      orderInGroup: Int
      createdAt: String
      updatedAt: String
    }
    input UpdateIntervalConfig {
      id: Int!
      title: String
      startMethod: String
      startTimeOfDay: Int
      startEpoch: Int
      startCountdown: Int
      stopMethod: String
      stopTimeOfDay: Int
      stopEpoch: Int
      stopCountdown: Int
      interval: Int
      createdAt: String
      updatedAt: String
    }
    input UpdateRasppiConfig {
      id: Int!
      selectedInterval: Int
      gpsInterval: Int
      createdAt: String
      updatedAt: String
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
    input DestroyGpsPoint {
      id: Int!
    }
    input DestroyGroup {
      id: Int!
    }
    input DestroyIntervalConfig {
      id: Int!
    }
    input DestroyRasppiConfig{
      id: Int!
    }

    type Query {
      ReadUser(type: InputUser): [User]
      ReadDevice(type: InputDevice): [Device]
      ReadPhoto(type: InputPhoto): [Photo]
      ReadGpsPoint(type: InputGpsPoint): [GpsPoint]
      ReadGroup(type: InputGroup): [Group]
      ReadIntervalConfig(type: InputIntervalConfig): [IntervalConfig]
      ReadRasppiConfig(type: InputRasppiConfig): [RasppiConfig]
    }

    type Mutation {
      CreateUser(input: InputUser): Boolean
      CreateDevice(input: InputDevice): Boolean
      CreatePhoto(input: InputPhoto): Boolean
      CreateGpsPoint(input: InputGpsPoint): Boolean
      CreateGroup(input: InputGroup): Boolean
      CreateIntervalConfig(input: InputIntervalConfig): Boolean
      CreateRasppiConfig(input: InputRasppiConfig): Boolean

      UpdateUser(input: UpdateUser): User
      UpdateDevice(input: UpdateDevice): Device
      UpdatePhoto(input: UpdatePhoto): Photo
      UpdateGpsPoint(input: UpdateGpsPoint): GpsPoint
      UpdateGroup(input: UpdateGroup): Group
      UpdateIntervalConfig(input: UpdateIntervalConfig): IntervalConfig
      UpdateRasppiConfig(input: UpdateRasppiConfig): RasppiConfig

      DestroyUser(input: DestroyUser): Boolean
      DestroyDevice(input: DestroyDevice): Boolean
      DestroyPhoto(input: DestroyPhoto): Boolean
      DestroyGpsPoint(input: DestroyGpsPoint): Boolean
      DestroyGroup(input: DestroyGroup): Boolean
      DestroyIntervalConfig(input: DestroyIntervalConfig): Boolean
      DestroyRasppiConfig(input: DestroyRasppiConfig): Boolean
    }
`;
