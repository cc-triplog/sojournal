dropdb triplog
createdb triplog
yarn knex --knexfile=./db/knexfile.js migrate:rollback
yarn knex --knexfile=./db/knexfile.js migrate:latest
yarn knex --knexfile=./db/knexfile.js seed:run
yarn nodemon --watch ./db ./db/server.js

