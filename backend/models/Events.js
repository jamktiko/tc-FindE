const mongoose = require('mongoose');
const AddresSchema = require('./Address');

const eventSchema = new mongoose.Schema({
  nimi: {
    type: String,
    max: 150,
    required: true,
  },
  kuvaus: {
    type: String,
    max: 500,
    required: true,
  },
  tapahtumapaikka: {
    type: String,
    max: 150,
    required: true,
  },
  genre: {
    type: String,
    enum: ['music', 'sports', 'family', 'food'],
  },
  aloitusaika: {
    type: String,
  },
  aloituspvm: {
    type: String,
  },
  lopetusaika: {
    type: String,
  },
  lopetuspvm: {
    type: String,
  },
  sijainti: {
    type: [AddresSchema.schema],
  },
  kuvaUrl: {
    type: String,
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
