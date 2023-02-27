# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

- [API Requirements](#api-requirements)
  - [API Endpoints](#api-endpoints)
    - [Admin endpoints](#admin-endpoints)
    - [Users endpoints](#users-endpoints)
    - [Products](#products)
    - [Orders](#orders)
  - [Data Shapes](#data-shapes)
    - [Users table](#users-table)
    - [Products table](#products-table)
    - [Orders table](#orders-table)
    - [OrdersProducts table](#ordersproducts-table)

## API Endpoints

Here's a basic outline of how we can set up the MVC pattern for our API endpoints:

- Models folder: Contains the database models for our User and other related entities. we'll define the schema for our tables entity and use a library pg to interact with the database.
- Controllers folder: Contains the controllers that will handle requests and responses for our different API endpoints. we'll define the functions that will handle requests and responses for our different API endpoints.
- Routes folder: Contains the routes for our different API endpoints. we'll define the routes for our different API endpoints and call the corresponding functions in the tables controller file to handle the requests and responses.
- Service folder: contains the other non-related functions such as hashPassword, userValidation, validateUUID, and authenticateUsers, as these files logically doesn't belong to any of the previous division.
- MiddleWare Folder: Contains a function file to handle errors through project and the authentication function between endpoints.

In addition to these folders, we'll need to set up a few other files:

- server.ts: The main file that initializes the Express app and listens for incoming requests.
- database.ts: A file that contains the basic connection logic to connect to the database. we'll set up a connection pool to connect to the database using a library like pg.

### Admin endpoints

- As we talked in README file that we create that endpoint to gain access to the database.
- We have here two endpoints:
  - First, to make a single admin user you should hit the endpoint `api/admin` and pass through the body a json object contains an email and password.
  - Second, after successfully registered in the database. you should hit `api/admin/login` endpoint to gain your own token which helping you in the rest of endpoints.
  - After you create a users you can use their generated token to continue in other endpoints.

### Users endpoints

- to create a new user you have to pass the token from admin user and pass a json object in the body contains [firstname, lastname, username, email, password, and optionally a shipping address], you can hit the endpoint (POST - `api/users`) which require a token to receive these data.
- to get all users registered in the database you can hit the endpoint (GET - `api/users`) which require a token to receive these data.
- to get one user registered in the database you can hit the endpoint (GET - `api/users/:id`) and pass a valid UUID id to get this user data, which also require a token to receive these data.
- to update a specific user registered in the database you can hit the endpoint (PATCH - `api/users/:id`) and pass a valid UUID id to get this user data, then pass new data through body as json object. this endpoint also require a token to receive and update these data.
- to delete a specific user registered in the database you can hit the endpoint (DELETE - `api/users/:id`) and pass a valid UUID id to delete this user.

### Products

- to enter a new product to the database you have to pass the token from admin user or any user you have and pass a json object in the body contains [product name, price, and optionally a discription], you can hit the endpoint (POST - `api/products`) which require a token to receive these data.
- to get all the products in the database you can hit the endpoint (GET - `api/products`) which require a token to receive these data.
- to get one specific product from the database you can hit the endpoint (GET - `api/products/:id`) and pass a valid UUID id to get this user data, which also require a token to receive these data.
- to update a specific product saved in the database you can hit the endpoint (PATCH - `api/products/:id`) and pass a valid UUID id to get this user data, then pass new data through body as json object. this endpoint also require a token to receive and update these data.
- to delete a specific product in the database you can hit the endpoint (DELETE - `api/products/:id`) and pass a valid UUID id to delete this product.

### Orders

- to enter a new order to the database you have to pass the token from admin user or any user you have and pass a json object in the body contains [product name, price, and optionally a discription], you can hit the endpoint (POST - `api/orders`) which require a token to receive these data.
- to get one specific user's order from the database you can hit the endpoint (GET - `api/orders/users/:id`) and pass a valid UUID id to get this user data, which also require a token to receive these data.
- to get one specific product's order from the database you can hit the endpoint (GET - `api/orders/product/:id`) and pass a valid UUID id to get this user data, which also require a token to receive these data.
- to delete a specific order in the database you can hit the endpoint (DELETE - `api/orders/:id`) and pass a valid UUID id to delete this order.

## Data Shapes

#### Users table

```sql
CREATE TABLE IF NOT EXISTS Users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email TEXT UNIQUE,
  password TEXT,
  shipping_address TEXT
);
```

| id  | first_name | last_name | user_name | email | password | shipping_address |
| --- | ---------- | --------- | --------- | ----- | -------- | ---------------- |

#### Products table

```sql
CREATE TABLE IF NOT EXISTS Products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT
);
```

| id  | name | price | category |
| --- | ---- | ----- | -------- |

#### Orders table

```sql
CREATE TABLE IF NOT EXISTS Orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES Users(id),
  product_id UUID REFERENCES Products(id),
  quantity INTEGER NOT NULL,
  status TEXT
);
```

| id  | user_id | product_id | quantity | status |
| --- | ------- | ---------- | -------- | ------ |

#### OrdersProducts table

- we will need a join table to represent the many-to-many relationship between orders and products.

```sql
CREATE TABLE IF NOT EXISTS OrdersProducts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES Orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES Products(id) ON DELETE CASCADE,
  quantity INTEGER
);
```

> I updated this table and add `ON DELETE CASCADE` as in this context of the table when cascading delete is enabled, deleting a row in the child table will automatically delete the associated row in the parent table, and any other related rows in other child tables, which are also associated with that parent row.

| id  | order_id | product_id | quantity |
| --- | -------- | ---------- | -------- |

[Back to README](./README.md)
