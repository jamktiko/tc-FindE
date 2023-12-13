import userState from './stateStore';
import jwt_decode from 'jwt-decode';
// Käytä JWT-toimintoja tarpeidesi mukaan

const checkLoggedInStatus = () => {
  const token = sessionStorage.getItem('token');

  if (token) {
    const decodedToken = jwt_decode(token);

    userState.update(() => ({
      loggedIn: true,
      userEmail: decodedToken.sposti,
      userId: decodedToken._id,
    }));
  } else {
    userState.update(() => ({
      loggedIn: false,
      userEmail: null,
      userId: null,
    }));
  }
};

const loginUser = (username, password, callback) => {
  console.log('loginUser is executed');
  fetch('https://backendwithlogin-1-u7980985.deta.app/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sposti: username, salasana: password }),
  })
    .then((response) => {
      if (!response.ok) {
        // Check if the response status is not in the 200-299 range
        console.log('pieleen meni');
      }

      return response.json(); // Palauta JSON-promise
    })
    .then((data) => {
      // Käsittele JSON-data tässä

      if (!data.success) {
        console.log('Wrong username or password');
        callback(true, 'Wrong username or password');
        return false;
      } else {
        console.log('Login successful:', data);
        const token = data['token'];
        console.log(token);
        const uusi = jwt_decode(token);
        console.log('Uusi token:', uusi);
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userEmail', token.sposti);
        sessionStorage.setItem('_id', uusi._id);

        userState.update(() => ({
          loggedIn: true,
        }));
        checkLoggedInStatus();
      }
    })
    .catch((error) => {
      console.error('Error during login:', error);
    });
};

const logoutUser = () => {
  console.log('LogoutUser is executed.');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userEmail');
  sessionStorage.removeItem('_id');

  userState.update((currentState) => ({
    ...currentState,
    loggedIn: false,
  }));
};

export default { loginUser, logoutUser, checkLoggedInStatus };
