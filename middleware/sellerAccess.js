function sellerAccess(req, res, next) {
  if (req.session?.UserID && req.session.UserType === 'seller') {
    res.locals.name = req.session.name;
    res.locals.UserID = req.session.UserID;
    res.locals.type = 'seller';
    res.locals.sellerFlag = true;

    return next();
  }

  return res.redirect('/');
}

module.exports = sellerAccess;
