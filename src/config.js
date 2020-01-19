module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL:
    process.env.DB_URL || "postgresqul://dunder_mifflin@localhost/balance",
  TEST_DB_URL: "postgresql://dunder_mifflin@localhost/balance-test",
  JWT_SECRET: process.env.JWT_SECRET
};
