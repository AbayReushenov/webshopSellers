/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { connect } = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const hbs = require('hbs');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const sellerRouter = require('./routes/seller');
const buyerRouter = require('./routes/buyer');

const app = express();
const port = process.env.PORT ?? 3000;

app.set('view engine', 'hbs');
hbs.registerPartials(`${__dirname}/views/partials`);

app.use(express.static(path.join(process.env.PWD, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

const sessionConfig = {
  store: new FileStore(),
  key: 'sid',
  secret: 'earestdyfutiyopo4567yiuhgjkhuy786yiuhgyt7687tyug',
  resave: true,
  saveUninitialized: false,
  cookie: { expires: 600000 },
};

app.use(session(sessionConfig));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/seller', sellerRouter);
app.use('/buyer', buyerRouter);

app.listen(port, () => {
  console.log(`Сервер успешно запущен на порту ${port}.`);

  const connectionAddress = process.env.DATABASE_CONNECTION_ADDRESS
    ?? 'mongodb://localhost:27017/webshop130221';

  connect(
    connectionAddress,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log('Подлючение к базе данных успешно.');
    },
  );
});
