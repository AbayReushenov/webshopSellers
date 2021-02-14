/* eslint-disable no-underscore-dangle */
const router = require('express').Router();
const bcrypt = require('bcrypt');
const Buyer = require('../models/buyer');
const Seller = require('../models/seller');
// const { route } = require('./user');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { login, password, type } = req.body;

  if (type === 'buyer') {
    const buyer = await Buyer.findOne({ login });
    if (!buyer || !(await bcrypt.compare(password, buyer?.password))) {
      // В идеале, нужно написать пользователю, что логин/пароль - неверен.
      return res.redirect('/');
    }
    req.session.UserID = buyer._id;
    req.session.UserType = 'buyer';
    req.session.name = buyer.name;
    return res.redirect('/user/buyer');
  }

  if (type === 'seller') {
    const seller = await Seller.findOne({ login });
    if (!seller || !(await bcrypt.compare(password, seller?.password))) {
      // В идеале, нужно написать пользователю, что логин/пароль - неверен.
      return res.redirect('/');
    }
    req.session.UserID = seller._id;
    req.session.UserType = 'seller';
    req.session.name = seller.name;
    return res.redirect('/user/seller');
  }

  return res.redirect('/');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/logout', (req, res) => {
  // Удаляем сессию с сервера (или базы данных, если сессия хранится там).
  req.session.destroy();
  // Говорим клиенту, чтобы он удалил куку.
  res.clearCookie('sid');
  res.redirect('/');
});

module.exports = router;
