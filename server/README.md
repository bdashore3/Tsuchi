# Tsūchi Server

The server contains the heart of Tsūchi which includes sources, notification services, and the updater.

## Setup

Looking to be added on the official server? Please look at the [setup wizard README](https://github.com/bdashore3/Tsuchi/tree/default/setup-wizard/README.md) instead

There are two possible ways to configure the server:

1. Single use (via JSONs)
2. Multiple users (via PostgreSQL)

## Binary downloads

The server binaries are distributed in a rolling release format through Github Actions. To download the latest commit binary:

NOTE: You have to have a Github account to access artifacts! If you don't have one, make one.

-   Head to the [actions page](https://github.com/bdashore3/Tsuchi/actions)
-   Click on the latest run
-   Download the server binary archive from the artifacts section of the action (ex name. tsuchi-server-commitsha).

## Single-user setup

Once you download the binary, you can run it in single-user mode which is best for testing changes. Here's how.

Prerequisites:

-   Username JSON files
-   A Windows/macOS/Linux machine to run the software on

Steps:

1. Unzip the artifact files
2. Place your OS-specific binary inside a folder, this will serve as the "project root" from now on
3. Add a folder called `users` in the project root
4. Place your `user.json` that was generated from the [setup wizard](https://github.com/bdashore3/Tsuchi/tree/default/setup-wizard) inside the `users` folder
5. Run the binary file
   a. Double click the .exe on Windows
   b. For macOS and Linux, run this binary in the terminal using this one-step command: `cd project_root && chmod +x tsuchi-server-os && ./tsuchi-server-os`. Replace `project_root` and `os` with the appropriate values.

## Server/Multi-user setup

Once you downloaded the binary, you can also run Tsūchi in server mode. This is ideal for production environments with multiple users through the use of PostgreSQL.

Prerequisites:

-   A server that runs Windows, macOS, or Linux
-   A PostgreSQL database
-   NodeJS (for DB migrations)

### Database Setup

Follow [this guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-20-04) up until step 3 to get postgres set up on ubuntu. Afterwards, go on pgAdmin4 (or your favorite DB manager) and follow these steps

1.  Log into a sudo shell and change the postgres user's password by:
    `passwd postgres`
2.  Add a new server using postgres as the username, and the password that you set for postgres. The IP is your VPS IP or localhost depending on where you're hosting.
3.  Once connected, create a new database and call it whatever you want. You will be using this database name in your ConnectionString and leave the database BLANK.

Your connection URL should look like this: `postgres://postgres:{password}@{IP}:5432/{Db Name}`. Save this for later.

If you have a connection refused error, follow [this forum post](https://www.digitalocean.com/community/questions/remote-connect-to-postgresql-with-pgadmin) on DigitalOcean

### Database migrations

All migrations are located [here](https://github.com/bdashore3/Tsuchi/tree/default/migration-setup).

This is a one-time process for setting up the database. Once it's completed, all files and folders regarding migrations can be removed.

Prerequistes:

-   Install nodejs and yarn

Steps:

1. Clone the repository
2. cd into migration-setup
3. Run `yarn install`
    - If you want to execute the db-migrate command globally (recommended), also run `yarn global add db-migrate`
4. export an environment variable called `DATABASE_URL` and set that to your database URL (should look like `postgres://postgres:{password}@{IP}:5432/{Db Name}`
5. Run `db-migrate up` which will add the database schema inside your database
6. Check to make sure your database has the right columns
7. Remove the repository (and nodejs/yarn if you want)

### Configuration

For the file structure, follow steps 1-4 in [Single-user setup](#Single-user%20setup)

Then, copy `info_sample.json` to `info.json` in the project root and add the following credentials

```
- DBUrl: postgres://postgres:{password}@{IP}:5432/{Db Name}
```

Replace the parts in curly braces with your database URL.

### Adding Users

After you've set up the database, add the user JSON files into the `users` folder. These will be deleted when the database is populated/updated for security purposes.

## Testing the server

To make sure the server is working for updates and notifications, it's a good idea to test the server binary in your production environment before launch.

There are two tests:

-   updates: Test for checking if sources update properly
-   notification: Test for checking if a notification is sent properly. Utilizes your database/users folder depending on if an info.json is present.

To run these tests with the binary, run:
`./tsuchi-server-os-commitsha --test <test name> info.json`

You can also provide an info.json to test notifications using a PostgreSQL database.

### Finally

Once you are done, run `./tsuchi-server-os-commitsha info.json`. Replace `project_root` and `os` with the appropriate values.

info.json is provided as a command line argument. Without this argument, the service will fallback to single-user mode.

All user.json files will be imported/deleted for security reasons.
