const router = require('express').Router();
const { check, validationResult } = require('express-validator');

// models
const Film = require('../models/Film');

// middlewares
const auth = require('../middlewares/auth');

//// ===============================================
// @route   GET /api/films
// @desc    Get films list
// @access  Public
router.get('/', async (req, res) => {
  // console.log('/api/films: ');

  //// pagination: `queryString`, not params, from url
  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 10);
  const startOffset = (page - 1) * limit; // 2 -> (2-1) *10 = 10
  const endOffset = startOffset + limit; //10 => 10+10 = 20

  try {
    // const films = await Film.find().sort({ data: -1 });
    const films = await Film.find().sort({ updatedDate: -1 });
    const total = films.length;
    const result = {
      isSuccess: true,
      page,
      limit,
      total,
      data: films,
    };

    if (total === 0) {
      res.status(200).json(result);
      return;
    }

    result.data = films.slice(startOffset, endOffset);

    res.status(200).json(result);
  } catch (err) {
    // console.log('error here: ', err);
    res.status(500).json({
      message: 'Sever Error',
      isSuccess: false,
    });
  }
});

//// ===============================================
// @route   GET /api/films/:id
// @desc    Get single film
// @access  Public
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const filmItem = await Film.findById(id);
    res.status(200).json({
      isSuccess: true,
      data: filmItem,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Sever Error',
      isSuccess: false,
    });
  }
});

//// ===============================================
// @route   POST /api/film
// @desc    Add new film
// @access  Private
router.post(
  '/',
  [
    auth,
    check('titleEn', 'English Title is required').not().isEmpty(),
    check('titleVi', 'Vietnamese Title is required').not().isEmpty(),
    check('type', 'Type film is required').not().isEmpty(),
    check('country', 'Country is required').not().isEmpty(),
    check('producer', 'Producer is required').not().isEmpty(),
    check('actor', 'Actors is required').not().isEmpty(),
    check('director', 'Director is required').not().isEmpty(),
    // check('banner', 'Banner is required').not().isEmpty(),
    // check('poster', 'Poster is required').not().isEmpty(),
    // check('quote', 'Quote is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('releaseDate', 'ReleaseDate is required').not().isEmpty().isDate(),
  ],
  async (req, res) => {
    // console.log('add new film', req.body); //// for 1st test

    //// validator fields in req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    //// Simplify errors
    // console.log('errors: ', errors);
    // return;

    // Create new item
    const filmItem = new Film({
      titleEn: req.body.titleEn,
      titleVi: req.body.titleVi,
      type: req.body.type,
      country: req.body.country,
      producer: req.body.producer,
      actor: req.body.actor,
      director: req.body.director,
      banner: req.body.banner,
      poster: req.body.poster,
      quote: req.body.quote,
      description: req.body.description,
      releaseDate: req.body.releaseDate,
    });

    try {
      const film = await filmItem.save();
      res.status(201).json({
        isSuccess: true,
        message: 'Create new film successfully!!!',
        data: film,
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
// @route   PUT /api/films/:id
// @desc    Update film
// @access  Private
router.put(
  '/:id',
  [
    auth,
    check('titleEn', 'English Title is required').not().isEmpty(),
    check('titleVi', 'Vietnamese Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('type', 'Type film is required').not().isEmpty(),
    check('country', 'Country is required').not().isEmpty(),
    check('producer', 'Producer is required').not().isEmpty(),
    check('actor', 'Actors is required').not().isEmpty(),
    check('director', 'Director is required').not().isEmpty(),
    check('banner', 'Banner is required').not().isEmpty(),
    check('poster', 'Poster is required').not().isEmpty(),
    check('quote', 'Quote is required').not().isEmpty(),
    check('releaseDate', 'ReleaseDate is required').not().isEmpty().isDate(),
  ],
  async (req, res) => {
    // validator fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    const id = req.params.id;

    // update film
    const filmItem = {};
    //// for not required properties => avoid undefied props return in res
    if (req.body.quote) filmItem.quote = req.body.quote;
    if (req.body.banner) filmItem.banner = req.body.banner;
    if (req.body.poster) filmItem.poster = req.body.poster;
    //// default required properties
    if (req.body.titleEn) filmItem.titleEn = req.body.titleEn;
    if (req.body.titleVi) filmItem.titleVi = req.body.titleVi;
    if (req.body.type) filmItem.type = req.body.type;
    if (req.body.country) filmItem.country = req.body.country;
    if (req.body.producer) filmItem.producer = req.body.producer;
    if (req.body.actor) filmItem.actor = req.body.actor;
    if (req.body.director) filmItem.director = req.body.director;
    // filmItem.banner = req.body.banner;
    // filmItem.poster = req.body.poster;
    if (req.body.releaseDate) filmItem.releaseDate = req.body.releaseDate;
    if (req.body.description) filmItem.description = req.body.description;
    filmItem.updatedDate = Date.now();

    // console.log('Update: ', filmItem);

    // save data to database
    try {
      const film = await Film.findOneAndUpdate(
        { _id: id },
        { $set: filmItem }, //// update new info in db
        { new: true }
      );

      if (!film) {
        return res.status(400).json({
          isSuccess: false,
          msg: 'Can not update film',
          data: null,
        });
      }

      res.status(200).json({
        isSuccess: true,
        msg: 'Update film successfully!!!',
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
// @route   DELETE /api/films/:id
// @desc    Delete film
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  // console.log('delete film', req.params)
  const id = req.params.id;
  try {
    const filmItem = await Film.findOneAndRemove({ _id: id });
    if (!filmItem) {
      return res.status(400).json({
        isSuccess: false,
        msg: `Can not find item`,
      });
    }
    res.status(200).json({
      isSuccess: true,
      msg: 'Delete Film Successfully!!!',
    });
  } catch (err) {
    res.status(500).json({
      msg: 'Server Error',
      isSuccess: false,
    });
  }
});

module.exports = router;
