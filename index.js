//// DONE
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

dotenv.config();

app.use(cors());

//// router to use in app.use()
const filmRoute = require('./routes/film');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

//// env
const PORT = process.env.PORT || 4000;

//// connect to db
mongoose.connect(
  process.env.DB_CONNECT,
  {
    //// for lower version of mongoose
    // useNewUrlParser: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
  },
  () => {
    console.log('Connect DB successfully !!!');
  }
);

//// routes
app.get('/', (req, res) => {
  res.send('Welcome to cms-album-film-api');
});

app.use(express.json({ extend: true }));
app.use(express.urlencoded({ extended: false })); //// for using form-urlendcoded

//// routes middlewares
app.use('/api/films', filmRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);

app.listen(PORT, () => {
  console.log(`Server Up and running localhost: ${PORT} !!!`);
});
