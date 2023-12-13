<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let selectedFile;

  function handleFileUpload(event) {
    selectedFile = event.target.files[0];
    if (selectedFile) {
      dispatch('fileSelected', selectedFile);
    }
  }
</script>

<div class="file-upload-container">
  <!-- Stylish file upload button -->
  <label for="file-upload" class="file-upload-btn">
    Choose File
  </label>
  <input
    type="file"
    id="file-upload"
    name="Event image"
    accept="image/*"
    on:change={handleFileUpload}
    bind:this={selectedFile}
    class="hidden-file-input"
  />

  <!-- Display selected file name (optional) -->
  {#if selectedFile}
    <p>Selected File: {selectedFile.name}</p>
  {/if}
</div>

<style>
  /* Stylish button styles */
  input[type="file"] {
    display: none; /* Hide the default file input */
  }

  .file-upload-container {
    display: flex;
    align-items: center; /* Center vertically within the container */
  }

  .file-upload-btn {
    background-color: #000000;
    color: white;
    padding: 2px 15px;
    border: none;
    width: auto;
    border-radius: 5px;
    cursor: pointer;
    display: inline-block;
    margin-right: 10px; /* Add margin between button and text */
    transition:
      background-color 0.5s ease-in-out,
      color 0.5s ease-in-out;
  }

  .file-upload-btn:hover {
    background-color: #1f1f1f; /* Darker green on hover */
  }

  /* Hidden file input is triggered by clicking on the stylish button */
  .hidden-file-input {
    display: none;
  }
</style>
