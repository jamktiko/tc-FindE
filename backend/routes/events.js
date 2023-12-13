const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const ec = require('../controllers/eventcontroller');
const authorize = require('../verifytoken');
const multer = require('multer');

// Määrittele multerin tallennusasetukset
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//http://localhost:3000/events

//Kaikki eventit
router.get('/', ec.findAll);

//Eventin lisäys
router.post('/:id', authorize, upload.single('image'), ec.addEvent);

//Eventin poisto, dynaaminen reittiparametri
router.delete('/:id', authorize, ec.deleteEvent);

//Eventin muokkaus, dynaaminen reittiparametri
router.put('/:id', authorize, ec.editEvent);

//Eventistä tykkääminen
router.post('/:userId/:id', ec.likeEvent);

module.exports = router;
