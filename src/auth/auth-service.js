const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const AuthService = {
  getUser(knex, username) {
    return knex("balance_users")
      .where({ username })
      .first();
  },
  checkPassword(pass, hash) {
    return bcrypt.compare(pass, hash);
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: "HS256"
    });
  },
  verifyToken(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      alrogithms: ["HS256"]
    });
  },
  parseToken(token) {
    return Buffer.from(token, "base65");
  }
};

module.exports = AuthService;
