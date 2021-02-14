/* eslint-disable no-unreachable */
/* eslint-disable no-underscore-dangle */
const router = require('express').Router();
// const bcrypt = require('bcrypt');
// const Buyer = require('../models/buyer');
const Delivery = require('../models/delivery');
const sellerAccess = require('../middleware/sellerAccess');
const Good = require('../models/good');
const Store = require('../models/store');

router.get('/:id', sellerAccess, async (req, res) => {
  const { id } = req.params;
  let deliveries = await Delivery.find({ seller: id }).populate('good').lean();
  deliveries = deliveries.map((el) => ({
    ...el,
    summ: el.quantity * el.good.priceIn,
  }));

  res.render('deliveries', { deliveries });
});

router.get('/new/:id', sellerAccess, async (req, res) => {
  const { id } = req.params;
  let deliveries = await Delivery.find({ seller: req.params.id })
    .populate('good')
    .lean();
  deliveries = deliveries.map((el) => ({
    ...el,
    summ: el.quantity * el.good.priceIn,
  }));
  res.render('deliveriesNew', {
    id,
    deliveries,
  });
});

router.post('/new/add/:id', sellerAccess, async (req, res) => {
  const { name, art, pic, priceIn, quantity } = req.body;
  const { id } = req.params;
  const newGood = await Good.create({
    name,
    art,
    priceIn,
    pic,
  });
  const newDelivery = await Delivery.create({
    quantity,
    seller: id,
    good: newGood._id,
    done: false,
  });
  await Store.create({
    quantity: newDelivery.quantity,
    good: newDelivery.good,
  });
  let deliveries = await Delivery.find({ seller: req.params.id })
    .populate('good')
    .lean();
  deliveries = deliveries.map((el) => ({
    ...el,
    summ: el.quantity * el.good.priceIn,
  }));

  res.render('deliveriesNew', {
    id,
    deliveries,
  });
});

router.get('/edit/:id', sellerAccess, async (req, res) => {
  const { id } = req.params;
  const deliveryOne = await Delivery.findById(id).populate('good').lean();

  res.render('deliveryEdit', { deliveryOne });
});

router.post('/edit/:id', sellerAccess, async (req, res) => {
  const { id } = req.params;
  const { name, art, pic, priceIn, quantity } = req.body;
  const editDelivery = await Delivery.findByIdAndUpdate(
    id,
    {
      quantity,
    },
    { new: true }
  );
  console.log(editDelivery);

  const editFood = await Good.findByIdAndUpdate(
    editDelivery.good._id,
    {
      name,
      art,
      priceIn,
      pic,
    },
    { new: true }
  );
  console.log(editFood);

  await Store.findOneAndUpdate(
    { good: editFood._id },
    {
      quantity: editDelivery.quantity,
    },
    { new: true }
  );
  let deliveries = await Delivery.find({ seller: editDelivery.seller._id }).populate('good').lean();
  deliveries = deliveries.map((el) => ({
    ...el,
    summ: el.quantity * el.good.priceIn,
  }));
  console.log('---------------------1', editDelivery.seller._id, deliveries);
  return res.redirect(`/seller/${editDelivery.seller._id}`);
});

module.exports = router;
