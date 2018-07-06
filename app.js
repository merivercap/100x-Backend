// const { ApolloEngine } = require('apollo-engine');
const app = require('./src/server');

console.log('this is the app', app);
// const { apiKey } = require('./config/apollo');
// const port = process.env.PORT || 3000;

// const engine = new ApolloEngine({ apiKey });
// engine.listen({ port }, () => 
//   console.log(`App is listening on port: ${port}`)
// );

app.listen(3000, () => console.log('hi jay bay'))