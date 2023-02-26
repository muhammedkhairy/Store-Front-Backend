# Storefront Backend Project

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. Our task is building the API that will support this application.

- [Storefront Backend Project](#storefront-backend-project)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installing](#installing)
  - [How to use use and interact with database](#how-to-use-use-and-interact-with-database)
  - [Running the scripts](#running-the-scripts)
    - [Start the project](#start-the-project)
    - [Start the project in Watch mode](#start-the-project-in-watch-mode)
    - [Feeding database with tables (Migration)](#feeding-database-with-tables-migration)
    - [Erase tables from the database (Migration)](#erase-tables-from-the-database-migration)
    - [lints scripts](#lints-scripts)
    - [Unit tests](#unit-tests)
    - [Compiling code](#compiling-code)
    - [Compiling code and run tests](#compiling-code-and-run-tests)
  - [Credits](#credits)

## Getting Started

The following instructions will get you a copy on your machine containing all files and folders you need to start testing the API.

### Prerequisites

- Clone the project to your computer with `git clone` command.
- Run `yarn` in your terminal at the project root to install all necessary packages to run the project.
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
- First, you should be sure that there are no running operations on default port for postgreSQL database by running the command `FOR /F "tokens=5" %P IN ('netstat -a -n -o ^| findstr :5432') DO TaskKill.exe /PID %P /F` through command line with administrator privileges. otherwise you may got error `psql: error: connection to server at "localhost" (::1), port 5432 failed: FATAL:  password authentication failed for user "your-username"` when trying to connect to the database
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

## How to use use and interact with database

As required in project to protect users endpoints: create, show all users, show specific user which I did in this project you have to follow these instruction to interacte with the database:

- I created a new table called admins with be generated automatically at the very beginning of database migration.
- You can use this table through the endpoint `api/admin` as POST HTTP Method.
- You can register only one admin user. Remember the email and password very carefully as you can't create more than one admin.
- You this admin user at endpoint `api/admin/login` to generate the required token to complete interacting with others tables in database.
- Once you create users in user table through endpoint `api/users` as POST HTTP method. you can use the token for new users to do what you want with the database.
- In REQUIREMENT.MD file there are an explanation for each endpoint and table.

## Running the scripts

### Start the project

- `yarn start` script will hit the command `node dist/server` which will start our project on the localhost logged in the console.
- But this is the last script you should run as the following scripts need to be run first.

### Start the project in Watch mode

- Thanks to `tsc-watch` package, we can now use it and create a script to view our project in real life.
- `yarn watch` script will tiger the command `rimraf dist && tsc-watch --esModuleInterop src/server.ts --outDir ./dist --onSuccess \"node dist/server.js\"` which immediately run `start` script after compiling the code.

### Feeding database with tables (Migration)

- We will use the package `db-migrate` to feed the database with necessary tables and roll tables back if something goes wrong.

- to install the package we run `yarn global add db-migrate` to use its commands directly through the terminal.

- Then install it locally inside our project folder `yarn add db-migrate` and of course will will add `yarn add db-migrate-pg` as we working with postgreSQL database.

- We create our migration files after configuring it through `database.json` file which located in root directory of our project.

- Here I use the `uuid-ossp` extension to generate a random unique ids for the tables.

> I added the extension as migrate file running before any other migration files

- After creating necessary database by docker it is time to add tables to it, you can run `yarn migrate:up` through command line which will tiger the `npx db-migrate up` and creating the tables shown in REQUIREMENTS.MD
- You have to know that the tables will be created according to it creation time as the files names take this form `YYYYMMDDHHM-extension or table name.sql`.
- So, if you need to create a table before another created table you should rename according to the previous rule.

### Erase tables from the database (Migration)

- As we used the package `db-migrate` to feed the database with necessary tables and extensions we need to build up our project.

- If something go wrong with database tables or you want to erase the tables or one table you can run:
  - `yarn migrate:down` through command line which will tiger the `npx db-migrate down` and which delete the last created table.
  - `yarn migrate:downAll` through command line which will tiger the `npx db-migrate reset` which will delete all created table.

### lints scripts

- `yarn eslint` script As eslint package known for

> Statically analyzes your code to quickly find problems. It is built into most text editors and you can run ESLint as part of your continuous integration pipeline. this script will tiger the command `eslint . --fix` and we add the flag `fix` to fix some code problems automatically.

- `yarn prettier` script, Prettier package is an opinionated code formatter. this script will tiger the command `prettier . --write`, and we add the flag `write` to format the code as we customize it to do.
- If you want to run the two commands together, I made a script for you `yarn lints` which will tiger the the two previous scripts.

### Unit tests

- Unit Testing is defined as a type of software testing where individual components of a software are tested.
- In our Project we are using jasmine `yarn add -D jasmine`, as from its documentation

> Jasmine is a behavior-driven development framework for testing JavaScript code. It does not depend on any other JavaScript frameworks. It does not require a DOM. And it has a clean, obvious syntax so that you can easily write tests.

- We use another package called `jasmine spec reporter` to format the output of the tests, which can be installed through `yarn add -D jasmine-spec-reporter`.
- We also used supertest package for performing tests on the different endpoints, which can be installed through `yarn add -D supertest`

### Compiling code

- As I used TypeScript in my project, It needs to be compiled as browsers don’t understand TypeScript. They understand JavaScript code. Hence, the TypeScript code needs to get compiled into JavaScript, and for that, we need the TypeScript compiler.
- You can read TypeScript documentation to know how to install and configure it.
- using script `yarn build` will compile all TypeScript files into JavaScript files in a pre-defined folder (defined in `tsconfig.json`).

### Compiling code and run tests

- `yarn startDev` will tiger the command `rimraf dist && npx tsc && jasmine` which will delete dist folder then compile the TypeScript code into newly created test folder then run unit tests on the files.

## Credits

- Thanks to Udacity and its team. they are very helpful 😍
- Special thank for Eng. Mahmoud Ali Kassem.
