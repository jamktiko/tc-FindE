<script>
  export let text = 'Click';
</script>

<button class="bigbutton" on:click>{text}</button>

<style>
  .bigbutton {
    width: 100px; /* Aseta haluttu leveys */
    height: 100px; /* Aseta haluttu korkeus */
    color: #f8efd6; /* Tekstin väri */
    border: 10px; /* Poista reunus */
    border-color: black;
    border-radius: 20%; /* Poista pyöristys */
    cursor: pointer; /* Osoitinkuvake */
    font-size: 16px; /* Tekstin koko */
    font-weight: bold; /* Lihavointi */
  }
</style>
