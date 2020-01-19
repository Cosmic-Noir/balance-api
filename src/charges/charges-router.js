const express = require("express");
const path = require("path");
const xss = require("xss");
const ChargesService = require("./charges-service");
const { requireAuth } = require("../auth/jwt-auth");

const chargesRouter = express.Router();
const jsonParser = express.json();

// Sterilized Charge:
const sterilizedCharge = charge => ({
  charge_id: charge.charge_id,
  user_id: charge.user_id,
  date_create: new Date(charge.date_created),
  charge_name: xss(charge.charge_name),
  category: charge.category,
  due_date: charge.due_date,
  amount: charge.amount,
  month_name: charge.month_name,
  occurance: charge.occurance
});

// GET All Charges
chargesRouter.route("/").get((req, res, next) => {
  ChargesService.getAllCharges(req.app.get("db"))
    .then(charges => {
      res.json(charges.map(sterilizedCharge));
    })
    .catch(next);
});
