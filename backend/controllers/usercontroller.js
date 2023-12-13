const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/Users');
const createToken = require('../createtoken');
const validateSocialToken = require('../validatesocialtoken.js');
const nodemailer = require('nodemailer');

// Nodemailerin konfiguraatio
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: true,
  service: 'Gmail',
  auth: {
    user: 'konsta.hasanen@gmail.com',
    pass: 'svnw bxni avsi zcvu',
  },
});

/*
Käytetään Map tietorakennetta tässä, jotta voidaan säilyttää käyttäjän tietoja väliaikaisesti, kunnes sposti on vahvistettu onnistuneesti
*/

const temporaryUserMap = new Map();

const UserController = {
  //Uuden käyttäjän rekisteröinti ja sposti varmennus nodemailerin avulla
  registerNewUser: async function (req, res, next) {
    try {
      //Tarkistetaan aluksi onko syötetty sposti jo käytössä
      const existingUser = await User.findOne({ sposti: req.body.sposti });
      if (existingUser) {
        console.error('User registration failed: Sähköposti on jo käytössä.');
        return res
          .status(500)
          .json({ success: false, message: 'Sähköposti on jo käytössä.' });
      }

      //Salasanan hashaus
      const hashedPassword = bcrypt.hashSync(req.body.salasana, 8);

      //Käyttäjä objekti, jossa vaadittavat tiedot
      const user = {
        etunimi: req.body.etunimi,
        sukunimi: req.body.sukunimi,
        sposti: req.body.sposti,
        salasana: hashedPassword,
        emailVerified: false,
        confirmationCode: crypto.randomBytes(16).toString('hex'),
      };

      // Tallenna käyttäjä väliaikaiseen tietorakenteeseen (Map)
      temporaryUserMap.set(user.confirmationCode, user);

      const confirmationLink = `http://finde.us-east-1.elasticbeanstalk.com/users/confirm/${user.confirmationCode}`;
      //Vahvistusviestin sisältö mailOptions objektissa
      const mailOptions = {
        from: 'finde@gmail.com',
        to: user.sposti,
        subject: 'Vahvista sähköpostiosoitteesi',
        html: `Tervetuloa käyttämään FindE sovellusta, klikkaa <a href="${confirmationLink}">tästä</a> vahvistaaksesi sähköpostiosoitteesi.`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error('Error sending confirmation email:', error);
        } else {
          console.log('Confirmation email sent:', info.response);
        }
      });

      res.json({
        success: true,
        message: 'Tarkista sähköpostisi vahvistaaksesi tilin.',
      });
    } catch (error) {
      console.error('User registration failed:', error);
      res.status(500).send('User registration failed.');
    }
  },

  //Spostin vahvistaminen
  confirmEmail: async function (req, res) {
    try {
      const confirmationCode = req.params.confirmationCode;

      // Tarkista, onko vahvistustunniste voimassa
      if (!temporaryUserMap.has(confirmationCode)) {
        return res.status(400).send('Vahvistustunniste ei ole voimassa.');
      }

      // Haetaan käyttäjä väliaikaisesta tallennuspaikasta
      const user = temporaryUserMap.get(confirmationCode);

      // Merkitse käyttäjän sähköposti vahvistetuksi
      user.emailVerified = true;

      // Tallenna käyttäjä pysyvään tietokantaan
      await User.create(user);

      // Poista käyttäjä väliaikaisesta tallennuspaikasta
      temporaryUserMap.delete(confirmationCode);

      res.send('Sähköposti on vahvistettu onnistuneesti.');
    } catch (error) {
      console.error('Sähköpostin vahvistus epäonnistui:', error);
      res.status(500).send('Sähköpostin vahvistus epäonnistui.');
    }
  },

  //Autentikoidaan käyttäjä
  authenticateUser: async function (req, res, next) {
    //Tarkastetaan löytyykö spostia kannasta
    try {
      const user = await User.findOne({ sposti: req.body.sposti });

      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed, user not found.',
        });
        return;
      }
      //Verrataan annettua salasanaa
      if (!bcrypt.compareSync(req.body.salasana, user.salasana)) {
        res.json({
          success: false,
          message: 'Authentication failed, incorrect password.',
        });
        return;
      }

      //Luodaan jwt-tokeni, jos autentikointi tiedot olivat oikeat
      const token = createToken(user);
      res.json({
        success: true,
        message: 'Here is the token!',
        token: token,
      });
    } catch (error) {
      console.error('Authentication failed:', error);
      res.status(500).send('Authentication failed.');
    }
  },

  //Käyttäjätietojen muokkaamiseen metodi
  editUser: async function (req, res) {
    try {
      const editUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            etunimi: req.body.etunimi,
            sukunimi: req.body.sukunimi,
          },
        },
        { new: true } // To return the updated event
      );

      if (!editUser) {
        console.log('User not found');
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('User updated successfully:', editUser);
      res.json(editUser);
    } catch (error) {
      console.log('Error editing user:', error.message);
      res.status(500).json({ error: 'Error editing user' });
    }
  },

  //Käyttäjän poistamisen metodi
  deleteUser: async (req, res) => {
    try {
      //Etsitään käyttäjä id:n perusteella, jota ollaan poistamassa
      const deleteUser = await User.findByIdAndDelete(req.params.id);
      res.json({
        success: true,
        message: 'User deleted successful ' + deleteUser,
      });
      console.log('User deleted successful');
    } catch (error) {
      console.log('Error deleting user: ' + error.message);
    }
  },
  //Kaikki käyttäjän lisäämät tapahtumat
  getUserEvents: async function (req, res) {
    try {
      const userId = req.params.id;
      console.log('User ID:', userId);

      const user = await User.findById(userId).populate('events');
      console.log('User:', user);

      if (!user) {
        return res.status(404).json({ message: 'Käyttäjää ei löytynyt.' });
      }

      console.log('User Events:', user.events);

      res.json(user.events);
    } catch (error) {
      console.error('Virhe käyttäjän tapahtumien hakemisessa:', error);
      res.status(500).send('Virhe käyttäjän tapahtumien hakemisessa.');
    }
  },
  //Kaikki käyttäjät kannasta
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}); // Haetaan kaikki käyttäjät tietokannasta
      res.json(users); // Lähetä käyttäjät JSON-muodossa
    } catch (error) {
      console.error('Virhe käyttäjien hakemisessa:', error);
      res.status(500).send('Virhe käyttäjien hakemisessa.');
    }
  },

  //Käyttäjän tykkäämät tapahtumat
  getUserLikedEvents: async function (req, res) {
    try {
      const userId = req.params.id;
      console.log('User ID:', userId);

      const user = await User.findById(userId).populate('tykatyt');
      console.log('User:', user);

      if (!user) {
        return res.status(404).json({ message: 'Käyttäjää ei löytynyt.' });
      }

      console.log('User liked events:', user.tykatyt);

      res.json(user.tykatyt);
    } catch (error) {
      console.error(
        'Virhe käyttäjän tykättyjen tapahtumien hakemisessa:',
        error
      );
      res
        .status(500)
        .send('Virhe käyttäjän tykättyjen tapahtumien hakemisessa.');
    }
  },

  //Tykkäyksen poistaminen
  removeLike: async (req, res) => {
    try {
      const userId = req.params.id;
      const eventId = req.params.eventId;

      //Käytetään pull metodia, jotta saadaan tykatty tapahtuma pois tykatyt alidokumentista
      const result = await User.findByIdAndUpdate(
        userId,
        { $pull: { tykatyt: { _id: eventId } } },
        { new: true }
      );

      //Jos käyttäjää ei löydy
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found.' });
      }

      //Jos käyttäjä ja tapahtuma löytyy
      return res.json({
        success: true,
        message: 'Event removed from liked events.',
      });
    } catch (error) {
      console.error('Error removing event from liked events:', error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error.' });
    }
  },

  /* Metodi jolla kirjaudutaan olemassa olevalla Googlen käyttäjällä
       Käyttäjän idtoken saadaan frontendistä ja se validoidaan Googlen palvelussa.
       Onnistuneen validaation tuloksena saadaan käyttäjädataa, eli userid, joka
       sijoitetaan JWT-tokeniin joka lähetetään frontendiin. Frontendissä JWT:tä
       voidaan käyttää esim. sovelluksessa liikkumiseen ja REST-apin reittien authorisaatioon.
    */
  authenticateGUser: async function (req, res, next) {
    try {
      // Googlen tokeni frontendistä
      const token = req.body.gtoken;

      // Varmistetaan, että saatu token on oikea
      const gmail = await validateSocialToken(token);

      // Tarkistetaan, onko sähköpostilla jo käyttäjä kannassa
      const existingUser = await User.findOne({ sposti: gmail });

      if (existingUser) {
        // Jos käyttäjä löytyy luodaan JWT token ja lähetetään se frontendiin
        const user = existingUser;
        const jwttoken = createToken(user);
        res.json({
          success: true,
          message: 'Google user authenticated successfully',
          token: jwttoken,
        });
      }
      // Jos käyttäjää ei löydy, luodaan uusi newUser objekti seuraavilla tiedoilla
      else {
        const newUser = {
          etunimi: 'Google',
          sukunimi: 'User',
          sposti: gmail,
          salasana: 'googlepassword',
          emailVerified: true,
        };

        // Tallennetaan käyttäjä tietokantaan
        const createdUser = await User.create(newUser);

        // Luodaan käyttäjälle JWT token ja lähetetään se frontendiin
        const user = createdUser;
        const jwttoken = createToken(user);
        res.json({
          success: true,
          message: 'Google user authenticated successfully',
          token: jwttoken,
        });
      }
    } catch (error) {
      // Virheenkäsittely, jos autenktikointi jostain syystä epäonnistuu
      console.error('Google authentication failed:', error);
      res.status(500).send('Google authentication failed.');
    }
  },
};

module.exports = UserController;
