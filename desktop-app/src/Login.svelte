<script>
  import LoginButton from './LoginButton.svelte';
  import { createEventDispatcher } from 'svelte';
  import Modal from './Modal.svelte';

  export let registering;
  export let username = '';
  export let password = '';

  export let displayModal;
  export let closeModal;
  export let modalMessage;

  const dispatch = createEventDispatcher();

  const logIn = () => {
    dispatch('login');
  };
  const signUp = () => {
    registering = !registering;
  };

  const check = () => {
    alert('Remember/forget');
  };

  let isClicked = false;

  function handleClick() {
    isClicked = true;

    // Reset the animation after a delay (e.g., 300ms)
    setTimeout(() => {
      isClicked = false;
    }, 300);
  }
</script>

<div class="login-container">
  <h1>Welcome!</h1>

  <h2>Login</h2>

  <hr />
  <div class="input-box">
    <label for="userName" class="label-text" />
    Username
    <input
      type="text"
      id="userName"
      name="userName"
      placeholder="Username"
      autocomplete="Username"
      bind:value={username}
    />
  </div>
  <br />
  <div class="input-box">
    <label for="password" class="label-text"> Password </label>
    <input
      type="password"
      id="password"
      name="password"
      placeholder="Password"
      autocomplete="off"
      bind:value={password}
    />
  </div>

  <div class="rememberforgotcontainer">
    <input type="checkbox" id="rememberme" on:click={check} />
    <div class="rememberMe">Remember me</div>
    <div class="forgotPassword">
      <a href={signUp} on:click={signUp}>Forgot your password?</a>
    </div>
  </div>

  <!-- Jos menee validoinnista läpi, niin perus painike näkyvillä. Jos ei niin disabled painike näkyvillä -->
  <div>
    {#if username && password}
      <br />
      <LoginButton on:click={logIn} text="Login" />
    {:else}
      <br />
      <button class="disabledButton" disabled>Login</button>
    {/if}
  </div>

  <div class="register">
    <div class="notregistered">Not registered yet?</div>
    <div class="signup">
      <button class="link-button" on:click={signUp}>Sign up here!</button>
    </div>
  </div>
  <form on:submit|preventDefault={logIn} />
</div>

{#if displayModal}
  <div class="overlay">
    <Modal message={modalMessage} on:closeModal={closeModal} />
  </div>
{/if}

<style>
  .login-container {
    position: relative;
    align-items: center;
    justify-content: center;
  }

  input[type='text'],
  input[type='password'] {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  input {
    box-sizing: border-box;
    color: black;
  }

  .input-box {
    text-align: left;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 1); /* Varjoa tekstiin */
  }

  a {
    color: rgba(255, 203, 0, 1);
    text-decoration: none;
  }

  hr {
    border: none; /* Remove the default border */
    border-top: 1px solid #333; /* Add your desired border style and color */
    opacity: 30%;
    margin: 20px 0; /* Adjust the margin to control the space above and below the line */
  }
  .rememberforgotcontainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: -9px;
    font-size: 1.6ch;
    padding: 5px;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.6); /* Varjoa tekstiin */
  }

  .rememberMe {
    text-align: left;
    flex: 1;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.6); /* Varjoa tekstiin */
  }

  .forgotPassword a {
    text-align: right;
    flex: 1;
    white-space: nowrap;
    color: #ffcb00;
    cursor: pointer;
    transition:
      font-size 0.3s ease-in-out,
      color 0.3s ease-in-out,
      text-decoration 0.3s ease-in-out;
  }

  .forgotPassword a:hover {
    color: white;
  }
  .register {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .notregistered {
    text-align: left;
    padding-right: 8px;
    white-space: nowrap;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.6); /* Varjoa tekstiin */
  }

  .signup {
    text-align: right;
    padding-left: 8px;
  }

  h1 {
    font-size: 4vh;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
  }

  h2 {
    font-size: 3vh;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
  }

  .link-button {
    background: none;
    border: none;
    color: #ffcb00; /* or your desired link color */
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition:
      font-size 0.3s ease-in-out,
      color 0.3s ease-in-out,
      text-decoration 0.3s ease-in-out;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.6); /* Varjoa tekstiin */
  }

  .link-button:hover {
    color: #ffffff;
  }

  .disabledButton {
    color: white;
    background-color: black;
    border-radius: 20px;
    opacity: 30%;
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

  form {
    padding: 20px;
  }
</style>
