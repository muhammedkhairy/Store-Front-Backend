CREATE TABLE IF NOT EXISTS Products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT
);