CREATE TABLE IF NOT EXISTS OrdersProducts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES Orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES Products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL
);