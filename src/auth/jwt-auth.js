const AuthService = require("./auth-service.js");

// Responsible for validating JWT
function requireAuth(req, res, next) {
  const authToken = req.get("Authorization") || "";

  let token;

  if (!authToken.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "Missing Auth Token" });
  } else {
    token = authToken.slice(7, authToken.length);
  }

  try {
    const payload = AuthService.verifyToken(token);

    AuthService.getUser(req.app.get("db"), payload.sub)
      .then(user => {
        if (!user) {
          return res
            .status(401)
            .json({ error: "Unauthorized request - invalid user" });
        }

        req.user_id = user.user_id;
        next();
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  } catch (error) {
    res.status(401).json({ error: "Unauthrozied Request" });
  }
}

module.exports = {
  requireAuth
};
