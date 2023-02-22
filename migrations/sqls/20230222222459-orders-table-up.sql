CREATE TABLE IF NOT EXISTS Orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES Users(id),
  product_id UUID REFERENCES Products(id),
  quantity INTEGER NOT NULL,
  status TEXT
);