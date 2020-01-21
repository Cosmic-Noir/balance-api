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

  context(`Given there are matching charges for user`, () => {
    const testUsers = makeUsersArray();
    const testCharges = makeChargesArray();

    beforeEach(`Insert users and charges`, () => {
      return db
        .into("balance_users")
        .insert(testUsers)
        .then(() => {
          return db.into("balance_charges").insert(testCharges);
        });
    });

    it(`Responds with 200 status and matching charges`, () => {
      const userID = { user_id: testUsers[0].user_id };
      return supertest(app)
        .get(`/api/charges`)
        .send(userID)
        .expect(200, [testCharges[0], testCharges[1]]);
    });

    it(`Responds with 400 status when no user_id provided`, () => {
      return supertest(app)
        .get(`/api/charges`)
        .expect(400, { error: `Missing user_id for matching charges` });
    });
  });
});
