function buyerAccess(req, res, next) {
  if (req.session?.UserID && req.session.UserType === 'buyer') {
    res.locals.name = req.session.name;
    res.locals.type = 'buyer';
    return next();
  }

  return res.redirect('/');
}

module.exports = buyerAccess;
