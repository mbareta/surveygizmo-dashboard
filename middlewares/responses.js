const surveyGizmo = require('../lib/SurveyGizmo');
const EdxApi = require('../lib/EdxApi');
const Mailer = require('../lib/mailer');

const SurveyResponse = require('../models/surveyResponse');

const approveResponse = (req, res, next) => {
  const surveyResponse = new SurveyResponse({
    submittedAt: '',
    questions: {},
    status: {
      accountCreated: false,
      grantedCcxRole: false,
      sentPasswordReset: false
    }
  });
  const emailContent = req.body.emailContent;

  surveyGizmo.getResponseData(req.params.responseId)
  .then(response => {
    surveyResponse.questions = response.questions;
    surveyResponse.submittedAt = response.submittedAt;

    return surveyResponse.save().then(() => response);
  })
  .then(response => EdxApi.createAccount(response.questions))
  .then(account => {
    surveyResponse.status.accountCreated = true;

    return surveyResponse.save().then(() => account);
  })
  .then(account => EdxApi.grantCcxRole(account, req.session.token.access_token))
  .then(account => {
    surveyResponse.status.grantedCcxRole = true;

    return surveyResponse.save().then(() => account);
  })
  .then(account => EdxApi.sendResetPasswordRequest(account))
  .then(account => {
    surveyResponse.status.sentPasswordReset = true;

    return surveyResponse.save().then(() => account);
  })
  .then(account => Mailer.send({
    to: account.email,
    subject: 'FastTrac Application Approved',
    text: emailContent,
    html: emailContent }).then(() => account))
  .then(account => res.send(account.username))
  .catch(error => next(error));
};

const rejectResponse = (req, res, next) => {
  const { email, emailContent } = req.body;
  Mailer.send({
    to: email,
    subject: 'FastTrac Application Rejected',
    text: emailContent,
    html: emailContent
  })
  .then(result => {
    res.send(result);
  })
  .catch(error => next(error));
};

module.exports = { approveResponse, rejectResponse };
