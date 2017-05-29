/* eslint-disable */
const config = require('../config/main');
const request = require('./request');
const getStateAbbreviation = require('./usStateAbbreviations');
const { UserDataException } = require('./customExceptions');

const jar = request.jar();
request.defaults({ jar });

class EdxApi {
  /**
   * Creates edX account with given data.
   * @param {object} data - Contains user info.
   * @returns {object} whatever
   */
  createAccount(data) {
    const url = `${config.baseUrl}:${config.lmsPort}/user_api/v1/account/registration/`;
    const mailingAddress = `${data['Street Address']}, ${data['City']}, ${data['Postal Code']} ${data['State']}`;
    const name = data['Full name'];
    const first_name = name.substr(0, name.indexOf(' '));
    const last_name = name.substr(name.indexOf(' ') + 1);
    const form = {
      email: data['Submitter Email'],
      first_name,
      last_name,
      name,
      username: data['Full name'].replace(/ /g, ''),
      country: getStateAbbreviation(data['State']),
      password: 'passverd', // TODO: generate random password
      level_of_education: 'p',
      gender: 'm',
      year_of_birth: '1999',
      mailing_address: mailingAddress,
      goals: '',
      honor_code: 'true',
      bio: 'other', // TODO, currenty it's a dropdown on edX side, but it's not implemented in SG
      zipcode: data['Postal Code']
    };

    return request.postAsync({ url, form })
      .then(response => {
        if (response.statusCode === 400) {
          const errors = JSON.parse(response.body);
          throw new UserDataException(errors);
        }

        if (response.statusCode === 409){
          return {
            isCreated: false,
            form
          };
        }

        if (response.statusCode === 200){
          return {
            isCreated: true,
            form
          };
        }

        throw new Error('Oops, something went bad!');
      });
  }

  /**
   * Grants CCX role for given username. It logs user in with OAuth2 and
   * calls an API to grant CCX role on a course defined in config.
   *
   * @param {string} username of the user we want to grant CCX role
   * @param {string} accessToken - OAuth2 access_token we use for logging in the user
   * @returns {string} username of the user that was granted CCX role
   */
  grantCcxRole(account, accessToken) {
    const courseId = config.courseId;
    const form = this.getFormData(account.username);

    // log in current user and get their session and CSRF cookies
    return this.loginAuthenticatedUser(account, accessToken)
      .then(response => {
        // set cookies and get CSRF Token
        let csrf;
        response.headers['set-cookie'].forEach(cookie => {
          if (cookie.indexOf('csrf') >= 0) {
            csrf = cookie.split('csrftoken=')[1].split(';')[0];
          }
          jar.setCookie(cookie.replace(/"/g, ''), `${config.baseUrl}:${config.lmsPort}/`);
        });

        const options = {
          url: `${config.baseUrl}:${config.lmsPort}/courses/${courseId}/instructor/api/modify_access`,
          form,
          headers: { 'X-CSRFToken': csrf },
          jar: jar // binks
        };
        // send request
        return request.postAsync(options);
      });
  }

  loginAuthenticatedUser(account, accessToken) {
    const options = {
      url: `${config.baseUrl}:${config.lmsPort}/oauth2/login/`,
      form: { access_token: accessToken }
    };

    return request.postAsync(options);
  }

  sendResetPasswordRequest(account) {
    const { email } = account;
    const options = {
      url: `${config.baseUrl}:${config.lmsPort}/password_reset/`,
      form: { email }
    };

    return request.postAsync(options);
  }

  /**
   * Helper function to build CCX role grant form data for given username
   *
   * @param {string} username
   * @returns {object} form data for this username
   */
  getFormData(username) {
    return {
      unique_student_identifier: username,
      rolename: 'ccx_coach',
      action: 'allow'
    };
  }
}

module.exports = new EdxApi();
