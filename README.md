# Report Bot

## How to run locally

  * Install and run Postgres database as a Docker container:

```bash
$ docker run --name report-bot-db -p 127.0.0.1:5432:5432 -e POSTGRES_DB=report_bot -e POSTGRES_PASSWORD=postgres -d postgres
```

  * Create file `.env` in the root directory with the same content as you can find in `.env.sample`. Then set value to variable `SLACK_BOT_TOKEN`.

  * Run migrations:

```bash
$ yarn knex migrate:latest
```

  * Run application:

```bash
$ yarn && yarn bulid && yarn start
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
