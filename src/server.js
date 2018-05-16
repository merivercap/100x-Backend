import 'babel/polyfill';

// process.env.NODE_ENV ? process.env.NODE_ENV : process.env.NODE_ENV = 'development';
// const PORT = process.env.PORT || 3000;
// const DEPLOYMENT_STAGE = process.env.DEPLOYMENT_STAGE || 'sandbox'
const Koa = require('koa');
// const errorhandler = require('errorhandler');
// const db = require('./models/dao');
// const routes = require('./controllers');
// const fallback = require('express-history-api-fallback');
// const bodyParser = require('body-parser');
// const path = require('path');
// const http = require('http');
const compress = require('koa-compress');
const logger = require('koa-logger');
const mysql = require('mysql');
// const serve = require('koa-static');
// const route = require('koa-route');


var pool = require('./models/db');

pool.getConnection(function(err, connection) {
  console.log('getgotgone');
});

pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});


const app = new Koa();
app.use(logger());

app.use(compress());

app.use(async ctx => {
    ctx.body = 'Works!';
});

app.listen(3000);
// app.use(route.get('/', books.home));
// app.use(route.get('/books/', books.all));
// app.use(route.get('/view/books/', books.list));
// app.use(route.get('/books/:id', books.fetch));
// app.use(route.post('/books/', books.add));
// app.use(route.put('/books/:id', books.modify));
// app.use(route.delete('/books/:id', books.remove));
// app.use(route.options('/', books.options));
// app.use(route.trace('/', books.trace));
// app.use(route.head('/', books.head));

// Connect all our routes to our application
// app.use('/', routes);

// Serve static files
// app.use(serve(path.join(__dirname, 'public')));
