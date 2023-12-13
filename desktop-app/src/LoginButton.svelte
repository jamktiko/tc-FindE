<script>
  export let text = 'Sign in with Google';
</script>

<button class="login" on:click>{text}</button>

<style>
  .login {
    color: white;
    background-color: black;
    border-radius: 20px;
    border: 2px solid #323439;
    padding: 6px 10px;
    font-size: 1rem;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
    width: 80%;
    cursor: pointer;
    transition: background-color 0.7s ease-in-out;
  }

  .login:hover {
    color: black;
    background-color: white;
    border-radius: 20px;
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
