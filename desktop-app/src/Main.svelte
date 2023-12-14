<script>
  import AddEvent from './AddEvent.svelte';
  import Sidebar from './Sidebar.svelte';
  import { events, getEventsById } from './eventStore.js';
  import EventCard from './EventCard.svelte';
  import { onMount } from 'svelte';

  export let submitEvent;

  let showAddEventForm = false;
  let showAddEventButton = true;
  let noEvents = true;
  let event;
  // Haetaan kannasta tapahtumat aina kun komponentti alustetaan
  // Event-muuttujaan tulee taulukko tapahtuma-objekteja
  // getEventsById-funktio on eventStoressa ja sitä käytetään alustuksen yhteydessä
  onMount(async () => {
    try {
      let id = sessionStorage.getItem('_id');
      const result = await getEventsById(id);
      event = result;
      events.set([...result]);
    } catch (error) {
      // Käsittele virhe täällä tarvittaessa
      console.error('Virhe haettaessa tapahtumaa ID:n perusteella', error);
    }
  });
  // Tarkista storen sisältö käyttäjän kirjautuessa sisään
  $: noEvents = $events.length === 0;

  function handleEventAdded() {
    showAddEventForm = !showAddEventForm; // Eventform suljetaan
  }

  function toggleAddEventForm() {
    showAddEventForm = !showAddEventForm;
    showAddEventButton = !showAddEventButton;
  }

  const logout = () => {
    registering = false;
    outService.logoutUser();
  };

  $: console.log($events);
</script>

<Sidebar />

{#if showAddEventForm}
  <div class="transparent-box">
    <AddEvent
      on:logout={logout}
      on:submitEvent={submitEvent}
      on:eventAdded={handleEventAdded}
      {toggleAddEventForm}
    />
  </div>
{:else if event && event.length > 0}
  <div class="transparent-box">
    <div class="content-wrapper">
      <div class="center-container">
        <div class="header">
          <h1 class="events-title">Events</h1>
        </div>
        <hr class="separator" />
        <div class="button-and-text">
          <button class="addButton" on:click={toggleAddEventForm}
            >Add an event</button
          >
        </div>
        <div class="event">
          {#each event as singleEvent (singleEvent._id)}
            <div>
              <EventCard event={singleEvent} />
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="transparent-box">
    <div class="content-wrapper">
      <div class="center-container">
        <div class="header">
          <h1 class="events-title">Events</h1>
        </div>
        <hr class="separator" />
        <div class="button-and-text">
          <button class="addButton" on:click={toggleAddEventForm}
            >Add an event</button
          >
        </div>
        <h2>No events</h2>
        <img
          class="placeHolder"
          src="event_placeholder.png"
          alt="eventcard placeholder"
        />
      </div>
    </div>
  </div>
{/if}

<style>
  h2 {
    font-size: 1.5em;
  }

  .placeHolder {
    opacity: 50%;
  }

  .separator {
    border: none;
    border-top: 2px solid #ffffff;
    opacity: 60%;
    width: 50%;
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
    width: 150%;
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
    width: 150%;
    cursor: pointer;
    transition: background-color 0.7s ease-in-out;
  }

  .header {
    margin-top: 20px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  /* Events h1 teksti */
  .events-title {
    font-size: 3vh;
  }

  .transparent-box {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 5px;
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 2%;
  }

  .content-wrapper {
    min-height: 49vw;
    flex-grow: 1;
    overflow: auto;
    width: 100%;
  }

  .center-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .button-and-text {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media screen and (max-width: 1920px) {
    .transparent-box {
      width: 120%;
    }
  }
</style>
