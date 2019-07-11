const express = require("express");
const app = express();

const graphqlMiddleware = require("express-graphql");
const { graphql, buildSchema } = require("graphql");

const port = 3000;

const schema = buildSchema(`
  type Query {
    hello : String,
    world : String
  }

  type Customer {
    firstName : String
    lastName : String
  }
`);

const resolver = {
  hello() {
    return "Hello";
  },
  world() {
    return "world";
  }
};

app.use(
  "/graphql",
  graphqlMiddleware({
    schema,
    rootValue: resolver,
    graphiql: true
  })
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
