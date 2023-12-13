<script>
  export let text = 'Click';
</script>

<button on:click>{text}</button>

<style>
  button {
    background-color: var(--main-color);
    color: var(--sec-color);
    width: 5em;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
  }
</style>
