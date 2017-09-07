const request = require('./request');
const { auth0 } = require('../config/main');

function auth0Api() {
  this.url = auth0.apiUrl;
  this.usersUrl = `${this.url}/users`;
  this.resetPasswordurl = `${this.url}/tickets/password-change`;
  this.refreshTokenUrl = `${this.url}/oauth/token`;

  const isTokenExpired = !this.token || this.token.expires_in + this.token.created_at > Date.now();

  const refreshToken = () => {
    const options = {
      url: 'https://miro24.eu.auth0.com/oauth/token',
      form: {
        grant_type: 'client_credentials',
        client_id: auth0.clientId,
        client_secret: auth0.clientSecret,
        audience: `${this.url}/`,
      },
    };

    return request.postAsync(options).then(response => {
      this.token = JSON.parse(response.body);
      this.token.created_at = Date.now();
    });
  };

  const createUser = async (email, password) => {
    if (isTokenExpired) {
      await refreshToken();
    }
    const options = {
      url: this.usersUrl,
      auth: {
        bearer: this.token.access_token,
      },
      form: {
        connection: auth0.connection,
        email,
        password,
      },
    };

    return request
      .postAsync(options)
      .then(response => JSON.parse(response.body))
      .catch(e => e);
  };

  return {
    refreshToken,
    createUser,
  };
}

module.exports = auth0Api;
