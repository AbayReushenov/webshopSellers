/* eslint-disable no-unreachable */
/* eslint-disable no-underscore-dangle */
const router = require('express').Router();
const Buscet = require('../models/buscet');
const buyerAccess = require('../middleware/buyerAccess');
const Delivery = require('../models/delivery');
const Checkout = require('../models/checkout');

router.get('/:id', buyerAccess, async (req, res) => {
  const currentbuyerID = req.params.id;
  const deliveriesAll = await Delivery.find().populate('good').lean();
  const buscet = await Buscet.find({ buyer: currentbuyerID })
    .populate('good')
    .lean();
  res.render('deleveriesAll', { deliveriesAll, buscet, currentbuyerID });
});

router.post('/edit/:idDelivery', buyerAccess, async (req, res) => {
  const currentbuyerID = req.session.UserID;
  const { idDelivery } = req.params;
  const { quantity } = req.body;
  if (quantity <= 0) {
    return res.redirect(`/buyer/${currentbuyerID}`);
  }
  const oldDelivery = await Delivery.findById(idDelivery);
  const newQuantity = Number(oldDelivery.quantity) - Number(quantity);
  const updateDelivery = await Delivery.findByIdAndUpdate(
    idDelivery,
    {
      quantity: newQuantity,
    },
    { new: true }
  );

  const findGoodInBuscet = await Buscet.findOne({
    good: updateDelivery.good,
    buyer: currentbuyerID,
  });

  if (findGoodInBuscet) {
    const buscetQuantity = Number(findGoodInBuscet.quantity) + Number(quantity);
    await Buscet.findByIdAndUpdate(
      findGoodInBuscet._id,
      {
        quantity: buscetQuantity,
      },
      { new: true }
    );
  } else if (!findGoodInBuscet) {
    await Buscet.create({
      good: updateDelivery.good,
      buyer: currentbuyerID,
      quantity,
    });
  }

  return res.redirect(`/buyer/${currentbuyerID}`);
});

router.post('/buscet/:idBuscet', buyerAccess, async (req, res) => {
  const currentbuyerID = req.session.UserID;
  const { idBuscet } = req.params;
  const { quantity } = req.body;
  const oldBuscet = await Buscet.findById(idBuscet);
  const gapQuantity = Number(quantity) - Number(oldBuscet.quantity);
  if (gapQuantity === 0) {
    return res.redirect(`/buyer/${currentbuyerID}`);
  }

  const oldDelivery = await Delivery.findOne({ good: oldBuscet.good });
  const newQuantityDelivery = oldDelivery.quantity - gapQuantity;
  await Delivery.findByIdAndUpdate(
    oldDelivery._id,
    {
      quantity: newQuantityDelivery,
    },
    { new: true }
  );
  await Buscet.findByIdAndUpdate(
    oldBuscet._id,
    {
      quantity,
    },
    { new: true }
  );

  return res.redirect(`/buyer/${currentbuyerID}`);
});

router.post('/delete/:idBuscet', buyerAccess, async (req, res) => {
  const currentbuyerID = req.session.UserID;
  const { idBuscet } = req.params;
  const oldBuscet = await Buscet.findById(idBuscet);
  const returnQuantity = Number(oldBuscet.quantity);
  await Buscet.findByIdAndDelete(oldBuscet._id);
  if (returnQuantity === 0) {
    return res.redirect(`/buyer/${currentbuyerID}`);
  }
  const oldDelivery = await Delivery.findOne({ good: oldBuscet.good });
  const newQuantityDelivery =
    Number(oldDelivery.quantity) + Number(returnQuantity);
  await Delivery.findByIdAndUpdate(
    oldDelivery._id,
    {
      quantity: newQuantityDelivery,
    },
    { new: true }
  );
  return res.redirect(`/buyer/${currentbuyerID}`);
});

router.get('/checkout/:id', buyerAccess, async (req, res) => {
  const currentbuyerID = req.params.id;
  const buscet = await Buscet.find({ buyer: currentbuyerID });
  await Checkout.insertMany(buscet);
  await Buscet.deleteMany();
  let checkout = await Checkout.find({ buyer: currentbuyerID })
    .populate('good')
    .lean();
  checkout = checkout.map((el) => ({
    ...el,
    summ: el.quantity * el.good.priceIn,
  }));
  const allsummofcheckout = checkout.reduce((a, b) => a + b.summ, 0);

  res.render('checkout', { checkout, currentbuyerID, allsummofcheckout });
});

module.exports = router;
