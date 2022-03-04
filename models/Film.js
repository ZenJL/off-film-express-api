const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema(
  {
    titleEn: {
      type: String,
      required: true,
    },
    titleVi: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    producer: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    actor: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      // required: true,
      default:
        'https://www.galaxycine.vn/media/2021/12/7/1350x900_1638861163467.jpg',
    },
    poster: {
      type: String,
      // required: true,
      default:
        'https://www.galaxycine.vn/media/2021/12/7/300x450_1638861157560.jpg',
    },
    quote: {
      type: String,
      required: false,
      default: '',
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
    // date: {
    //   type: Date,
    //   default: Date.now(),
    // },
  },
  {
    capped: { size: 1024 },
    bufferCommands: false,
    autoCreate: false, // disable `autoCreate` since `bufferCommands` is false
  }
);

module.exports = mongoose.model('Film', filmSchema);
