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

  * In the root folder, copy `.env.template` into `.env`.

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

## 3 General info

Project uses yarn workspaces structure. So you should run every yarn command from the root folder.

To install dependencies for each part of the project, just run:

```bash
$ yarn
```

## 4 Bot application

### 4.1 Set-up and running

  * [Create a bot for your workspace](https://get.slack.help/hc/en-us/articles/115005265703-Create-a-bot-for-your-workspace).

  * Under the section "OAuth & Permissions" in settings of the application, you can find tokens needed to run *Bot*:
    - "OAuth Access Token" starts with `xoxp` and will be called as `appToken` in our codebase,
    - "Bot User OAuth Access Token" starts with `xoxb` and will be called as `botToken` in our codebase.
    - "Signing secret" will be called as `signingSecret` in our codebase.

  * In the `bot` folder, copy `.env.template` into `.env` and fill missing values.

  * Go into the folder `bot` and run the application:

```bash
$ yarn build && yarn start
```

### 4.2 How to use the Bot

  * Invite the *Bot* into some public channel or private group you want to scrape its content and store them in a database:

```
/invite @ReportBot 
```

  * If you want to stop scraping the content of some channel you can run the command:

```
/remove @ReportBot 
```

  * If you want to (un)archive some projects you can run the command:

```
(un)archive [tag1] [tag2] ... [tagN]
```

  * If you want to change project's name to red, if there was no activity from set period (default is 16 days), you can run the command:

```
frequency [tag1] [frequency1] [tag2] [frequency2] ... [tagN] [frequency2]
```

  * To categorize the message under some tag you can use special tags in the format `:__some-tag:`.

## 5 Server application

### 5.1 Set-up and running

  * In the `server` folder, copy `.env.template` into `.env` and fill missing values.

  * Go into the folder `server` and run the application:

```bash
$ yarn build && yarn start
```

  * Then you can run the Client application (see the following section).

## 6 Client application

### 6.1 Set-up and running

  * Go into the folder `client` and run the application:

```bash
$ yarn build
```

## 7 Deployment

We use [Heroku](https://www.heroku.com/home) for hosting this application. When something is merged into `master` branch, it is automatically deployed. You can also deploy any branch manually from Heroku Dashboard.

Important parts regards to Heroku to note:
  - in `package.json`:
    - `engines.node` - which Node version to use
    - `scripts.heroku-postbuild` - what to run in build phase (instead of `scripts.build`)
  - in `Procfile`:
    - `web` - how to start web part of the application
    - `bot` - how to start bot (non-web) part of the application
