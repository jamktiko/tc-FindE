import { writable } from 'svelte/store';

export const state = writable({
  loggedIn: false,
});

export const logout = () => {
  state.update((currentState) => ({
    ...currentState,
    loggedIn: false,
  }));
};

export default state;
