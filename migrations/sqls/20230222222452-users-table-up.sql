CREATE TABLE IF NOT EXISTS Users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  shipping_address TEXT
);