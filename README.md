# Storefront Backend Project

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. Our task is building the API that will support this application.

- [Storefront Backend Project](#storefront-backend-project)
  - [Getting Started](#getting-started)
    - [Installing -- Very important](#installing----very-important)
    - [Running the database](#running-the-database)
      - [Windows OS](#windows-os)
      - [Mac OS](#mac-os)
      - [Ubuntu Linux OS](#ubuntu-linux-os)
    - [Install dependencies](#install-dependencies)
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
  - [EndPoints and tables schemas](#endpoints-and-tables-schemas)
  - [Credits](#credits)

## Getting Started

The following instructions will get you a copy on your machine containing all files and folders you need to start testing the API.

### Installing -- Very important

- Create a `.env` file in the root directory of the project, copy the following code and paste it in the `.env` file and add your own variables.
- The part of <u>POSTGRES DATABASE CREDENTIALS</u> in .env file should be filled it with the variables you will use while setting up the database.
  - meaning if you choose to name the development database `store` and testing database `store_test` you must set the same name in .env file `POSTGRES_DEV_DB=store`, `POSTGRES_TEST_DB=store_test`.
  - In part [Running the database](#running-the-database) I give you a hint on how you can set the variables (database name, username, and password). Feel free to change it as you want but make sure to put these values in .env as I explained earlier.

```dotenv
## NODE PORT ##
NODE_PORT=

## DEFAULT ENVIRONMENT ##
NODE_ENV=dev

## POSTGRES DATABASE CREDENTIALS ##
POSTGRES_HOST=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DEV_PORT=
POSTGRES_TEST_PORT=
POSTGRES_DEV_DB=
POSTGRES_TEST_DB=


## AUTHENTICATION VARS ##
BCRYPT_PASSWORD=
SALT_ROUNDS=
JWT_SECRET=
```

### Running the database

Here are the steps you should follow in create the required databases and run them.

#### Windows OS

1. Install PostgreSQL on your Windows machine if it's not already installed. You can download it from the official website: <https://www.postgresql.org/download/windows/>.

2. Open the Command Prompt or PowerShell on your Windows machine.

3. Type the following command to access the PostgreSQL command-line interface: `psql -U postgres`

4. Enter the password for the default PostgreSQL user 'postgres' when prompted.

5. Once you're in the PostgreSQL CLI, you can create a new database using the following command:

   - `CREATE DATABASE store;` for dev database.
   - `CREATE DATABASE store_test;` for test database.

6. When you run `\l`, PostgreSQL will display a list of all of the databases on the server.

7. `\c` is a command used in PostgreSQL's command-line interface, psql, to connect to a different database. It allows you to change the current connection to a new database.

8. To exit the PostgreSQL CLI, you can type: `\q;`.

9. You can also create users and grant them permissions to the database using the following commands:

```sql
CREATE USER admin WITH PASSWORD '1234';
ALTER USER admin WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE store TO admin;
GRANT ALL PRIVILEGES ON DATABASE store_test TO admin;
\c store admin;
```

10 . After creating the database, you can use it in your application by connecting to it using the credentials in the .env file.

#### Mac OS

1. Open the Terminal application on your Mac.

2. Install PostgreSQL using Homebrew by running the following command: `brew install postgresql`

3. After installing PostgreSQL, start the PostgreSQL server by running the following command: `brew services start postgresql`

4. Once the server is running, you can access the PostgreSQL command-line interface by running the following command: `psql postgres`.

5. Continue from here as previously Windows OS.

#### Ubuntu Linux OS

1. Open a terminal window on your Ubuntu machine.

2. Install PostgreSQL by running the following command: `sudo apt-get install postgresql`.

3. After installing PostgreSQL, start the PostgreSQL server by running the following command: `sudo service postgresql start`.

4. Once the server is running, you can access the PostgreSQL command-line interface by running the following command: `sudo -u postgres psql`.

5. Continue from here as previously Windows OS.

Note that these steps assume that you're using the default PostgreSQL configuration. If you've customized your PostgreSQL installation or are using a non-default configuration, you may need to adjust these steps accordingly.

### Install dependencies

- If you forget 😊, please clone the project to your computer with `git clone` command.
- Run `yarn` in your terminal at the project root to install all necessary packages to run the project.

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

- `yarn startTests` will tiger the command `rimraf dist && npx tsc && jasmine` which will delete dist folder then compile the TypeScript code into newly created test folder then run unit tests on the files.
- This script is modified by a way to run database tests on a test database to not touch the original database.`"startTests": "rimraf dist && set NODE_ENV=test&& db-migrate up test && npx tsc && jasmine && db-migrate reset"`

  1. `"rimraf dist"`: This command deletes the "dist" directory, where the compiled TypeScript files are stored.

  2. `"set NODE_ENV=test"`: This command sets the NODE_ENV environment variable to "test". This is a common practice for setting up different environments for development, testing, and production.

  3. `"db-migrate up test"`: This command runs the database migration scripts in the "test" environment. This is likely to create an isolated database environment for testing purposes.

  4. `"npx tsc"`: This command compiles the TypeScript files into JavaScript files.

  5. `"jasmine"`: This command runs the Jasmine test suite.

  6. `"db-migrate reset"`: This command resets the database migration scripts to their original state. This is likely to clean up any changes made to the database during the testing process.

## EndPoints and tables schemas

I have set up another page called [REQUIREMENTS](./REQUIREMENTS.md) where I explained in details how to reach to the endpoints of the project and the schemas of used tables.

## Credits

- Thanks to Udacity and its team. they are very helpful 😍
- Special thank for Eng. Mahmoud Ali Kassem.
