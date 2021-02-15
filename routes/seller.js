/* eslint-disable no-unreachable */
/* eslint-disable no-underscore-dangle */
const router = require('express').Router();
const Delivery = require('../models/delivery');
const sellerAccess = require('../middleware/sellerAccess');
const Good = require('../models/good');

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

  await Delivery.create({
    quantity,
    seller: id,
    good: newGood._id,
    done: false,
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

  await Good.findByIdAndUpdate(
    editDelivery.good._id,
    {
      name,
      art,
      priceIn,
      pic,
    },
    { new: true }
  );

  let deliveries = await Delivery.find({ seller: editDelivery.seller._id })
    .populate('good')
    .lean();
  deliveries = deliveries.map((el) => ({
    ...el,
    summ: el.quantity * el.good.priceIn,
  }));
  return res.redirect(`/seller/${editDelivery.seller._id}`);
});

module.exports = router;
