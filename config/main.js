const env = require('./config.json');
const allowedResponseKeys = require('./allowedResponseKeys');

module.exports = (() => {
  const node_env = process.env.NODE_ENV || 'development';
  const env_variables = env[node_env];

  // OAuth2
  env_variables.client.id = process.env.CLIENT_ID || env_variables.client.id;
  env_variables.client.secret = process.env.CLIENT_SECRET || env_variables.client.secret;

  env_variables.allowedResponseKeys = allowedResponseKeys;

  return env_variables;
})();
