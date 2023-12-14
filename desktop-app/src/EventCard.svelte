<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { deleteEvent } from './apiService';
  import Modal from './Modal.svelte';
  import { events } from './eventStore.js'; // Import your events store

  export let event;

  const dispatch = createEventDispatcher();

  let showOptions = false;
  let showDeleteConfirmationModal = false;
  let showDeleteSuccessModal = false;

  let showModal = true;

  const handleClick = () => {
    showOptions = !showOptions;
  };

  const handleOptionClick = (option) => {
    if (option === 'edit') {
      console.log('Edit clicked');
      // Add your modify logic here
    } else if (option === 'delete') {
      showDeleteConfirmationModal = true;
    }

    // Hide the options after handling the click
    showOptions = false;
  };

  const confirmDelete = async () => {
    try {
      console.log('Deleting event...');

      const deletedEvent = await deleteEvent(event._id);
      // Update the events store after deletion
      $events = $events.filter((e) => e._id !== event._id);

      console.log('Event deleted successfully:', deletedEvent);
      showDeleteSuccessModal = true;
      setTimeout(() => {
        showDeleteSuccessModal = false;
      }, 2000);
      dispatch('eventDeleted');
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      // Close the delete confirmation modal, whether successful or not
      showDeleteConfirmationModal = false;
    }
  };

  const cancelDelete = () => {
    // Close the delete confirmation modal
    showDeleteConfirmationModal = false;
  };

  onMount(() => {
    // Add an event listener to close the options-box when clicking outside of it
    window.addEventListener('click', handleWindowClick);
    return () => {
      // Cleanup the event listener on component destruction
      window.removeEventListener('click', handleWindowClick);
    };
  });

  const handleWindowClick = (event) => {
    const optionsBox = document.querySelector('.options-box');
    const ellipsisButtons = document.querySelectorAll('.ellipsis');

    const isOutsideOptions = optionsBox && !optionsBox.contains(event.target);
    const isOutsideEllipsisButtons = Array.from(ellipsisButtons).every(
      (button) => !button.contains(event.target)
    );

    if (isOutsideOptions && isOutsideEllipsisButtons) {
      showOptions = false;
    }
  };
</script>

<div class="event-card">
  <div class="event-options">
    <button class="ellipsis" on:click={handleClick}
      ><img class="ellipsis" src="ellipsis2.png" alt="triple dot" /></button
    >
    <div class:options-box={true} class:visible={showOptions}>
      <button on:click={() => handleOptionClick('edit')}>
        <img class="editIcons" src="edit-icon.png" alt="edit icon" />
        Edit
      </button>
      <button on:click={() => handleOptionClick('delete')}>
        <img class="editIcons" src="delete-icon.png" alt="Delete icon" />
        Delete
      </button>
    </div>
  </div>
  <div class="event-content">
    <div class="event-image-container">
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <img class="event-image" src={event.kuvaUrl} alt="Event photo" />
    </div>
    <div class="event-info">
      <h1>{event.nimi}</h1>
      <div class="icon">
        <img class="icon" src="kalenteri.png" alt="calendar icon" />
        <p>{event.aloituspvm}</p>
      </div>
      <div class="icon">
        <img class="icon" src="clock-icon.png" alt="clock icon" />
        <p>{event.aloitusaika}</p>
      </div>
      <div class="icon">
        <img class="icon" src="marker.png" alt="calendar icon" />
        <p>
          {event.sijainti[0].katuosoite}, {event.sijainti[0].postinumero}
          {event.sijainti[0].paikkakunta}, {event.sijainti[0].maa}
        </p>
      </div>
    </div>
  </div>
  {#if showDeleteConfirmationModal}
    <Modal
      message="Are you sure you want to delete this event?"
      onConfirm={confirmDelete}
      onCancel={cancelDelete}
      showButtons={!showDeleteSuccessModal}
    />
  {/if}

  {#if showDeleteSuccessModal}
    <Modal message="Event successfully deleted!" showButtons={false} />
  {/if}
</div>

<style>
  .options-box {
    position: absolute;
    top: -100%;
    right: 0;
    background-color: #757476;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 2px;
    width: 200px;
    z-index: 2;
    visibility: hidden;
    opacity: 0;
    transition:
      opacity 0.3s ease,
      top 0.3s ease;
  }

  .options-box.visible {
    top: 2.5em;
    visibility: visible;
    opacity: 1;
  }

  .options-box button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 3px;
    border: none;
    color: #fff;
    cursor: pointer;
  }

  .options-box button img {
    margin-right: 5px;
  }

  /* Common styles for both large and small screens */
  .event-card {
    display: flex;
    background: url('/icons-bg.png'), #323439; /* Update the path as needed */
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 30em;
    max-height: auto;
    width: 100%;
    height: auto;
    margin: 10px auto;
    position: relative;
    border-right: 2px solid #757476;
    border-top: 2px solid #757476;
  }

  .event-image-container {
    flex-shrink: 0;
    width: 7em;
    height: 7em;
    overflow: hidden;
    border-radius: 5px;
    margin-left: 1em;
  }

  .editIcons {
    width: 20px;
    height: 20px;
  }

  .event-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }

  h1,
  p {
    color: #fff;
    text-align: left;
    margin: 0;
  }

  h1 {
    font-size: 1.5em;
    margin-bottom: 0.2em;
  }

  p {
    font-size: 16px;
    margin: 2px 0;
  }

  .event-content {
    display: flex;
    align-items: center;
  }

  .event-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    text-align: left;
    padding: 1em;
  }

  .icon {
    display: flex;
    align-items: center;
  }

  .icon img {
    margin-right: 5px;
    width: 20px;
    height: 20px;
  }

  .ellipsis {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    padding: 4px;
    width: 16px;
    height: 35px;
    margin-right: 0.2em;
    margin-top: 0.2em;
  }

  /* Media query for smaller screens */
  @media (max-width: 800px) {
    .event-card {
      flex-direction: column;
      width: 90%;
      height: auto;
      max-height: auto;
      align-items: center;
    }

    .event-content {
      display: flex;
      flex-direction: column;
      margin-bottom: 1em;
    }

    .event-image-container {
      flex-shrink: 0;
      width: 7em;
      height: 7em;
      overflow: hidden;
      border-radius: 5px;
      margin-top: 0.9em;
      margin-left: 0.9em;
    }

    .event-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 5px;
      border-color: #757476;
      border-width: 2px;
    }
  }
</style>
