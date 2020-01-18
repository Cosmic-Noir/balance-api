CREATE TYPE balance_charge_category AS ENUM (
    'Auto',
    'Bills/Utilities',
    'Entertainment',
    'Food/Drink',
    'Health',
    'Housing',
    'Income',
    'Insurance/Financial',
    'Other',
    'Pets',
    'Savings',
    'Shopping',
    'Travel'

)

CREATE TYPE balance_charge_occurance AS ENUM (
    'Monthly',
    'One Time'
)

CREATE TABLE balance_users (
    user_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    username TEXT NOT NULL,
    date_joined TIMESTAMP DEFAULT now() NOT NULL,
    email TEXT NOT NULL,
    pass TEXT NOT NULL
)

CREATE TABLE balance_charges (
    charge_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER REFERENCES balance_users(user_id) ON DELETE CASCADE NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    charge_name TEXT NOT NULL,
    category balance_charge_category,
    due_date TEXT NOT NULL,
    amount INTEGER NOT NULL,
    month_name TEXT NOT NULL,
    occurance balance_charge_occurance
)