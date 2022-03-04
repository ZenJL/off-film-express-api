const router = require('express').Router(); //// doneeeeeeeeee
const { check, validationResult } = require('express-validator'); //// doneeeeeeeeee
const bcrypt = require('bcrypt'); //// doneeeeeeeeee
const jwt = require('jsonwebtoken'); //// doneeeeeeeeee

// models
const User = require('../models/User'); //// doneeeeeeeeee

const auth = require('../middlewares/auth'); //// doneeeeeeeeee

//// ===============================================
// @Route   POST /api/users/register
// @desc    Register new user
// @access  Public
router.post(
  '/register',
  check('firstName', 'First Name is required').not().isEmpty(),
  check('lastName', 'Last Name is required').not().isEmpty(),
  check('gender', 'Gender is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
  check('email', 'Email must correct format').not().isEmpty().isEmail(),

  async (req, res) => {
    // validator fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    // console.log('errors: ', errors);

    // check email existed
    const emailExist = await User.findOne({
      email: req.body.email,
    });

    if (emailExist) {
      return res.status(400).json({
        msg: 'Email already exists',
        isSuccess: false,
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // console.log('add new film', req.body);

    // Create new item
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      email: req.body.email,
      password: hashedPassword,
    });

    try {
      await user.save();
      res.status(201).json({
        message: 'Register successfully !!!',
        isSuccess: true,
      });
    } catch {
      res.status(500).json({
        message: 'Sever Error',
        isSuccess: false,
      });
    }
  }
);

//// ===============================================
// @Route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  check('password', 'Password is required').not().isEmpty(),
  check('email', 'Email must correct format').not().isEmpty().isEmail(),

  async (req, res) => {
    // validator fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    // validation email
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(400).json({
        msg: 'Email or password incorrect',
        isSuccess: false,
      });
    }

    // validation pass
    const password = await bcrypt.compare(req.body.password, user.password);

    if (!password) {
      return res.status(400).json({
        msg: 'Email or password incorrect',
        isSuccess: false,
      });
    }

    //// create and assign token
    const payload = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      { expiresIn: 36000 },
      (error, token) => {
        if (error) throw error;
        res.header('x-auth-token', token).json({
          isSuccess: true,
          msg: 'Login Successfully!!!',
          token,
        });
      }
    );
  }
);

//// ===============================================
// @route   GET /api/users  ========
// @desc    Get users list
// @access  Public
router.get('/', async (req, res) => {
  //// pagination
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);

  const startOffset = (page - 1) * limit;
  const endOffset = startOffset + limit;

  try {
    // const users = await User.find().sort({ data: -1 });
    const users = await User.find().sort({ updatedDate: -1 });
    const total = users.length;
    const resultUsers = {
      isSuccess: true,
      page,
      limit,
      total,
      data: users,
    };

    if (total === 0) return res.status(200).json(resultUsers);
    resultUsers.data = users.slice(startOffset, endOffset);

    res.status(200).json(resultUsers);
  } catch (err) {
    // console.log('error: ', err);
    res.status(500).json({
      message: 'Sever Error, Can Not Get Users List',
      isSuccess: false,
    });
  }
});

//// ===============================================
// @route   GET /api/users/:id  ========
// @desc    Get single user
// @access  Public
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const userItem = await User.findById(id);

    res.status(200).json({
      isSuccess: true,
      data: userItem,
    });
  } catch (err) {
    // console.log('error: ', err);
    res.status(500).json({
      message: 'Sever Error',
      isSuccess: false,
    });
  }
});

//// ===============================================
// @route   PUT /api/users/:id  ========
// @desc    Update single user
// @access  Public
router.put(
  '/:id',
  [
    auth,
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('gender', 'Gender is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email must correct format').not().isEmpty().isEmail(),
  ],
  async (req, res) => {
    // validator fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    const id = req.params.id;

    // update user
    const userItem = {};
    if (req.body.avatar) filmItem.avatar = req.body.avatar;
    if (req.body.password) {
      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      userItem.password = hashedPassword;
    }

    userItem.firstName = req.body.firstName;
    userItem.lastName = req.body.lastName;
    userItem.gender = req.body.gender;
    userItem.email = req.body.email;
    userItem.updatedDate = Date.now();

    //// save to database
    try {
      const user = await User.findOneAndUpdate(
        { _id: id },
        { $set: userItem },
        { new: true }
      );

      if (!user) {
        return res.status(400).json({
          isSuccess: false,
          msg: 'Can not update user',
          data: null,
        });
      }

      res.status(200).json({
        isSuccess: true,
        msg: 'Update user successfully !!!',
      });
    } catch (err) {
      res.status(500).json({
        message: 'Sever Error',
        isSuccess: false,
      });
    }
  }
);

//// ===============================================
// @route   DELETE /api/users/:id   ========
// @desc    Delete user
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    const userItem = await User.findOneAndRemove({ _id: id });
    if (!userItem) {
      return res.status(400).json({
        isSuccess: false,
        msg: 'Can not find item',
      });
    }
    res.status(200).json({
      isSuccess: true,
      msg: 'Delete User Successfully!!!',
    });
  } catch (err) {
    res.status(500).json({
      msg: 'Server Error',
      isSuccess: false,
    });
  }
});

module.exports = router;
