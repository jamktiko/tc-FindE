const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
require('dotenv').config();

mongoose
  .connect(
    'mongodb+srv://konstahasanen:L1YEo7lRvQWD7GRw@finde.cg3pwpe.mongodb.net/findEdatabase',
    {
      useNewUrlParser: true, // optioita eli konffimäärityksiä
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection error: ' + err);
  });
