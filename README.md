# Report Bot

## How to run locally

  * Install and run Postgres database as a Docker container:

```bash
$ docker run --name report-bot-db -p 127.0.0.1:5432:5432 -e POSTGRES_DB=report_bot -e POSTGRES_PASSWORD=postgres -d postgres
```
  * [Create a bot for your workspace](https://get.slack.help/hc/en-us/articles/115005265703-Create-a-bot-for-your-workspace). Write down the "Bot User OAuth Access Token" (under section "OAuth & Permissions" in settings of the application, it starts with `xoxb`).

  * Create file `.env` in the root directory with the same content as you can find in `.env.sample`. Then set the value (token from the previous step) to variable `SLACK_BOT_TOKEN`.

  * Run migrations:

```bash
$ yarn knex migrate:latest
```

  * Run application:

```bash
$ yarn && yarn build && yarn start
```

## How to use bot

  * Invite bot to some channel you want to scrape its and store them in a database:

```
/invite @ReportBot 
```

  * If you want to stop scraping the content of some channel you can run the command:

```
/remove @ReportBot 
```

## Developer notes

  * How to create a new database migration, e.g. for creation of `report` table:

```bash
$ yarn knex migrate:make create_report_table
```

  * How to rollback the last batch of migrations:

```bash
$ yarn knex migrate:rollback
```
