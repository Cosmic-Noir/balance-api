const express = require("express");
const jsonParser = express.json();
const AuthService = require("./auth-service");

const authRouter = express.Router();

authRouter.post("/", jsonParser, (req, res, next) => {
  const { username, pass } = req.body;

  const loginUser = { username, pass };

  // Check for missing username or pass in req
  for (const [key, value] of Object.entries(loginUser)) {
    if (value == null) {
      return res.status(400).json({
        error: `Missing '${key}' in request body`
      });
    }
  }
});
