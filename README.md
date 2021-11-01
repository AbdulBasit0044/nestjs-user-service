## Description


**Features**
- NodeJS
- TypeScript
- NestJS
- Express
- Docker (with multi stage image)
- Rest
- Swagger
- MongoDB
- Mongoose
- Jest (Unit, E2E tests)
- 100% coverage
- Stripe errors like
- gRPC
- Terminus
- Husky
- Lint-staged
- Eslint
- Prettier
- Bulletproof validation
- GitHub Actions
  - CI when open pull request, runs:
    - Tests (unit and e2e)
    - Lint repo (eslint)
  - Superlinter: it can be manually dispatched in the actions tab

## Requirements
- Docker
- Nodejs (>=14.17 or >=16)

## Installation

```bash
$ yarn
$ yarn init:dev # just in case you don't have mongodb installed
```

## Running the app

```bash
# development
$ yarn dev

# production mode
$ yarn start:prod
```

**gRPC running in localhost:50051**

**Swagger API docs running in http://localhost:4000/docs**

## Test

```bash
# unit tests
$ yarn test

# unit case for specific files
$ yarn test -- path/to/your/spec/file

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

**100% coverage**

![image](https://user-images.githubusercontent.com/30958574/143388449-b3421a1f-9801-4fc0-aca7-0edd09f6e370.png)

## Seeding local DB with mock data

1. Make sure you have a local instance of DB running
2. Check the `.env.test` file for the connections and make sure a local mongo instance is running on that port
3. Run `yarn run seed:local:load` 
4. Use the test port while running the application for debugging


This will load some mock data of `users` and `acl` entries. Feel free to play with it using and RPC client 

## Stress Testing User-Service

The tool we are using here is called [k6](https://k6.io). There are multiple ways to stress test using this tool, but here we choose to use our own local system to stress-test. Now in order to run this [stressTest.ts](test/stressTest.ts), we need to have a following list of things installed.

1. Install `GOLANG` on your machine. By visiting this [link](https://go.dev/doc/install). 
2. Now install `K6` on your machine. By running following command `brew install k6`.
3. Now run the following command `k6 run test/stressTest.ts`.

Make sure you have a instance of user-service running. 
