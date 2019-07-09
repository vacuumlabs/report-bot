# Report Bot

## 1 Intro

This project consists of three applications contained in the following folders:
  * `bot`,
  * `client`,
  * `server`.

*Bot* is a Slack bot which is in charge of scraping data from specified workspace and channels and saving them to the database. It can be run standalone.

Applications *Client* and *Server* are tightly coupled and have to be run simultaneously:
  * *Server* is responsible for fetching data from the database and sending them to the client on demand.
  * *Client* is an UI which allows the user to view scraped data categorized by special tags contained in the messages.

## 2 Database

  * The database is needed by *Bot* and also *Server*. We will need an instance of Postgres database.

### 2.1 How to run locally

  * The easiest and fastest way how to set up the database is using Docker. You can install and run Postgres database as a Docker container with the following command:

```bash
$ docker run --name report-bot-db -p 127.0.0.1:5432:5432 -e POSTGRES_DB=report_bot -e POSTGRES_PASSWORD=postgres -d postgres
```

  * If you will use some different database then you need to create `.env` file in the root directory and also in `server` directory and set up the proper settings for the database. You can get inspiration in `.env.sample` files.

  * When the database is running you need to run migrations:

```bash
$ yarn knex migrate:latest
```

### 2.2 Developer notes

  * How to check the status of the Docker container with the database:

```bash
$ docker ps -a
```

  * How to run the Docker container with the database (e.g. after computer restart):

```bash
$ docker start report-bot-db
```

  * How to stop and remove the docker container with the database:

```bash
$ docker stop report-bot-db && docker rm report-bot-db
```

  * How to create a new database migration, e.g. for creation of `report` table:

```bash
$ yarn knex migrate:make create_report_table
```

  * How to rollback the last batch of migrations:

```bash
$ yarn knex migrate:rollback
```

## 3 Bot application

### 3.1 Set-up and running

  * [Create a bot for your workspace](https://get.slack.help/hc/en-us/articles/115005265703-Create-a-bot-for-your-workspace).

  * Under the section "OAuth & Permissions" in settings of the application, you can find tokens needed to run *Bot*:
    - "OAuth Access Token" starts with `xoxp` and will be called as `appToken` in our codebase,
    - "Bot User OAuth Access Token" starts with `xoxb` and will be called as `botToken` in our codebase.

  * Create file `.env` in the `bot` directory with the same content as you can find in `bot/.env.template`. Then set values to variables `SLACK_APP_TOKEN` and `SLACK_BOT_TOKEN` (see the previous step).

  * Go into the folder `bot` and run the application:

```bash
$ yarn && yarn build && yarn start
```

### 3.2 How to use the Bot

  * Invite the *Bot* into some public channel or private group you want to scrape its content and store them in a database:

```
/invite @ReportBot 
```

  * If you want to stop scraping the content of some channel you can run the command:

```
/remove @ReportBot 
```

  * To categorize the message under some tag you can use special tags in the format `:__some-tag:`.

## 4 Server application

### 4.1 Set-up and running

  * Create file `.env` in the `server` directory with the same content as you can find in `server/.env.template`. Then set values to variables `SLACK_APP_TOKEN` (see the section 3.1 above).

  * Go into the folder `server` and run the application:

```bash
$ yarn && yarn build && yarn start
```

  * Then you can run the Client application (see the following section).

## 5 Client application

### 5.1 Set-up and running

  * Got into the folder `client` and run the application:

```bash
$ yarn && yarn build && yarn start
```
