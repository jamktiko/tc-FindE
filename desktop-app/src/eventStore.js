import { writable } from 'svelte/store';
import axios from 'axios';

// Alusta tapahtumien tallennukseen tarkoitettu store
export const events = writable([]);

// Lisää funktio, jolla voit lisätä uuden tapahtuman

const userUrl = 'https://backendwithlogin-1-u7980985.deta.app/users';
// Haetaan tapahtumat käyttäjän id:n perusteella
export const getEventsById = async (id) => {
  try {
    const response = await axios.get(`${userUrl}/${id}`);

    return response.data; // Palautetaan saatu data
  } catch (error) {
    console.error('Error fetching events by ID', error);
    throw error; // Voit käsitellä virhettä täällä tai antaa sen jatkua kutsuvan koodin hallittavaksi
  }
};
