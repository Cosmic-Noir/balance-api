const knex = require("knex");
const app = require("../src/app");
const jwt = require("jsonwebtoken");
const { makeUsersArray, makeAuthHeader } = require("./users.fixtures");

let db;

// Create connection to test db:
before("Make knex instance", () => {
  db = knex({
    client: "pg",
    connection: process.env.TEST_DB_URL
  });
  app.set("db", db);
});

// Disconnect and clear the table for testing
