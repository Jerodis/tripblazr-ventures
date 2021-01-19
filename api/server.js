const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// express
const app = express();
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));

// mongoose

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING, {
  // process.env.MONGODB_CONNECTION_STRING_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }, (err) => {
    if(err) throw err;
    console.log('MongoDB server connection established');
  }
);

// routes

app.use('/users', require('./routes/userRouter'));
app.use('/trips', require('./routes/tripRouter'));
