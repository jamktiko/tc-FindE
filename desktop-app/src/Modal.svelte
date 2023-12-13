<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  export let message;
  export let duration; // Duration in milliseconds (optional)

  const dispatch = createEventDispatcher();

  const fadeInOut = (node, { delay = 0, duration = 200 }) => {
    return {
      delay,
      duration,
      css: (t) => `
        opacity: ${t}
      `,
    };
  };

  let timeout;

  onMount(() => {
    if (duration) {
      timeout = setTimeout(() => {
        close();
      }, duration);
    }
  });

  onDestroy(() => {
    // Clear the timeout when the component is destroyed
    if (timeout) {
      clearTimeout(timeout);
    }
  });

  const close = () => {
    dispatch('closeModal');
  };
</script>

<div transition:fadeInOut class="modal">
  <p>{message}</p>
</div>

<style>
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: gray;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    z-index: 9999;
  }
</style>
