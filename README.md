# Storefront Backend Project

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. Our task is building the API that will support this application.

## Getting Started

The following instructions will get you a copy on your machine containing all files and folders you need to start testing the API.

### Prerequisites

- Clone the project to your computer with `git clone` command.
- Run `yarn` in your terminal at the project root to install all neccessary packages to run the project.
- Create a .env file in the root directory of the project. containing the following variables:

```dotenv
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
 - bcrypt and JWT:
   - BCRYPT_PASSWORD.
   - SALT_ROUNDS.
   - JWT_SECRET.
```

### Installing

- Run `yarn` in your terminal at the project root to install all necessary packages to run the project
- First, you should be sure that there are no running operations on default port for postgreSQL database by running the command `FOR /F "tokens=5" %P IN ('netstat -a -n -o ^| findstr :5432') DO TaskKill.exe /PID %P /F` through command line with administrator privileges.
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

### How to use tables and interact with database

As required in project to protect users endpoints: create, show all users, show specific user which I did in this project you have to follow these instruction to interacte with the database:

- I created a new table called admins with be generated automatically at the very beginning of database migration.
- You can use this table through the endpoint `api/admin` as POST HTTP Method.
- You can register only one admin user. Remember the email and password very carefully as you can't create more than one admin.
- You this admin user to generate the required token to complete interacting with others tables in database.
- Once you create users in user table through endpoint `api/users` as POST HTTP method. you can use the token for new users to do what you want with the database.

## Running the scripts

### Feeding database with tables (Migration)

- We will use the pacakge `db-migrate` to feed the database with neccessary tables and roll tables back if something goes wrong.

- to insatll the package we run `yarn global add db-migarate` to use its commands directly through the terimanl.

- Then install it locally inside our project folder `yarn add db-migarate` and ofcourse will will add `yarn add db-migarate-pg` as we working with postgreSQL database.

- We create our migration files after configuring it through `database.json` file which located in root directory of our project.

- Here I use the `uuid-ossp` extension to generate a randon unique ids for the tables.

> I added the extension as migrate file running before any other migration files

- After creating neccessary database by docker it is time to add tables to it, you can run `yarn migrate:up` through command line which will tigger the `npx db-migare up` and creating the following tables:

