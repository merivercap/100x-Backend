const AWSXRay = require('./services/tracer');
const { ApolloServer } = require('apollo-server');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const koaBodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const helmer = require('helmet');
// const routes = require('./controllers');
const cors = require('./middlewares/cors');
const logger = require('./services/logger');
const schema = require('../db/schema');
// const schema = require('./controllers/graphql/schemas');
const { User } = require('./models/sequelize');

const app = new Koa();
const router = new KoaRouter();

// Apollo GraphQL
const server = new ApolloServer({
  context: async ({ req }) => {
    try {
      // 
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      if (!token) {
        return {}; // Return empty object - users can still access public queries
      }
      /**
       * TODO:
       * Validate token with Steem here
       * const { uid } = await steem.verifyTokenApiCall(token);
       */
      // Get User model from db and pass through context for secure queries/mutations
      const user = await User.findOne({ where: { id: uid } });
      return { user }; 
    }
    catch (error) {
      /**
       * TODO:
       * check error.code received from steem verify call and update case statement
       */
      switch(error.code) {
        case 'verify-token-failure-code':
          throw new Error('EXPIRED_TOKEN');
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

// Security middleware
app.use(cors, helmet());

// Graphql
router.post('/graphql', koaBody(), graphqlKoa({ schema }));
router.get('/graphql', graphqlKoa({ schema }));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

// Parsers
app.use(logger());

// Connect routes 
app.use(router.routes());
app.use(router.allowedMethods());

// Apollo Server Middleware
server.applyMiddleware({ app });

app.use((req, res) => res.status(404).json({ msg: '404: Sorry cant find that!' }));

app.use((err, req, res, next) => {
  logger.error(err.stack);
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({ msg: err.message });
});

module.exports = app;
