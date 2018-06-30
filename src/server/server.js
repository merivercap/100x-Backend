require('dotenv').config();
const PORT = process.env.PORT || 3000;
const Koa = require('koa');
const koaRouter = require('koa-router');
const koaBody = require('koa-bodyparser');
const cors = require('koa-cors');

const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')

const logger = require('koa-logger');
const app = new Koa();
const router = new koaRouter();

// const serve = require('koa-static');
// Serve static files
// app.use(serve(path.join(__dirname, 'public')));

const schema = require('../db/schema');


router.post('/graphql', koaBody(), graphqlKoa({ schema }));
router.get('/graphql', graphqlKoa({ schema }));

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(logger());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(cors());
app.listen(PORT);
