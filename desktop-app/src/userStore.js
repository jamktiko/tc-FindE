import { writable } from 'svelte/store';

export const user = writable({
  username: null,
  password: null,
});

export default user;

export function setUserCredentials(username, password) {
  user.update((userData) => {
    userData.username = username;
    userData.password = password;
    userData.loggedIn = true;
    return userData;
  });
}
