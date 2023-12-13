const Event = require('../models/Events');
const User = require('../models/Users');
const { s3 } = require('../awsConfig');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
//const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const bucketName = process.env.BUCKET_NAME;

const EventController = {
  //Kaikki tapahtumat
  findAll: async (req, res) => {
    try {
      const events = await Event.find({});
      res.json(events);
    } catch (error) {
      console.error('Error finding events:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  //Tapahtuman lisäämien
  addEvent: async (req, res) => {
    try {
      if (req.file) {
        const imageFile = req.file;

        const uploadParams = {
          Bucket: bucketName,
          Key: imageFile.originalname,
          Body: imageFile.buffer,
          ContentEncoding: 'base64',
          ContentDisposition: 'inline',
          ContentType: 'image/jpeg',
        };

        const uploadCommand = new PutObjectCommand(uploadParams);
        await s3.send(uploadCommand);

        const objectUrl = `https://${bucketName}.s3.amazonaws.com/${imageFile.originalname}`;

        // Luodaan uusi tapahtuma
        const newEvent = new Event({
          nimi: req.body.nimi,
          kuvaus: req.body.kuvaus,
          tapahtumapaikka: req.body.tapahtumapaikka,
          genre: req.body.genre,
          aloitusaika: req.body.aloitusaika,
          aloituspvm: req.body.aloituspvm,
          lopetusaika: req.body.lopetusaika,
          lopetuspvm: req.body.lopetuspvm,
          sijainti: req.body.sijainti,
          kuvaUrl: objectUrl,
        });

        try {
          //Tallennetaan tapahtuma events collectioniin
          await newEvent.save();

          //Lisätään tapahtuma users events alidokumenttiin, jotta tiedetään myöhemmin kuka on lisännyt tapahtuman
          const user = await User.findByIdAndUpdate(
            req.params.id,
            {
              $push: { events: newEvent },
            },
            { new: true } // Palautetaan päivitetty käyttäjä
          );

          // response jos lisääminen onnistuu
          res.json({ event: newEvent, user });
        } catch (error) {
          //Virheenkäsittely, jos lisääminen ei onnistu
          console.error('Error saving event or updating user:', error);
          res
            .status(500)
            .json({ error: 'Error saving event or updating user' });
        }
      } else {
        res.status(400).json({ error: 'No file provided' });
      }
    } catch (error) {
      console.error('Error adding new event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  //Tapahtuman muokkaaminen, muokataan events collectionin tapahtumaa ja samalla users collectionin events ja tykatyt alidokumentteja
  editEvent: async (req, res) => {
    try {
      //Otetaan objecturl myös tänne, jotta voidaan tarvittaessa vaihtaa myös kuvaa

      let objectUrl;

      if (req.file) {
        const imageFile = req.file;

        const uploadParams = {
          Bucket: bucketName,
          Key: imageFile.originalname,
          Body: imageFile.buffer,
          ContentEncoding: 'base64',
          ContentDisposition: 'inline',
          ContentType: 'image/jpeg',
        };

        const uploadCommand = new PutObjectCommand(uploadParams);
        await s3.send(uploadCommand);

        objectUrl = `https://${bucketName}.s3.amazonaws.com/${imageFile.originalname}`;
      }

      const updatedEvent = await Event.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            nimi: req.body.nimi,
            kuvaus: req.body.kuvaus,
            tapahtumapaikka: req.body.tapahtumapaikka,
            genre: req.body.genre,
            aloitusaika: req.body.aloitusaika,
            aloituspvm: req.body.aloituspvm,
            lopetusaika: req.body.lopetusaika,
            lopetuspvm: req.body.lopetuspvm,
            sijainti: req.body.sijainti,
            kuvaUrl: objectUrl,
          },
        },
        { new: true }
      );

      console.log('Tässä tapahtuma: ' + updatedEvent);

      //Jos tapahtumaa ei löydy tulee virhe ja suoritus päättyy
      if (!updatedEvent) {
        console.log('Event not found');
        return res.status(404).json({ error: 'Event not found' });
      }

      //Päivitetään users collectionin events alidokumenttia
      const updatedUser = await User.findOneAndUpdate(
        { 'events._id': req.params.id },
        {
          $set: {
            'events.$': updatedEvent,
          },
        },
        { new: true }
      );
      console.log('käyttäjä löydettiin' + updatedUser);
      // Update the event in the user's tykatyt array
      const updatedTykatytUser = await User.findOneAndUpdate(
        { 'tykatyt._id': req.params.id },
        {
          $set: {
            'tykatyt.$': updatedEvent,
          },
        },
        { new: true }
      );

      console.log('Event updated successfully:', updatedEvent);

      // Respond with the updated event and user
      res.json({ event: updatedEvent, user: updatedUser });
    } catch (error) {
      console.log('Error editing event:', error.message);
      res.status(500).json({ error: 'Error editing event' });
    }
  },

  //Tapahtuman poistaminen events collectionista, mutta samalla myös users events ja tykätyt alidokumentista
  deleteEvent: async (req, res) => {
    try {
      // Etsi ja poista tapahtuma events-kokoelmasta
      const deleteEvent = await Event.findByIdAndDelete(req.params.id);

      if (!deleteEvent) {
        console.log('Event not found');
        return res.status(404).json({ error: 'Event not found' });
      }

      // Poista tapahtuma käyttäjän events-alidokumentista
      const updatedUser = await User.findOneAndUpdate(
        { 'events._id': req.params.id },
        { $pull: { events: { _id: req.params.id } } },
        { new: true }
      );

      // Poista tapahtuma käyttäjän tykatyt-alidokumentista
      const updatedTykatytUser = await User.findOneAndUpdate(
        { 'tykatyt._id': req.params.id },
        { $pull: { tykatyt: { _id: req.params.id } } },
        { new: true }
      );

      console.log('Event deleted successfully');

      // Vastaa onnistuneesti poistetusta tapahtumasta ja päivitetystä käyttäjästä
      res.json({
        success: true,
        message: 'Event deleted successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.log('Error deleting event: ' + error.message);
      res.status(500).json({ error: 'Error deleting event' });
    }
  },

  // Tapahtumasta tykkääminen eli lisätään tapahtuma users tykatyt alidokumenttiin
  likeEvent: async (req, res) => {
    try {
      // Etsi käyttäjä id:n perusteella tietokannasta
      const user = await User.findById(req.params.userId);
      console.log('Käyttäjä löydettiin ' + user);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Etsi tapahtuma id:n perusteella tietokannasta
      const likedEvent = await Event.findById(req.params.id);

      if (!likedEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Tarkista onko tapahtuma jo käyttäjän tykätyissä tapahtumissa
      const isLiked = user.tykatyt.some((event) =>
        event.equals(likedEvent._id)
      );

      if (isLiked) {
        return res
          .status(400)
          .json({ error: 'Event already liked by the user' });
      }

      // Lisää tapahtuma käyttäjän tykättyihin tapahtumiin
      user.tykatyt.push(likedEvent);

      // Tallenna käyttäjä tietokantaan
      await user.save();

      res.json({ message: 'Event liked successfully', user });
    } catch (error) {
      console.log('Error liking event:', error.message);
      res.status(500).json({ error: 'Error liking event' });
    }
  },
};

module.exports = EventController;
