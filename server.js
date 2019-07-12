const express = require("express");
const app = express();

const graphqlMiddleware = require("express-graphql");
const { buildSchema } = require("graphql");

const customers = require("./data");

const port = 3000;

//REST API EXAMPLE PATH
app.get("/customers", function(req, res) {
  res.json(customers);
});

app.get("/customer/:id", function(req, res) {
  let customer = customers.filter(c => c.id == req.params.id);
  res.json(customer);
});

//GraphQL

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
    let result = customers;

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
