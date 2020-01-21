const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeChargesArray, makeMaliciousCharge } = require("./charges.fixtures");
const { makeUsersArray, makeAuthHeader } = require("./users.fixtures");

let db;

// Create connection to db
before(`Make knex instance`, () => {
  db = knex({
    client: "pg",
    connection: process.env.TEST_DB_URL
  });
  app.set("db", db);
});

// Disconnect and clear table for testing
after(`Disconnect from db`, () => db.destroy());
before(`Clear the tables`, () =>
  db.raw("TRUNCATE balance_charges, balance_users RESTART IDENTITY CASCADE")
);
afterEach(`Cleanup`, () =>
  db.raw("TRUNCATE balance_charges, balance_users RESTART IDENTITY CASCADE")
);

// GET endpoints
describe("GET /api", function() {
  context(`Given there are no charges`, () => {
    it(`Responds with 200 status and empty list`, () => {
      const userID = { user_id: 1 };
      return supertest(app)
        .get(`/api/charges`)
        .send(userID)
        .expect(200);
    });
  });
});
