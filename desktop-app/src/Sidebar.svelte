<!-- App.svelte -->

<script>
  import { onMount } from 'svelte';
  import Modal from './Modal.svelte';
  import ComingSoon from './comingSoon.svelte';
  import StatusBox from './StatusBox.svelte';

  let sidebarOpen = window.innerWidth >= 1280;
  let isModalOpen = false;

  function closeSidebar() {
    sidebarOpen = false;
  }

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }

  onMount(() => {
    function handleResize() {
      sidebarOpen = window.innerWidth >= 1280;
    }

    function handleOutsideClick(event) {
      const sidebar = document.getElementById('default-sidebar');
      const button = document.getElementById('sidebar-toggle-button');

      if (sidebarOpen && window.innerWidth < 1280) {
        if (!sidebar.contains(event.target) && !button.contains(event.target)) {
          event.preventDefault();
          closeSidebar();
        }
      }
    }

    window.addEventListener('resize', handleResize);
    document.body.addEventListener('mousedown', handleOutsideClick);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.removeEventListener('mousedown', handleOutsideClick);
    };
  });
</script>

<button
  on:click={() => (sidebarOpen = !sidebarOpen)}
  aria-controls="default-sidebar"
  type="button"
  id="sidebar-toggle-button"
  class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg xl:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
  aria-expanded={sidebarOpen}
>
  <span class="sr-only">Toggle sidebar</span>
  <svg
    class="w-6 h-6"
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clip-rule="evenodd"
      fill-rule="evenodd"
      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
    />
  </svg>
</button>

<aside
  id="default-sidebar"
  class="fixed top-0 left-0 z-40 w-80 h-screen transition-transform transform xl:translate-x-0"
  aria-label="Sidebar"
  style="transform: translateX({sidebarOpen ? 0 : '-100%'})"
>
  <div class="h-full px-3 py-4 overflow-y-auto">
    <ul class="space-y-2 font-medium">
      <li>
        <div
          class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white"
        >
          <img class="logo" src="findevents-logo.png" alt="logo" />
        </div>
      </li>
      <li>
        <a
          href="/placeholder"
          class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        >
          <img class="icon" src="marker.png" alt="event icon" />
          <span class="flex-1 ml-3 whitespace-nowrap">Events</span>
        </a>
      </li>
      <li>
        <!-- Modified Settings link to open the modal -->
        <a
          href="/placeholder"
          on:click|preventDefault={openModal}
          class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        >
          <img class="icon" src="settings-icon.png" alt="event icon" />
          <span class="flex-1 ml-3 whitespace-nowrap">Settings</span>
        </a>
      </li>
      <li>
        <a
          href="/placeholder"
          on:click|preventDefault={openModal}
          class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        >
          <img class="icon" src="profiili.png" alt="user icon" />
          <span class="flex-1 ml-3 whitespace-nowrap">Profile</span>
        </a>
      </li>

      <li
        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white group"
      >
        <StatusBox />
      </li>
    </ul>
  </div>
</aside>

<!-- Add the Modal component -->
{#if isModalOpen}
  <ComingSoon {closeModal} />
{/if}

<style>
  /* Etsi painike */
  .icon {
    width: 30px;
    height: auto;
  }

  button {
    margin-top: 20px;
  }

  #default-sidebar li a {
    font-size: 20px;
    color: white;
  }

  #default-sidebar {
    background-color: #323439;
    position: fixed;
    top: 0;
    left: 0;

    background: url('/icons-bg.png'), #323439; /* Update the path as needed */
    background-size: contain;
    background-repeat: repeat;

    /* Add drop shadow */
    box-shadow: 1px 0 20px rgba(0, 0, 0, 0.7); /* Adjust values as needed */
  }

  .logo {
    width: 225px;
    height: auto;
  }

  /* Add this CSS rule to make the font bigger for the text inside the sidebar */
  #default-sidebar li a {
    font-size: 20px; /* You can adjust the font size as needed */
  }

  /* Default styles for small screens */
  #default-sidebar {
    transform: translateX(-100%);
  }

  #default-sidebar {
    transform: translateX(0);
    transition: transform 0.3s ease-in-out;
  }

  /* Default styles for small screens */
  #default-sidebar {
    background-color: #323439;
    position: fixed;
    top: 0;
    left: 0;
    transition: transform 0.3s ease-in-out;
  }

  /* Media query for screens wider than 1280px */
  @media (min-width: 1280px) {
    #default-sidebar {
      transform: translateX(0);
    }
  }
</style>
