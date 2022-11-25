<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Dev

1. Clone repository
2. Install dependencies

```bash
yarn
# or
npm Install
```

3. Rename `.env.template` to `.env` and set environment variables to use
4. Run database container

```bash
docker compose up
# or detached
docker compose up -d
```

5. Run with hot reload

```bash
yarn start:dev
# or
npm start:dev
```

6. Use [API REST base url](http://localhost:3000/api/v1)

```bash
http://localhost:<port>/api/v1
```

7. Execute **`"SEED"`**, to fill database

```bash
http://localhost:<port>/api/v1/seed
```

8. Renew **`"JWT"`** on each login after execute step **`"7"`**

```json
// Default user when running the seed
// You can change this in src/seed/data/users.ts
{
  "username": "admin",
  "password": "Aa1234!"
}
```

8. Open [GraphQL localhost endpoint](http://localhost:3000/graphql) and set bearer token in headers

```bash
http://localhost:<port>/graphql
```

## Production container

1. Execute all steps from previous section

2. Build image

```bash
docker compose -f docker-compose.prod.yml up --build
```

3. Run image

```bash
docker compose -f docker-compose.prod.yml up
# or detached
docker compose -f docker-compose.prod.yml up -d
```

If you have an error running image because the app does not connect to the database, make sure that the env var **`DB_HOST`** has the same name as the service name in the _**`docker-compose.prod.yml`**_ file

```yml
# example
version: '3.8'

services:
  # database service name
  db:
    # ...configurations
  app:
    # ...configurations
```

```bash
# where "db" is the service name
DB_HOST=db
```

## Stack

- [Nest JS](https://github.com/nestjs/nest)
- [PostgreSQL](https://www.postgresql.org/)
- [GraphQL](https://graphql.org/)
