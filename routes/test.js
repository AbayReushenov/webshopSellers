router.post('/edit/:id', sellerAccess, async (req, res) => {
  const {
    name, art, pic, priceIn, quantity,
  } = req.body;
  const { id } = req.params;
  const editDelivery = await Delivery.findByIdAndUpdate(id, {
    quantity,
  }).populate('good');
  console.log( name, art, pic, priceIn, quantity, editDelivery );

  const editFood = await Good.findByIdAndUpdate(editDelivery.good._id, {
    name,
    art,
    priceIn,
    pic,
  });

  await Store.findOneAndUpdate(
    { good: editFood._id },
    {
      quantity: editDelivery.quantity,
    },
  );
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
