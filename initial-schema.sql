DROP TABLE IF EXISTS SubscriptionPlan;
CREATE TABLE SubscriptionPlan (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  billing_cycle TEXT CHECK(billing_cycle IN ('monthly', 'yearly')) NOT NULL,
  price REAL NOT NULL CHECK(price >= 0),
  status TEXT CHECK(status IN ('active', 'inactive')) NOT NULL
);

DROP TABLE IF EXISTS Customer;
CREATE TABLE Customer (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  subscription_plan_id TEXT,
  subscription_status TEXT CHECK(subscription_status IN ('active', 'inactive', 'cancelled')) NOT NULL,
  FOREIGN KEY (subscription_plan_id) REFERENCES SubscriptionPlan(id)
);

DROP TABLE IF EXISTS Invoice;
CREATE TABLE Invoice (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  amount REAL NOT NULL CHECK(amount >= 0),
  due_date TEXT NOT NULL,
  payment_status TEXT CHECK(payment_status IN ('pending', 'paid', 'failed')) NOT NULL,
  payment_date TEXT,
  FOREIGN KEY (customer_id) REFERENCES Customer(id)
);

DROP TABLE IF EXISTS Payment;
CREATE TABLE Payment (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL,
  amount REAL NOT NULL CHECK(amount >= 0),
  payment_method TEXT CHECK(payment_method IN ('credit card', 'paypal')) NOT NULL,
  payment_date TEXT NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES Invoice(id)
);
