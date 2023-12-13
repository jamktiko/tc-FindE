const mongoose = require('mongoose');

const AddresSchema = new mongoose.Schema({
  katuosoite: {
    type: String,
    max: 100,
    required: true,
  },

  postinumero: {
    type: Number,
    required: true,
  },

  paikkakunta: {
    type: String,
    max: 30,
    required: true,
  },

  maa: {
    type: String,
    max: 30,
    required: true,
  },
});

const Addres = mongoose.model('Addres', AddresSchema);
module.exports = Addres;
