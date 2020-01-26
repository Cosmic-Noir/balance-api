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

  // Check user exists
  AuthService.getUser(req.app.get("db"), loginUser.username)
    .then(dbUser => {
      if (!dbUser) {
        return res.status(400).json({
          error: "Incorrect username or password"
        });
      }
      // console.log(`User found matching ${loginUser.username}`);
      // Check password matches
      return AuthService.checkPassword(loginUser.pass, dbUser.pass).then(
        compareMatch => {
          if (!compareMatch) {
            return res.status(400).json({
              error: "Incorrect username or password"
            });
          }
          // Send jwt if all passes
          const sub = dbUser.username;
          const payload = { user_id: dbUser.user_id };
          res.send({
            authToken: AuthService.createJwt(sub, payload)
          });
        }
      );
    })
    .catch(next);
});

module.exports = authRouter;
