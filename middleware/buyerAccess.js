function buyerAccess(req, res, next) {
  if (req.session?.UserID && req.session.UserType === 'buyer') {
    res.locals.name = req.session.name;
    res.locals.UserID = req.session.UserID;
    res.locals.type = 'buyer';
    res.locals.buyerFlag = true;
    return next();
  }

  return res.redirect('/');
}

module.exports = buyerAccess;
