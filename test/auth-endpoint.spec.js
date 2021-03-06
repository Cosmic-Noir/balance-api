const knex = require("knex");
const app = require("../src/app");
const jwt = require("jsonwebtoken");
const { makeUsersArray, makeAuthHeader } = require("./users.fixtures");

let db;

// Create connection to test db:
before("Make knex instance", () => {
  db = knex({
    client: "pg",
    connection: process.env.TEST_DATABASE_URL
  });
  app.set("db", db);
});

// Disconnect and clear the table for testing
after("Disconnect from db", () => db.destroy());
before("Clear the table", () =>
  db.raw("TRUNCATE balance_charges, balance_users RESTART IDENTITY CASCADE")
);
afterEach("Cleanup", () =>
  db.raw("TRUNCATE balance_charges, balance_users RESTART IDENTITY CASCADE")
);

describe("POST /api/login", () => {
  const testUsers = makeUsersArray();

  beforeEach(`Insert testUsers`, () => {
    return db.into("balance_users").insert(testUsers);
  });

  const requiredFields = ["username", "pass"];

  requiredFields.forEach(field => {
    const loginReqBody = {
      username: testUsers[0].username,
      pass: testUsers[0].pass
    };

    it(`Responds with 400 when ${field} is missing`, () => {
      delete loginReqBody[field];

      return supertest(app)
        .post(`/api/login`)
        .send(loginReqBody)
        .expect(400, { error: `Missing '${field}' in request body` });
    });
  });

  it(`Responds with 400 "Incorrect username or password" if incorrect info supplied`, () => {
    const invalidUser = { username: "badName", pass: "somepass" };

    return supertest(app)
      .post(`/api/login`)
      .send(invalidUser)
      .expect(400, { error: "Incorrect username or password" });
  });

  it(`Responds with 200 if correct info is supplied`, () => {
    const validUser = {
      username: testUsers[0].username,
      pass: "Testing1234!"
    };

    const expectedToken = jwt.sign(
      { user_id: testUsers[0].user_id },
      process.env.JWT_SECRET,
      {
        subject: testUsers[0].username,
        algorithm: "HS256"
      }
    );

    return supertest(app)
      .post(`/api/login`)
      .send(validUser)
      .expect(200, {
        authToken: expectedToken
      });
  });
});
