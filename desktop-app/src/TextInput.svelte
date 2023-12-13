<script>
  export let type = 'text';
  export let id;
  export let label;
  export let value = '';
  export let max = 30;
  export let rows = 10;
  export let cols = 30;

  export let valid = true;
  export let errmsg = 'Virheellinen syöte';

  let firstVisit = true;

  function changeValue(e) {
    value = e.target.value;
  }
</script>

{#if type === 'textarea'}
  <label for={id}>{label}</label>
  <textarea
    {id}
    {rows}
    {cols}
    on:input={changeValue}
    bind:value
    on:blur={() => (firstVisit = false)}
  />
{:else}
  <label for={id}>{label}</label>
  <input
    {id}
    {type}
    maxlength={max}
    on:input={changeValue}
    on:blur={() => (firstVisit = false)}
  />
{/if}
{#if !firstVisit && !valid}
  <div class="error">{errmsg}</div>
{/if}

<style>
  .error {
    color: red;
    text-align: left;
    font-size: 0.7em;
    margin-bottom: 2em;
  }
  label {
    text-align: left;
    margin-bottom: 0.5em;
  }

  input {
    border: 1px solid;
    width: 80%;
  }

  textarea {
    width: 100%;
    border-radius: 5px;
    box-sizing: border-box;
  }
</style>
