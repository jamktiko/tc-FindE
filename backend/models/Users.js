const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const EventSchema = require('./Events');

const userSchema = new mongoose.Schema({
  etunimi: {
    type: String,
    max: 80,
    required: true,
  },
  sukunimi: {
    type: String,
    max: 200,
    required: true,
  },
  sposti: {
    type: String,
    required: true,
    unique: true,
  },
  salasana: {
    type: String,
    required: true,
  },
  confirmationCode: {
    type: String, // Tunniste vahvistuslinkille
  },
  emailVerified: {
    type: Boolean,
    default: false, // Oletuksena sähköposti ei ole vahvistettu
  },
  events: {
    type: [EventSchema.schema],
  },
  tykatyt: {
    type: [EventSchema.schema],
  },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;
