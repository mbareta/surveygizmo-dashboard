const axios = require('axios');
const { baseUrl, lmsPort } = require('../config/main');

const getUserInfo = (req, res) => {
  const accessToken = req.session.token.access_token;
  const options = {
    method: 'GET',
    url: `${baseUrl}:${lmsPort}/oauth2/user_info`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };

  axios(options)
  .then(response => {
    req.session.user = response.data; // eslint-disable-line
    res.redirect('/');
  })
  .catch(error => res.send(`Access Token Error ${error.message}`));
};

const interceptNonStaff = (req, res, next) => {
  const accessToken = req.session.token && req.session.token.access_token;
  const options = {
    method: 'GET',
    url: `${baseUrl}:${lmsPort}/api/user/v1/is_staff`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };

  axios(options)
  .then(response => {
    const isStaff = response.data;

    if (isStaff) {
      next();
    } else {
      res.status(403);
      res.send('Access is forbidden for non-staff user!');
    }
  })
  .catch(error => next(error));
};

module.exports = { getUserInfo, interceptNonStaff };
