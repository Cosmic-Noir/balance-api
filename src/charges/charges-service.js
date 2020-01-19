const ChargesService = {
  getAllCharges(knex) {
    return knex.select("*").from("balance_charges");
  },
  getChargeById(knex, charge_id) {
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
      .then(charge => ChargesService.getChargeById(knex, charge.charge_id));
  },
  deleteCharge(knex, charge_id) {
    return knex("balance_charges")
      .where({ charge_id })
      .delete();
  }
};

module.exports = ChargesService;
