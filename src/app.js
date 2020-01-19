require("dotenv").config();
const express = require("express");
const { NODE_ENV } = require("./config");

/* Middleware */
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

/* Routers */
const authRouter = require("./auth/auth-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

/* Middleware use methods before Routers */
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// Return 500 for internal server errros
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.log(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

// Initial test endpoint
app.get("/", (req, res) => {
  res.send("Hello, boilerplate!");
});

// Routers
app.use("/api/login", authRouter);

module.exports = app;
