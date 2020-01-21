function makeChargesArray() {
  return [
    {
      charge_id: 1,
      user_id: 1,
      date_created: new Date().toISOString(),
      charge_name: "Rent",
      category: "Housing",
      due_date: "2020-02-01",
      amount: 1000,
      month_name: "Feb 2020",
      occurance: "Monthly"
    },
    {
      charge_id: 2,
      user_id: 1,
      date_created: new Date().toISOString(),
      charge_name: "Paycheck",
      category: "Income",
      due_date: "2020-02-01",
      amount: 1600,
      month_name: "Feb 2020",
      occurance: "Monthly"
    },
    {
      charge_id: 3,
      user_id: 1,
      date_created: new Date().toISOString(),
      charge_name: "Groceries",
      category: "Food/Drink",
      due_date: "2020-02-01",
      amount: 150,
      month_name: "Feb 2020",
      occurance: "Monthly"
    }
  ];
}

function makeMaliciousCharge() {
  const maliciousCharge = {
    charge_id: 911,
    user_id: 1,
    date_created: new Date().toISOString(),
    charge_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    category: "Housing",
    due_date: "2020-02-01",
    amount: 1000,
    month_name: "Feb 2020",
    occurance: "Monthly"
  };
  const expectedCharge = {
    ...maliciousCharge,
    charge_name:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
  };
  return { maliciousCharge, expectedCharge };
}

module.exports = { makeChargesArray, makeMaliciousCharge };
