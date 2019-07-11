const express = require("express");
const app = express();

const graphqlMiddleware = require("express-graphql");
const { graphql, buildSchema } = require("graphql");

const customers = require("./data");

const port = 3000;

// const schema = buildSchema(`
//   type Query {
//     hello : String,
//     world : String
//   }

//   type Customer {
//     firstName : String
//     lastName : String
//   }
// `);

const schema = buildSchema(`
  type Query {
    customer(id : ID!) : Customer
    customers(limit : Int = 1 , gender : String , age : AGE) : [Customer]
  }

  type Customer {
    id : Int
    firstName : String
    lastName : String
    age : Int
    gender : String
  }

  enum AGE {
    YOUNG
    OLD
  }
`);

const resolver = {
  hello() {
    return "Hello";
  },
  world() {
    return "world";
  },
  customer(args) {
    return customers.find(c => c.id == args.id);
  },
  customers(args) {
    console.log(args);

    // let result = customers;
    let result = [].concat(customers);

    if (args.gender) {
      result = result.filter(c => c.gender == args.gender);
    }

    if (args.age) {
      result =
        args.age == "YOUNG"
          ? result.filter(c => c.age <= 25)
          : result.filter(c => c.age > 25);
    }
    return result.slice(0, args.limit);
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
