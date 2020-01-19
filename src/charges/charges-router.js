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

// GET All Charges - No real use case for this at the moment aside from testing endpoint
// chargesRouter.route("/").get((req, res, next) => {
//   ChargesService.getAllCharges(req.app.get("db"))
//     .then(charges => {
//       res.json(charges.map(sterilizedCharge));
//     })
//     .catch(next);
// });

// GET charges matching user_id sent in request
chargesRouter.route("/").get(jsonParser, (req, res, next) => {
  if (req.body.user_id == undefined) {
    return res.status(400).json({
      error: `Missing user_id for matching charges`
    });
  }

  ChargesService.getChargesByUserID(req.app.get("db"), req.body.user_id)
    .then(charges => {
      res.json(charges.map(sterilizedCharge));
    })
    .catch(next);
});

module.exports = chargesRouter;
