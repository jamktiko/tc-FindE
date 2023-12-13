<script>
  import Button from './Button.svelte';
  import outService from './outService';

  const handleLogout = () => {
    console.log('handleLogout is executed');
    outService.logoutUser();
  };
</script>

<div class="status-box">
  <div
    class="logout-button"
    on:click={handleLogout}
    tabindex="0"
    role="button"
    on:keydown={(e) => {
      if (e.key === 'Enter') handleLogout();
    }}
  >
    <img class="icon" src="log-out.png" alt="event icon" />
    <div class="info">
      <Button text="Log out" />
    </div>
  </div>

  <slot />
</div>

<style>
  .status-box {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin-bottom: 25px;
    margin-left: -10px;
    padding: 10px;
    border-radius: 10px;
    font-size: 0.7em;
    position: absolute;
    bottom: 0;
  }

  .logout-button {
    display: flex;
    cursor: pointer;
    font-size: 2vh;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
    padding: 10px;
    padding-right: 160px;
    padding-left: 10px;
    border-radius: 10px;
    /* Remove display: flex; from .logout-button */
  }

  .logout-button:hover {
    background-color: rgba(0, 0, 0, 0.2); /* Low opacity color on hover */
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 10px; /* Add margin for spacing between icon and text */
  }

  .icon {
    margin-right: 10px; /* Add margin to the right of the icon */
    width: 25px;
    height: 30px; /* Set a fixed height for the icon */
  }

  .logout-button {
    cursor: pointer;
    font-size: 2vh;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
    padding: 10px;
    padding-right: 160px;
    padding-left: 10px;
    border-radius: 10px;
    color: white;
  }
</style>
