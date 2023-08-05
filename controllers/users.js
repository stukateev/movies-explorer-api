const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const { handleError } = require('../utils/errors');

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => Users.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      handleError(err, next);
    });
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  return Users.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      handleError(err, next);
    });
};

const getCurrentUser = (req, res, next) => Users.findById(req.user._id)
  .orFail()
  .then((user) => res.send(user))
  .catch((err) => {
    handleError(err, next);
  });

const login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production'
          ? JWT_SECRET
          : 'secret_key_num',
        { expiresIn: '7d' },
      );
      res.send({
        token: token,
        user: {
          email: user.email,
          _id: user._id,
          name: user.name,
        },
      })
        .json({ message: `Welcome back, ${user.name}` });
    })
    .catch((err) => {
      handleError(err, next);
    });
};
const clearCookie = (req, res, next) => {
  try {
    res.clearCookie('jwt').send({ message: 'Cookie clear' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  updateProfile,
  getCurrentUser,
  login,
  clearCookie,
};
