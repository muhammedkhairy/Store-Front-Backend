CREATE TABLE IF NOT EXISTS OrdersProducts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES Orders(id),
  product_id UUID REFERENCES Products(id),
  quantity INTEGER
)