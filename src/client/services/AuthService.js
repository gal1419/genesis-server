import axios from 'axios';

class AuthService {
  authenticated = false;

  static async signup(email, password, confirmPassword) {
    try {
      await axios.post('/auth/signup', {
        email,
        password,
        confirmPassword
      });
      this.authenticated = true;
    } catch (err) {
      console.log(err);
    }
  }

  static async authenticate(email, password) {
    try {
      await axios.post('/auth/login', {
        email,
        password
      });
      this.authenticated = true;
    } catch (err) {
      console.log(err);
    }
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
