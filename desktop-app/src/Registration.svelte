<script>
  import { createEventDispatcher } from 'svelte';
  import { registerUser } from './apiService';
  import Gdpr from './gdpr.svelte';
  import Modal from './Modal.svelte';

  export let registering = true;

  const dispatch = createEventDispatcher();
  const goToDefaultView = () => dispatch('goToDefaultView');

  let etunimi = '';
  let sukunimi = '';
  let sposti = '';
  let salasana = '';
  let confirm = '';

  let showModal = false;
  let errorMessage = '';

  // Onko string tyhjä
  const isEmpty = (value) => value.trim() === '';

  // Onko e-mail -formaatti oikea
  const isValidEmail = (sposti) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sposti);
  };

  const register = async () => {
    // Validations
    if (
      isEmpty(etunimi) ||
      isEmpty(sukunimi) ||
      isEmpty(sposti) ||
      isEmpty(salasana) ||
      isEmpty(confirm) ||
      !accepted
    ) {
      errorMessage = 'All fields must be filled.';
      return;
    }

    if (!isValidEmail(sposti)) {
      errorMessage = 'Invalid email format.';
      return;
    }

    try {
      const res = await registerUser(etunimi, sukunimi, sposti, salasana);
      console.log(res);

      if (res.data && res.data.success) {
        // Registration successful
        showModal = true;
      } else {
        // Registration failed
        console.error('Registration failed:', res.data.message);

        // Virheenkäsittely
      }
    } catch (error) {
      console.error('Registration failed:', error.message);

      // Virheenkäsittely
    } finally {
      registering = false;
    }
  };

  let isClicked = false;
  let accepted = false;

  function handleClick() {
    console.log('click');
    register();
    isClicked = true;

    setTimeout(() => {
      isClicked = false;
    }, 300);
  }

  // Formin tyhjennys
  const resetForm = () => {
    etunimi = '';
    sukunimi = '';
    sposti = '';
    salasana = '';
    confirm = '';
    accepted = false;
  };

  // Modaalin sulkeminen
  const closeModal = () => {
    showModal = false;
    resetForm();
    goToDefaultView();
  };

  $: console.log('accepted is ' + accepted);
</script>

<div class="register-container">
  <h1>Register</h1>
  <hr />

  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
  {/if}
  <div class="input-box">
    <label for="name" class="label-text" />
    First name
    <!-- svelte-ignore a11y-autocomplete-valid -->
    <input
      type="text"
      id="firstName"
      name="name"
      placeholder="First name"
      autocomplete="new-name"
      bind:value={etunimi}
    />
  </div>

  <div class="input-box">
    <label for="userName" class="label-text" />
    Last name
    <!-- svelte-ignore a11y-autocomplete-valid -->
    <input
      type="text"
      id="lastName"
      name="userName"
      placeholder="Last name"
      autocomplete="new-username"
      bind:value={sukunimi}
    />
  </div>

  <div class="input-box">
    <label for="email" class="label-text" />
    E-mail
    <!-- svelte-ignore a11y-autocomplete-valid -->
    <input
      type="text"
      id="email"
      name="E-mail"
      placeholder="e.g. yourname@email.com"
      autocomplete="new-email"
      bind:value={sposti}
    />
  </div>

  <div class="input-box">
    <label for="password" class="label-text" />
    Password (min. 6 characters)
    <input
      type="password"
      id="password"
      name="Password"
      placeholder="Password"
      autocomplete="new-password"
      bind:value={salasana}
    />
  </div>

  <div class="input-box">
    <label for="password" class="label-text" />
    Confirm password
    <!-- svelte-ignore a11y-autocomplete-valid -->
    <input
      type="password"
      id="confirm"
      name="Confirm"
      placeholder="Confirm password"
      autocomplete="new-confirm"
      bind:value={confirm}
    />
  </div>
  <Gdpr bind:checked={accepted} />
  <br />
  <!-- Jos menee validoinnista läpi, niin perus painike näkyvillä. Jos ei niin disabled painike näkyvillä -->
  <div>
    {#if etunimi && sukunimi && salasana === confirm && accepted}
      <button
        class="RegistrationButton {isClicked ? 'clicked' : ''}"
        on:click={(register, handleClick)}
      >
        Register
      </button>
    {:else}
      <button class="disabledButton" disabled>Register</button>
    {/if}

    {#if showModal}
      <Modal
        message={`Registration successful! A confirmation e-mail has been sent to '${sposti}'.`}
        duration={3000}
        on:closeModal={closeModal}
        showButtons={false}
      />
    {/if}
  </div>
  <p>Already have an account?</p>
  <button class="link-button" on:click={goToDefaultView}>Log in here!</button>
</div>

<style>
  /* Add your styles for error messages here */
  .error-message {
    color: red;
    margin-top: 10px;
  }
  hr {
    border: none; /* Remove the default border */
    border-top: 1px solid #333; /* Add your desired border style and color */
    opacity: 30%;
    margin: 20px 0; /* Adjust the margin to control the space above and below the line */
  }
  .register-container {
    position: flex;
    align-items: center;
    justify-content: center;
    width: 15rem;
  }

  input[type='text'] {
    width: 100%;
    margin: auto;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 3px;
    color: black;
    margin: 5px 0; /* Adjust the margin to control the space above and below the line */
  }
  input {
    box-sizing: border-box;
  }

  .input-box {
    text-align: left;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.6); /* Varjoa tekstiin */
  }

  .RegistrationButton.clicked {
    /* Animaatiot sun muut kun klikataan. */
    background-color: white;
  }
  .RegistrationButton {
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

  .RegistrationButton:hover {
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

  .link-button {
    background: none;
    border: none;
    color: #ffcb00; /* or your desired link color */
    cursor: pointer;
    text-decoration: underline;
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition:
      font-size 0.3s ease-in-out,
      color 0.3s ease-in-out,
      text-decoration 0.3s ease-in-out;
  }

  .link-button:hover {
    color: #ffffff;
  }

  h1 {
    font-size: 4vh;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
  }

  input[type='password'] {
    width: 100%;
    padding: 6px;
    border: 1px solid #ccc;
    color: black;
    border-radius: 3px;
    margin: 5px 0; /* Adjust the margin to control the space above and below the line */
  }

  .input-box label[for='password'] {
    display: block; /* Make labels block-level elements to stack them on top of their respective input fields */
  }

  .input-box input[type='password'] {
    width: 100%;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 3px;
    margin: 5px 0; /* Adjust the margin to control the space above and below the line */
  }

  .disabledButton {
    color: white;
    background-color: black;
    border-radius: 20px;
    opacity: 30%;
    border: 2px solid #323439;
    padding: 6px 10px;
    font-size: 1rem;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
    width: 80%;
    cursor: pointer;
    transition: background-color 0.7s ease-in-out;
  }
</style>
