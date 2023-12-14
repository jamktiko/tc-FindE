<script>
  import { writable } from 'svelte/store';
  import mapboxgl from 'mapbox-gl';
  import Fileupload from '../src/Fileupload.svelte';
  import axios from 'axios';
  import { format, parse } from 'date-fns';
  import { enUS } from 'date-fns/locale';
  import { getCoordinates } from './apiService';
  import { onMount } from 'svelte';

  import Modal from './Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  import TextInput from './TextInput.svelte';

  export let toggleAddEventForm;

  const dispatch = createEventDispatcher();

  let isSubmitting = writable(false);
  let displayModal = false;
  let modalMessage = '';

  let aloituspvmInput = '';
  let aloitusaikaInput = '';
  let lopetuspvmInput = '';
  let lopetusaikaInput = '';

  let nimi = '';
  let tapahtumapaikka = '';
  let selectedGenre = '';
  let kuvaus = '';
  let aloitusaika = '';
  let lopetusaika = '';
  let katuosoite = '';
  let postinumero = '';
  let paikkakunta = '';
  let maa = '';
  let lippulinkki = 'https://';

  let selectedFile;
  const genret = ['Music', 'Sports', 'Family', 'Food'];

  let map;
  let marker;

  const initializeMap = () => {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiZjFuZGUiLCJhIjoiY2xvNzBweWx4MDE3cjJqcWdwYjJhbzJ3bCJ9.UIKEbga7Qe4BrT4-kMku3w';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Check if input fields are empty
        if (!katuosoite || !postinumero || !paikkakunta || !maa) {
          // Set map center to user's location
          map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: 15,
          });

          // Add a marker at the user's location
          marker = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map);
        } else {
          // Set map center to default coordinates if input fields are not empty
          map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [25.72088, 62.24147], // Default coordinates
            zoom: 15,
          });

          // Add a marker at the default coordinates
          marker = new mapboxgl.Marker()
            .setLngLat([25.72088, 62.24147])
            .addTo(map);
        }
      },
      (error) => {
        console.error('Error getting user location:', error);

        // Set map center to default coordinates if geolocation fails
        map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [25.72088, 62.24147], // Default coordinates
          zoom: 15,
        });

        // Add a marker at the default coordinates
        marker = new mapboxgl.Marker()
          .setLngLat([25.72088, 62.24147])
          .addTo(map);

        console.log('Map initialized with coordinates:', latitude, longitude);
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  onMount(() => {
    // Initialize map with default coordinates
    initializeMap();
  });

  const updateMapMarker = async (address) => {
    try {
      // Obtain coordinates using getCoordinates function
      const data = await getCoordinates(address);

      // Check if the map and marker are initialized
      if (!map || !marker) {
        initializeMap(data.latitude, data.longitude);
      } else {
        // Update the marker position
        marker.setLngLat([data.longitude, data.latitude]);

        // Automatically center the map to the updated marker position
        map.setCenter([data.longitude, data.latitude]);
      }
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };

  const openModal = (message) => {
    displayModal = true;
    modalMessage = message;
  };

  const closeModal = () => {
    displayModal = false;
  };

  const addEvent = async () => {
    isSubmitting.set(true);

    // Retrieve token and user id from sessionStorage
    const token = sessionStorage.getItem('token');
    const id = sessionStorage.getItem('_id');

    // Create form data
    const formData = new FormData();
    formData.append('nimi', nimi);
    formData.append('tapahtumapaikka', tapahtumapaikka);
    formData.append('genre', selectedGenre.toLowerCase());
    formData.append('kuvaus', kuvaus);
    formData.append('lippulinkki', lippulinkki);

    try {
      // Format start and end date/time
      const parsedAloituspvm = parse(
        `${aloituspvmInput}T${aloitusaikaInput}`,
        "yyyy-MM-dd'T'HH:mm",
        new Date()
      );
      const aloitusaikaFormatted = format(parsedAloituspvm, 'HH:mm');
      const aloituspvmFormatted = format(parsedAloituspvm, 'EEEE, d.MM. yyyy', {
        locale: enUS,
      });

      const parsedLopetuspvm = parse(
        `${lopetuspvmInput}T${lopetusaikaInput}`,
        "yyyy-MM-dd'T'HH:mm",
        new Date()
      );
      const lopetusaikaFormatted = format(parsedLopetuspvm, 'HH:mm');
      const lopetuspvmFormatted = format(parsedLopetuspvm, 'EEEE, d.MM. yyyy', {
        locale: enUS,
      });

      formData.append('aloitusaika', aloitusaikaFormatted);
      formData.append('aloituspvm', aloituspvmFormatted);
      formData.append('lopetusaika', lopetusaikaFormatted);
      formData.append('lopetuspvm', lopetuspvmFormatted);

      // Obtain coordinates using getCoordinates function
      const data = await getCoordinates(katuosoite, postinumero);

      console.log('Koordinatit ennen appendia:', data.latitude, data.longitude);

      // Append location data to form data
      const sijainti = [
        { name: 'katuosoite', value: katuosoite },
        { name: 'postinumero', value: postinumero },
        { name: 'paikkakunta', value: paikkakunta },
        { name: 'maa', value: maa },
        { name: 'lat', value: data.latitude },
        { name: 'long', value: data.longitude },
      ];

      formData.append('sijainti', sijainti);

      // Append individual location items
      sijainti.forEach((item) => {
        formData.append(`sijainti[${item.name}]`, item.value);
      });

      // Append image file
      formData.append('image', selectedFile);

      // Set headers
      const headers = {
        'x-access-token': token,
      };

      // Make axios POST request
      const response = await axios.post(
        `https://backendwithlogin-1-u7980985.deta.app/events/${id}`,
        formData,
        { headers }
      );

      // Reset form fields
      resetFormFields();

      // Initialize map with new coordinates
      initializeMap(data.latitude, data.longitude);

      // Display success message
      openModal('Event added successfully!');
      isSubmitting.set(false);

      // Dispatch eventAdded after a delay
      setTimeout(() => {
        dispatch('eventAdded');
      }, 2000);
    } catch (error) {
      // Handle errors
      console.error(error);
      openModal('Oops! Something went wrong.');
      isSubmitting.set(false);
    }
  };

  // Function to reset form fields
  const resetFormFields = () => {
    nimi = '';
    tapahtumapaikka = '';
    selectedGenre = '';
    kuvaus = '';
    aloitusaika = '';
    lopetusaika = '';
    katuosoite = '';
    postinumero = '';
    paikkakunta = '';
    maa = '';
    lippulinkki = '';
    selectedFile = null;
  };

  function handleFileSelected(event) {
    selectedFile = event.detail;
    console.log(event);
  }
</script>

<svelte:head>
  <link
    href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css"
    rel="stylesheet"
  />
</svelte:head>

{#if $isSubmitting}
  <div class="overlay">
    <div class="loader" />
  </div>
{/if}

{#if displayModal}
  <div class="overlay">
    <Modal
      message={modalMessage}
      on:closeModal={closeModal}
      showButtons={false}
    />
  </div>
{/if}

<div class="register-container">
  <h1>Add a new event</h1>
  <hr class="separator" />
  <button on:click={toggleAddEventForm} class="backButton">Go back</button>
  <div class="input-box">
    <label for="name" class="label-text" />
    Event name
    <input
      type="text"
      id="name"
      name="name"
      placeholder="Name"
      autocomplete="name"
      bind:value={nimi}
    />
  </div>

  <div class="input-box">
    <label for="location" class="label-text" />
    Event location
    <input
      type="text"
      id="location"
      name="location"
      placeholder="Location (e.g. name of the venue)"
      autocomplete="name"
      bind:value={tapahtumapaikka}
    />
  </div>

  <div class="select">
    <p>Genre</p>
    <select bind:value={selectedGenre}>
      <option disabled selected value="">Select a genre</option>
      {#each genret as genre}
        <option value={genre}>{genre}</option>
      {/each}
    </select>
  </div>

  <div class="textarea">
    <label for="description" class="label-text" />
    <p>Event description</p>
    <TextInput
      id="description"
      type="textarea"
      label=""
      rows="5"
      cols="10"
      bind:value={kuvaus}
    />
  </div>

  <br />
  <div class="input-box">
    <label for="aloituspvm" class="label-text" />
    <p class="event-date">Event start date</p>
    <input
      type="date"
      id="aloituspvm"
      name="aloituspvm"
      autocomplete=""
      bind:value={aloituspvmInput}
    />

    <p class="event-time">Event start time</p>
    <input
      type="time"
      id="aloitusaika"
      name="aloitusaika"
      autocomplete=""
      bind:value={aloitusaikaInput}
    />
  </div>

  <hr class="separator" />
  <div class="input-box">
    <label for="lopetuspvm" class="label-text" />
    <p class="event-date">Event end date</p>
    <input
      type="date"
      id="lopetuspvm"
      name="lopetuspvm"
      autocomplete=""
      bind:value={lopetuspvmInput}
    />
    <p class="event-time">Event end time</p>
    <input
      type="time"
      id="lopetusaika"
      name="lopetusaika"
      autocomplete=""
      bind:value={lopetusaikaInput}
    />
  </div>

  <br />
  <div class="input-box">
    <label for="address" class="label-text" />
    Event address:
    <input
      type="text"
      id="address"
      name="Street address"
      placeholder="Street address"
      autocomplete=""
      bind:value={katuosoite}
      on:input={() =>
        updateMapMarker(
          `${katuosoite}, ${postinumero}, ${paikkakunta}, ${maa}`
        )}
    />
  </div>

  <div class="input-box">
    <label for="postalcode" class="label-text" />
    <input
      type="text"
      id="postalcode"
      name="Postal code"
      placeholder="Postal code"
      autocomplete=""
      bind:value={postinumero}
      on:input={() =>
        updateMapMarker(
          `${katuosoite}, ${postinumero}, ${paikkakunta}, ${maa}`
        )}
    />
  </div>

  <div class="input-box">
    <label for="city" class="label-text" />
    <input
      type="text"
      id="city"
      name="City"
      placeholder="City"
      autocomplete=""
      bind:value={paikkakunta}
    />
  </div>

  <div class="input-box">
    <label for="country" class="label-text" />
    <input
      type="text"
      id="country"
      placeholder="Country"
      autocomplete="Country"
      bind:value={maa}
    />
  </div>

  <div id="map" />

  <div class="input-box">
    Link to buy tickets:
    <input
      type="text"
      id="tickets"
      name="Link to tickets"
      placeholder="https://"
      autocomplete=""
      bind:value={lippulinkki}
    />
  </div>

  <Fileupload {selectedFile} on:fileSelected={handleFileSelected} />
  <div class="button-container">
    <br />
    <button on:click={addEvent} class="addButton"> Add event!</button>
  </div>
</div>

<style>
  .separator {
    border: none;
    border-top: 2px solid #ffffff;
    opacity: 60%;
    width: 100%;
    background-color: #f8efd6;
  }

  .backButton {
    margin-bottom: 5%;
    color: white;
    background-color: rgb(0, 0, 0);
    border-radius: 20px;
    border: 2px solid #323439;
    padding: 6px 10px;
    margin-top: 10px;
    font-size: 1rem;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
    width: 60%;
    cursor: pointer;
    transition: background-color 0.7s ease-in-out;
  }

  .backButton:hover {
    color: black;
    background-color: white;
    border-radius: 20px;
    border: 2px solid #323439;
    padding: 6px 10px;
    margin-top: 10px;
    font-size: 1rem;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
    width: 60%;
    cursor: pointer;
    transition: background-color 0.7s ease-in-out;
  }

  .register-container {
    width: 100%;
    max-width: 400px;
    padding: 20px;
    background-color: #38393f;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  input[type='text'] {
    width: 100%;
    margin: auto;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 5px 0; /* Adjust the margin to control the space above and below the line */
  }

  input {
    box-sizing: border-box;
    color: black;
  }

  .input-box {
    text-align: left;
    margin-top: 5px;
    margin-bottom: 20px;
  }

  hr {
    border: none; /* Remove the default border */
    border-top: 1px solid #333; /* Add your desired border style and color */
    opacity: 30%;
    margin: 20px 0; /* Adjust the margin to control the space above and below the line */
  }
  .select {
    position: relative;
    width: 110px; /* Adjust the width as needed */
    margin-bottom: 20px;
    color: black;
    text-align: left;
  }

  select {
    color: black;
    width: 100%;
    padding: 2px;
    border: 1px solid #ddd;
    border-radius: 5px;
    outline: none;
    appearance: none;
    background-color: #fff;
    cursor: pointer;
    transition: border-color 0.3s;
  }

  select:hover,
  select:focus {
    border-color: #007bff; /* Highlight border color on hover or focus */
  }

  h1 {
    font-size: 3vh;
    margin-top: 25px;
    margin-bottom: -15px;
  }

  p {
    color: #f8efd6;
  }

  .addButton {
    color: white;
    background-color: black;
    border-radius: 20px;
    border: 2px solid #323439;
    padding: 6px 10px;
    margin-top: 10px;
    font-size: 1rem;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
    width: 80%;
    cursor: pointer;
    transition: background-color 0.7s ease-in-out;
  }

  .addButton:hover {
    color: black;
    background-color: white;
    border-radius: 20px;
    border: 2px solid #323439;
    padding: 6px 10px;
    margin-top: 10px;
    font-size: 1rem;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
    width: 80%;
    cursor: pointer;
    transition: background-color 0.7s ease-in-out;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loader {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #fff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
  }

  .textarea {
    text-align: left;
    margin-top: 5px;
    border-radius: 3px;
    color: black;
  }

  #map {
    height: 250px;
    width: 100%; /* Adjust the percentage as needed */
    max-width: 400px; /* Optional: Set a max-width for larger screens */
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* New styles for event date and time */
  .event-date {
    font-size: 1.2rem;
    color: #f8efd6;
    margin-bottom: 5px;
  }

  .event-time {
    font-size: 1.2rem;
    color: #f8efd6;
    margin-bottom: 5px;
  }

  input[type='date'],
  input[type='time'] {
    width: 100%;
    margin: 5px 0;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #43464d;
    color: #f8efd6;
  }

  input[type='date']::-webkit-inner-spin-button,
  input[type='date']::-webkit-calendar-picker-indicator,
  input[type='time']::-webkit-inner-spin-button,
  input[type='time']::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='date']::-webkit-calendar-picker-indicator,
  input[type='time']::-webkit-calendar-picker-indicator {
    background: none;
  }

  input[type='date']::-moz-calendar-picker-indicator,
  input[type='time']::-moz-calendar-picker-indicator {
    display: none;
  }
</style>
