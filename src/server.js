const AWSXRay = require('./services/tracer');
const { ApolloServer } = require('apollo-server');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const koaBodyParser = require('koa-bodyparser');
const koaLogger = require('koa-logger');
const helmet = require('helmet');
// const routes = require('./controllers');
const cors = require('./middlewares/cors');
const logger = require('./services/logger');
const schema = require('./controllers/graphql');

const { User } = require('./models/sequelize').User;
const UserAuthentication = require('./services/userAuthentication');

const app = new Koa();
const router = new KoaRouter();

const config = require('./config/config');

// Apollo GraphQL
const server = new ApolloServer({
  context: async ({ req }) => {
    try {
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      if (!token) {
        return {}; // Return empty object - users can still access public queries
      }
      const authenticatedUserInstance = new UserAuthentication();
      const user = await authenticatedUserInstance.verifyTokenApiCall(token); // user is user in our db.
      return { authenticatedUserInstance };
    }
    catch (error) {
      switch(error.error_description) {
        case 'todo-get-expired-token-code':
          throw new Error('EXPIRED_TOKEN');
        case 'The token has invalid role':
          throw new Error('INVALID TOKEN');
        default:
          throw new Error('SERVER_ERROR');
      }
    }
  },
  formatError: error => {
    logger.error('GraphQL Error Message: ', error.message);
    return error;
  },
  schema,
});



server.listen(config.server.port).then(({ url }) => {
  console.log('server is listening to localhost', url)
})

// Security middleware
app.use(cors, helmet());
app.use(koaLogger());

// // // Graphql
router.post('/graphql', koaBodyParser(), graphqlKoa({ schema }));
router.get('/graphql', graphqlKoa({ schema }));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

// // Parsers
// app.use(
//   koaBodyParser.json({ limit: '50mb' }),
//   koaBodyParser.urlencoded({ extended: false }) // Might not need this
// );

// // Apollo Server Middleware
// server.applyMiddleware({ app });

// // Connect routes
app.use(router.routes());
app.use(router.allowedMethods());

app.use((req, res) => res.status(404).json({ msg: '404: Sorry cant find that!' }));

app.use((err, req, res, next) => {
  logger.error(err.stack);
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({ msg: err.message });
});

module.exports = {
  app: server
}
