// process.env.NODE_ENV ? process.env.NODE_ENV : process.env.NODE_ENV = 'development';
const PORT = process.env.PORT || 3000;
// const DEPLOYMENT_STAGE = process.env.DEPLOYMENT_STAGE || 'sandbox'
const Koa = require('koa');
const koaRouter = require('koa-router');
const koaBody = require('koa-bodyparser');

const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')
// const errorhandler = require('errorhandler');
// const fallback = require('express-history-api-fallback');
// const path = require('path');
// const http = require('http');
// const compress = require('koa-compress');
// const logger = require('koa-logger');
// const mysql = require('mysql');

const app = new Koa();
const router = new koaRouter();

// const serve = require('koa-static');

const schema = require('./data/schema');


router.post('/graphql', koaBody(), graphqlKoa({ schema: schema.schema }));
router.get('/graphql', graphqlKoa({ schema: schema.schema }));

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);

// Serve static files
// app.use(serve(path.join(__dirname, 'public')));
