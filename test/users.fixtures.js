const jwt = require("jsonwebtoken");
const config = require("../src/config");

function makeUsersArray() {
  return [
    {
      id: 1,
      username: "test1",
      email: "testing1@gmail.com",
      pass: "$2a$12$PsqkfHALB5kW2fbnJfghEu7dfwa65fbqpK7tXEbKktBFLuHUj0Rs2"
    },
    {
      id: 2,
      username: "test2",
      email: "testing2@gmail.com",
      pass: "$2a$12$PsqkfHALB5kW2fbnJfghEu7dfwa65fbqpK7tXEbKktBFLuHUj0Rs2"
    }
  ];
}

function makeAuthHeader(user, secret = config.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: "HS256"
  });
  return `bearer ${token}`;
}

module.exports = { makeUsersArray, makeAuthHeader };
