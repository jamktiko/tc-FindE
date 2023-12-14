<script>
  export let closeModal;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="modal" on:click={closeModal}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-content" on:click={(event) => event.stopPropagation()}>
    <p>Coming soon</p>
    <button on:click={closeModal}>Close</button>
  </div>
</div>

<style>
  /* Add your modal styles here */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    color: black;
    padding: 1em;
    border-radius: 8px;
    text-align: center;
    padding-left: 7em;
    padding-right: 7em;
  }

  p {
    color: #333;
    font-size: 1.5em;
  }

  button {
    color: white;
    background-color: black;
    border-radius: 20px;
    padding: 6px 10px;
    font-size: 1rem;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
    width: 100%;
    cursor: pointer;
    margin-top: 2em;
    margin-right: auto; /* Center the button horizontally within the modal */
    margin-left: auto;
    transition: background-color 0.7s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button:hover {
    color: black;
    background-color: rgb(138, 138, 138);
    border-radius: 20px;
    padding: 6px 10px;
    font-size: 1rem;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.7s ease-in-out;
    margin-top: 2em;
    margin-right: auto; /* Center the button horizontally within the modal */
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
