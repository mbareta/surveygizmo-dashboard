const request = require('./request');

function auth0Api(config) {
  const url = config.apiUrl;
  const usersUrl = `${url}/users`;
  const resetPasswordurl = `${url}/tickets/password-change`; // eslint-disable-line no-unused-vars
  const refreshTokenUrl = `${config.domainUrl}/oauth/token`;
  let token;

  const isTokenExpired = !token || token.expires_in + token.created_at > Date.now();

  const refreshToken = () => {
    const options = {
      url: `${refreshTokenUrl}`,
      form: {
        grant_type: 'client_credentials',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        audience: `${url}/`,
      },
    };

    return request.postAsync(options).then(response => {
      token = JSON.parse(response.body);
      token.created_at = Date.now();
    });
  };

  const createUser = async (email, password) => {
    if (isTokenExpired) {
      await refreshToken();
    }
    const options = {
      url: usersUrl,
      auth: {
        bearer: token.access_token,
      },
      form: {
        connection: config.connection,
        email,
        password,
      },
    };

    return request
      .postAsync(options)
      .then(response => JSON.parse(response.body))
      .catch(e => e);
  };

  return Object.freeze({
    refreshToken,
    createUser,
  });
}

module.exports = auth0Api;
