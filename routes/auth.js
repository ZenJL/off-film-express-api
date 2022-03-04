const router = require('express').Router();
const jwt = require('jsonwebtoken');

//// ===============================================
// @route   POST /api/auth
// @desc    Authorize user
// @access  Public
router.post('/', async (req, res) => {
  const token = req.header('x-auth-token');

  //// check token
  if (!token) {
    return res.status(400).json({
      msg: 'Access Denied!',
      isAuth: false,
    });
  }

  //// verify token
  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    res.status(200).json({
      isSuccess: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Sever Error',
      isSuccess: false,
    });
  }
});

module.exports = router;
