require('dotenv').config();
process.env.NODE_ENV ? process.env.NODE_ENV : process.env.NODE_ENV = 'development';
const PORT = process.env.PORT || 3000;
const Koa = require('koa');
const koaRouter = require('koa-router');
const koaBody = require('koa-bodyparser');

const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')

const logger = require('koa-logger');
const app = new Koa();
const router = new koaRouter();

// const serve = require('koa-static');
// Serve static files
// app.use(serve(path.join(__dirname, 'public')));

const schema = require('./data/schema');


router.post('/graphql', koaBody(), graphqlKoa({ schema: schema.schema }));
router.get('/graphql', graphqlKoa({ schema: schema.schema }));

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(logger());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);
