const xss = require("xss");

const ChargesService = {
  getchargeById(knex, charge_id) {
    return knex
      .select("*")
      .from("balance_charges")
      .where("balance_charges.charge_id", charge_id);
  },
  getChargesByUserID(knex, user_id) {
    return knex
      .select("*")
      .from("balance_charges")
      .where("balance_charges.user_id", user_id);
  },
  insertCharge(knex, newCharge) {
    return knex
      .insert(newCharge)
      .into("balance_charges")
      .returning("*")
      .then(([charge]) => charge)
      .then(charge => chargesService.getChargeById(knex, charge.charge_id));
  },
  deleteCharge(knex, charge_id) {
    return knex("balance_charges")
      .where({ charge_id })
      .delete();
  },
  sterilizedCharge(charge) {
    return {
      charge_id: charge.charge_id,
      user_id: charge.user_id,
      date_create: new Date(charge.date_created),
      charge_name: xss(charge.charge_name),
      category: charge.category,
      due_date: charge.due_date,
      amount: charge.amount,
      month_name: charge.month_name,
      occurance: charge.occurance
    };
  }
};

module.exports = ChargesService;
