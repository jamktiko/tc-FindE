//Reititytiedosto, johon tulvat opiskejila tietokantaa manipuloivat reitit.

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const uc = require('../controllers/usercontroller');

//http://localhost:3000/users

//Rekisteröinti
router.post('/register', uc.registerNewUser);
//Login
router.post('/login', uc.authenticateUser);
//Google kirjautuminen
router.post('/glogin', uc.authenticateGUser);
//Sähköpostin vahvistus
router.get('/confirm/:confirmationCode', uc.confirmEmail);
//Käyttäjän muokkaus
router.put('/:id', uc.editUser);
//Käyttäjän poistaminen
router.delete('/:id', uc.deleteUser);
// Reitti näyttää käyttäjän lisäämät tapahtumat
router.get('/:id', uc.getUserEvents);
// Käyttäjän tykkäämät tapahtumat
router.get('/liked/:id', uc.getUserLikedEvents);
//Tykätyn tapahtuman poistaminen tykätyistä
router.delete('/:id/:eventId', uc.removeLike);
//router.get('/', uc.getAllUsers);

/*
router.get('/', uc.findAll);
router.post('/', uc.addUser);
*/

module.exports = router;
