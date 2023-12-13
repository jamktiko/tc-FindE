import axios from 'axios';

export const getCoordinates = async (address) => {
  // Haetaan koordinaatit köyttäen Mapbox Geocoding APIa
  // Funktio palauttaa ´koordinaatit muuttujiin 'latitude' ja 'longitude'
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=pk.eyJ1IjoiZjFuZGUiLCJhIjoiY2xvNzBweWx4MDE3cjJqcWdwYjJhbzJ3bCJ9.UIKEbga7Qe4BrT4-kMku3w`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const coordinates = data.features[0].center;
      const latitude = coordinates[1];
      const longitude = coordinates[0];

      return { latitude, longitude };
    } else {
      throw new Error('No coordinates found for the provided address');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    // Autentikaatio-tokenin haku sessionStoragesta
    const token = sessionStorage.getItem('token');

    // Token lisätään delete-pyynnön headeriin
    const response = await axios.delete(
      `https://backendwithlogin-1-u7980985.deta.app/events/${id}`,
      {
        headers: {
          'x-access-token': token,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export async function registerUser(etunimi, sukunimi, sposti, salasana) {
  return await axios.post(
    'http://finde.us-east-1.elasticbeanstalk.com/users/register',
    {
      etunimi: etunimi,
      sukunimi: sukunimi,
      sposti: sposti,
      salasana: salasana,
    }
  );

  // Axios automatically throws an error for non-2xx responses
  /* const responseData = response.data;
    return responseData;
  } catch (error) {
    // Axios error handling
    if (error.response) {
      throw new Error(`Registration failed: ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('No response received from the server');
    } else {
      throw new Error(`Error during registration: ${error.message}`);
    }
  }*/
}

// export const editEvent = async (id, eventData) => {
//   try {
//     const response = await axios.put(
//       `https://your-backend-api/events/${id}`,
//       eventData
//     );
//     return response.data; // Modify this based on your backend response format
//   } catch (error) {
//     throw error;
//   }
// };
