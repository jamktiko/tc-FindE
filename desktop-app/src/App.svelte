<script>
  import Header from './Header.svelte';
  import Main from './Main.svelte';
  import Registration from './Registration.svelte';
  import Login from './Login.svelte';
  import userState from './stateStore';

  import outService from './outService';

  let loginUsername = '';
  let loginPassword = '';

  let displayModal = false;
  let modalMessage = '';

  const closeModal = () => {
    displayModal = false;
  };

  let registering = false;

  const goToDefaultView = () => {
    registering = false;
  };

  const login = () => {
    outService.loginUser(loginUsername, loginPassword, (display, message) => {
      displayModal = display;
      modalMessage = message;
    });
  };

  outService.checkLoggedInStatus();
</script>

<div class="content">
  <main>
    {#if $userState.loggedIn}
      <Main />
    {:else if registering}
      <Header />
      <Registration on:goToDefaultView={goToDefaultView} />
    {:else}
      <Header />
      <Login
        bind:username={loginUsername}
        bind:password={loginPassword}
        bind:registering
        on:login={login}
        {displayModal}
        {closeModal}
        {modalMessage}
      />
    {/if}
  </main>
</div>

<style>
  main {
    width: 60%;
    max-height: 930px;
    margin-top: -15px;
    font-family: Calibri;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-height: auto;
    color: #f8efd6;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
