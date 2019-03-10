module.exports = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "triplog"
  },
  migrations: {
    directory: "./migrations"
  },
  seeds: {
    directory: "./seeds"
  },
  useNullAsDefault: true
};
