const express = require('express')
const graphql = require('graphql')
const { graphqlHTTP } = require('express-graphql')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean
} = require('graphql')
const app = express()

const products = require('./products.json')
const users = require('./users.json')

const productType = new GraphQLObjectType({
  name: 'Product',
  fields: {
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLString) },
    color: { type: GraphQLNonNull(GraphQLString) },
    size: { type: GraphQLNonNull(GraphQLString) },
    instock: { type: GraphQLNonNull(GraphQLString) }
  }
})

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) }
  }
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    product: {
      type: productType,
      description: 'A single product',
      args: {
        id: { type: GraphQLInt },
/*         name: { type: GraphQLString },
        price: { type: GraphQLInt },
        color: { type: GraphQLString },
        size: { type: GraphQLInt },
        instock: { type: GraphQLString }, */
      },
      resolve: (_, args) => {
        return products[args.id/* , args.name, args.price, args.color, args.size, args.instock */];
      }
    },
    products: {
      type: new GraphQLList(productType),
      description: 'List of all products',
      args: {
        id: { type: GraphQLInt },
/*         name: { type: GraphQLString },
        price: { type: GraphQLInt },
        color: { type: GraphQLString },
        size: { type: GraphQLInt },
        instock: { type: GraphQLString }, */
      },
      resolve: () => (_, args) => {
        return products;
      }
    },
    user: {
      type: userType,
      description: 'A single user',
      args: {
        id: { type: GraphQLInt },
/*         name: { type: GraphQLString },
        email: { type: GraphQLString }, */

      },
      resolve: (_, args) => {
        return users[args.id/* , args.name, args.email */];
      }
    },
    users: {
      type: new GraphQLList(userType),
      description: 'List of all users',
      args: {
        id: { type: GraphQLInt },
/*         name: { type: GraphQLString },
        email: { type: GraphQLString }, */
      },
      resolve: () => (_, args) => {
        return users;
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType
})
//graphiql: true => UI
express()
  .use('/graphql', graphqlHTTP({ 
    schema: schema, 
    pretty: true, 
    graphiql: true, 
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json',},
    body: JSON.stringify({
      products, 
      users
    })
  }))
  .listen(3000), () => console.log('Server is up on port 3000');