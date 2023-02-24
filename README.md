# Storefront Backend Project

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. Our task is building the API that will support this application.

## Getting Started

The following instructions will get you a copy on your machine containing all files and folders you need to start testing the API.

### Prerequisites

- Clone the project to your computer with `git clone` command.
- Run `yarn` in your terminal at the project root to install all neccessary packages to run the project.
- Create a .env file in the root directory of the project. containing the following variables:
  - nodejs server listening port:
    - NODE_PORT
  - postgres development database credentials:
    - POSTGRES_HOST.
    - POSTGRES_USER.
    - POSTGRES_PASSWORD.
    - POSTGRES_PORT.
    - POSTGRES_DB.
  - postgres testing database credentials:
    - POSTGRES_HOST_TEST.
    - POSTGRES_USER_TEST.
    - POSTGRES_PASSWORD_TEST.
    - POSTGRES_PORT_TEST.
    - POSTGRES_DB_TEST.
  - db-migrate default environment:
    - NODE_ENV.

### Installing

- Run `yarn` in your terminal at the project root to install all necessary packages to run the project
- ==First, you should be sure that there are no running operations on default port for postgreSQL database by running the command `FOR /F "tokens=5" %P IN ('netstat -a -n -o ^| findstr :5432') DO TaskKill.exe /PID %P /F` through command line with administrator privileges.==
- Make sure that the docker is installed and running in your computer.
- start the database by running `docker-compose up -d` through command line.
- You can choose to start both databases (dev and test) together by running the previous command or to start any of them by running the command `docker-compose up {container_name} -d`.
- Run the `docker-compose ps` command to check the health status of PostgreSQL container. Once the container is reported as healthy, you should be able to connect to the PostgreSQL server.

```markdown
$ docker-compose ps
NAME IMAGE COMMAND SERVICE CREATED STATUS PORTS
postgres postgres:latest "docker-entrypoint.s…" postgres About a minute ago Up 58 seconds (healthy) 0.0.0.0:5432->5432/tcp
```

- Now the database is set and ready for our project.

## Running the scripts

### Feeding database with tables (Migration)

- We will use the pacakge `db-migrate` to feed the database with neccessary tables and roll tables back if something goes wrong.

- to insatll the package we run `yarn global add db-migarate` to use its commands directly through the terimanl.

- Then install it locally inside our project folder `yarn add db-migarate` and ofcourse will will add `yarn add db-migarate-pg` as we working with postgreSQL database.

- We create our migration files after configuring it through `database.json` file which located in root directory of our project.

- Here I use the `uuid-ossp` extension to generate a randon unique ids for the tables.

> I added the extension as migrate file running before any other migration files

- After creating neccessary database by docker it is time to add tables to it, you can run `yarn migrate:up` through command line which will tigger the `npx db-migare up` and creating the following tables:

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

| id  | first_name | last_name | email | password | shipping_address |
| --- | ---------- | --------- | ----- | -------- | ---------------- |

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
