const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');

router.use('/users', userRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => {
  const error = new Error('Service not found');
  error.statusCode = 404;
  next(error);
});

module.exports = router;
