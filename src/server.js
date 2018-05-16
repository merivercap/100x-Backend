process.env.NODE_ENV ? process.env.NODE_ENV : process.env.NODE_ENV = 'development';
const PORT = process.env.PORT || 3000;
// const DEPLOYMENT_STAGE = process.env.DEPLOYMENT_STAGE || 'sandbox'
const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const compress = require('koa-compress');
const logger = require('koa-logger');



const app = new Koa();
const router = new Router();



app.use(logger());


// Serve static files
app.use(serve(path.join(__dirname, 'public')));
app.use(compress());

router
  .get('/', (ctx, next) => {
    ctx.body = 'hit steem api';
    console.log('hitting api');
  })

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT);
