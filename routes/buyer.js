/* eslint-disable no-unreachable */
/* eslint-disable no-underscore-dangle */
const router = require('express').Router();
// const bcrypt = require('bcrypt');
// const Buyer = require('../models/buyer');
const Buscet = require('../models/buscet');
const buyerAccess = require('../middleware/buyerAccess');
const Good = require('../models/good');
const Store = require('../models/store');
const Delivery = require('../models/delivery');

router.get('/:id', buyerAccess, async (req, res) => {
  const buyerID = req.params.id;
  const deliveriesAll = await Delivery.find().populate('good').lean();
  const buscet = await Buscet.find({ buyer: buyerID }).populate('good').lean();
  res.render('deleveriesAll', { deliveriesAll, buscet });
});

router.post('/edit/:id', buyerAccess, async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  console.log(id, quantity);
  const oldDelivery = await Delivery.findById(id);
  const newQuantity = oldDelivery.quantity - quantity;
  const editDelivery = await Delivery.findByIdAndUpdate(
    id,
    {
      quantity: newQuantity,
    },
    { new: true },
  );
  console.log(editDelivery);

  return res.redirect('/buyer');

  // const editFood = await Good.findByIdAndUpdate(
  //   editDelivery.good._id,
  //   {
  //     name,
  //     art,
  //     priceIn,
  //     pic,
  //   },
  //   { new: true }
  // );
  // console.log(editFood);

  // await Store.findOneAndUpdate(
  //   { good: editFood._id },
  //   {
  //     quantity: editDelivery.quantity,
  //   },
  //   { new: true }
  // );
  // let deliveries = await Delivery.find({ seller: editDelivery.seller._id })
  //   .populate('good')
  //   .lean();
  // deliveries = deliveries.map((el) => ({
  //   ...el,
  //   summ: el.quantity * el.good.priceIn,
  // }));
  // console.log('---------------------1', editDelivery.seller._id, deliveries);
  // return res.redirect(`/seller/${editDelivery.seller._id}`);
});

// router.post('/new/add/:id', sellerAccess, async (req, res) => {
//   const { name, art, pic, priceIn, quantity } = req.body;
//   const { id } = req.params;
//   const newGood = await Good.create({
//     name,
//     art,
//     priceIn,
//     pic,
//   });
//   const newDelivery = await Delivery.create({
//     quantity,
//     seller: id,
//     good: newGood._id,
//     done: false,
//   });
//   await Store.create({
//     quantity: newDelivery.quantity,
//     good: newDelivery.good,
//   });
//   let deliveries = await Delivery.find({ seller: req.params.id })
//     .populate('good')
//     .lean();
//   deliveries = deliveries.map((el) => ({
//     ...el,
//     summ: el.quantity * el.good.priceIn,
//   }));

//   res.render('deliveriesNew', {
//     id,
//     deliveries,
//   });
// });

// router.get('/edit/:id', sellerAccess, async (req, res) => {
//   const { id } = req.params;
//   const deliveryOne = await Delivery.findById(id).populate('good').lean();

//   res.render('deliveryEdit', { deliveryOne });
// });

module.exports = router;
