import axios from 'axios';

class AuthService {
  authenticated = false;

  static signup(email, password, confirmPassword) {
    return axios
      .post('/auth/signup', {
        email,
        password,
        confirmPassword
      })
      .then(() => {
        this.authenticated = true;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static authenticate(email, password) {
    return axios
      .post('/auth/login', {
        email,
        password
      })
      .then(() => {
        this.authenticated = true;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static signout() {
    axios.post('/auth/signout').then((res) => {
      console.log(res);
    });
  }

  static isAuthenticated() {
    return this.authenticated;
  }
}

export default AuthService;
