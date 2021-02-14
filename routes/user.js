/* eslint-disable no-unreachable */
/* eslint-disable no-underscore-dangle */
const router = require('express').Router();
const bcrypt = require('bcrypt');
const Buyer = require('../models/buyer');
const Seller = require('../models/seller');
const buyerAccess = require('../middleware/buyerAccess');
const sellerAccess = require('../middleware/sellerAccess');

// регистрация
router.post('/', async (req, res) => {
  const { name, login, password, type } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  req.session.UserType = type;

  if (type === 'buyer') {
    const buyer = await Buyer.create({ name, login, password: hashedPassword });
    req.session.UserID = buyer._id;
    return res.redirect('/user/buyer');
  }
  if (type === 'seller') {
    const seller = await Seller.create({
      name,
      login,
      password: hashedPassword,
    });
    req.session.UserID = seller._id;
    return res.redirect('/user/seller');
  }
  return res.redirect('/');
});

router.get('/buyer', buyerAccess, (req, res) => {
  res.render('buyers');
});

router.get('/seller', sellerAccess, (req, res) => {
  const _id = req.session.UserID;
  res.redirect(`/seller/${_id}`);
});

module.exports = router;
