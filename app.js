const { ApolloEngine } = require('apollo-engine');
const koaApp = require('./src/server');
const { apiKey } = require('./config/apollo');
const port = process.env.PORT || 3000;

const engine = new ApolloEngine({ apiKey });
engine.listen({ port, expressApp }, () => 
  console.log(`App is listening on port: ${port}`)
);