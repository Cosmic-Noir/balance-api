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

// POST for posting new charge - will need to eventually requireAuth, not required for now for testing
chargesRouter.route("/").post(jsonParser, (req, res, next) => {
  const {
    user_id,
    charge_name,
    category,
    due_date,
    amount,
    month_name,
    occurance
  } = req.body;
  const newCharge = {
    user_id,
    charge_name,
    category,
    due_date,
    amount,
    month_name,
    occurance
  };

  for (const [key, value] of Object.entries(newCharge)) {
    if (value == null) {
      return res.status(400).json({
        error: `Missing '${key} in request body`
      });
    }
  }

  ChargesService.insertCharge(req.app.get("db"), newCharge)
    .then(charge => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${charge.charge_id}`))
        .json(charge);
    })
    .catch(next);
});

// PATCH for updating a charge

// DELETE for deleting existing charges from DB
chargesRouter
  .route("/:charge_id")
  .delete((req, res, next) => {
    ChargesService.deleteCharge(req.app.get("db"), req.params.charge_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { charge_name, category, due_date, amount, occurance } = req.body;
    const updatedCharge = {
      charge_name,
      category,
      due_date,
      amount,
      occurance
    };
    console.log(updatedCharge);

    const numberOfValues = Object.values(updatedCharge).filter(Boolean).length;

    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain a charge field to update`
        }
      });
    }

    ChargesService.updateCharge(
      req.app.get("db"),
      req.params.charge_id,
      updatedCharge
    )
      .then(numberRows => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = chargesRouter;
