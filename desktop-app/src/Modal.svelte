<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  export let message;
  export let duration; // Kuinka kauan modal-ikkuna on näkyvissä
  export let onConfirm;
  export let onCancel;
  export let showButtons = true;

  const dispatch = createEventDispatcher();

  const fadeInOut = (_node, { delay = 0, duration = 200 }) => {
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
    if (timeout) {
      clearTimeout(timeout);
    }
  });

  const close = () => {
    dispatch('closeModal');
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    close();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    close();
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="modal-background" on:click={close}>
  <div transition:fadeInOut class="modal">
    <p>{message}</p>
    {#if showButtons}
      <div class="button-container">
        <button class="confirm-button" on:click={handleConfirm}>Confirm</button>
        <button class="cancel-button" on:click={handleCancel}>Cancel</button>
      </div>
    {/if}
  </div>
</div>

<style>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9998;
    backdrop-filter: blur(2px); /* Taustan blurrauksen vahvuus */
    pointer-events: none;
  }

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
    pointer-events: auto;
  }

  .button-container {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }

  .confirm-button,
  .cancel-button {
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    color: #fff;
    font-weight: bold;
  }

  .confirm-button {
    background-color: #4caf50;
  }

  .cancel-button {
    background-color: #f44336;
  }
</style>
