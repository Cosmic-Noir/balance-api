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
    const testUsers = makeUsersArray();

    beforeEach(`Insert users`, () => {
      return db.into("balance_users").insert(testUsers);
    });

    it(`Responds with 200 status and empty list`, () => {
      const user_id = testUsers[0].user_id;
      return supertest(app)
        .get(`/api/charges/${user_id}`)
        .set("Authorization", makeAuthHeader(testUsers[0]))
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
      const user_id = testUsers[0].user_id;
      return supertest(app)
        .get(`/api/charges/${user_id}`)
        .set("Authorization", makeAuthHeader(testUsers[0]))

        .expect(200, [testCharges[0], testCharges[1]]);
    });

    it(`Responds with 400 status when no user_id provided`, () => {
      return supertest(app)
        .get(`/api/charges`)
        .set("Authorization", makeAuthHeader(testUsers[0]))

        .expect(404);
    });
  });
});

// POST endpoint
describe(`POST /api/charges`, () => {
  const testUsers = makeUsersArray();

  beforeEach(`Insert users`, () => {
    return db.into("balance_users").insert(testUsers);
  });

  it(`Posts the new charge, responds with 201 and the new charge`, () => {
    const newCharge = {
      charge_name: "Rent",
      category: "Housing",
      due_date: "2020-02-01",
      amount: 1000,
      month_name: "Feb 2020",
      occurance: "Monthly"
    };

    return supertest(app)
      .post(`/api/charges`)
      .set("Authorization", makeAuthHeader(testUsers[0]))
      .send(newCharge)
      .expect(201)
      .expect(res => {
        expect(res.body.charge_name).to.eql(newCharge.charge_name);
        expect(res.body.category).to.eql(newCharge.category);
        expect(res.body.due_date).to.eql(newCharge.due_date);
        expect(res.body.amount).to.eql(newCharge.amount);
        expect(res.body.month_name).to.eql(newCharge.month_name);
        expect(res.body.occurance).to.eql(newCharge.occurance);
        expect(res.headers.location).to.eql(
          `/api/charges/${res.body.charge_id}`
        );
      });
  });

  // Test missing fields

  const requiredFields = [
    "charge_name",
    "category",
    "due_date",
    "amount",
    "month_name",
    "occurance"
  ];

  requiredFields.forEach(field => {
    const newCharge = {
      charge_name: "Rent",
      category: "Housing",
      due_date: "2020-02-01",
      amount: 1000,
      month_name: "Feb 2020",
      occurance: "Monthly"
    };

    it(`Responds with 400 error when ${field} is missing`, () => {
      delete newCharge[field];

      return supertest(app)
        .post(`/api/charges`)
        .set("Authorization", makeAuthHeader(testUsers[0]))

        .send(newCharge)
        .expect(400, {
          error: { message: `Missing '${field}' in request body` }
        });
    });
  });
});

// PATCH endpoint
describe(`PATCH /api/charges/:charge_id`, () => {
  context(`Given there are no matching sites`, () => {
    const chargeID = 12344;

    it(`Responds with 404 and charge doesn't exiwt`, () => {
      return supertest(app)
        .patch(`/api/charges/${chargeID}`)
        .expect(404, { error: `Charge doesn't exist` });
    });
  });

  context(`Given there is a matching charge`, () => {
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

    it(`Responds with 204 and updates the charge`, () => {
      const idToUpdate = 1;
      const updatedCharge = {
        charge_name: "Apartment Rent",
        category: "Housing",
        due_date: "2020-02-01",
        amount: 1230,
        occurance: "Monthly"
      };

      return supertest(app)
        .patch(`/api/charges/${idToUpdate}`)
        .send(updatedCharge)
        .expect(204);
    });
  });
});
