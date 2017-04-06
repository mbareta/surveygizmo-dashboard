/* eslint-disable */
const Promise = require('bluebird');
const surveyGizmo = require('../lib/SurveyGizmo');
const EdxApi = require('../lib/EdxApi');
const Mailer = require('../lib/mailer');
const { UserDataException } = require('../lib/customExceptions');

const SurveyResponse = require('../models/surveyResponse');

const approveResponse = (req, res, next) => {
  const { access_token: accessToken } = req.session.token;
  const { email, emailContent } = req.body;
  const { responseId } = req.params;

  SurveyResponse.getByEmail(email)
  .then(surveyResponse => {
    if (surveyResponse && isApprovedOrRejected(surveyResponse)) {
      return res.send(surveyResponse);
    }

    return doApproveResponse(emailContent, responseId, accessToken)
    .then(response => res.send(response));
  })
  .catch(error => next(error));
};

const isApprovedOrRejected = ({ status }) => status &&
  (status.accountCreated &&
  status.sentPasswordReset &&
  status.grantedCcxRole ||
  status.rejected);


const doApproveResponse = (emailContent, responseId, token) => {
  let account;
  const surveyResponse = new SurveyResponse();

  return surveyGizmo.getResponseData(responseId)
  .then(data => surveyResponse.setData(data))
  .then(() => surveyResponse.setAccountCreated())
  .then(() => EdxApi.createAccount(surveyResponse.questions))
  .catch(UserDataException, exception => {
    console.log(exception.message)
    throw exception;
  })
  .then(({ isCreated, form }) => {
    account = form;

    if (isCreated) {
      sendResetPasswordEmail(
        account,
        emailContent
      )
      .then(() => surveyResponse.setSentPasswordReset());
    }
  })
  .then(() => EdxApi.grantCcxRole(account, token))
  .then(() => surveyResponse.setGrantedCcxRole())
  .then(() => surveyResponse);
};

const sendResetPasswordEmail = (account, content) =>
  Promise.all([
    EdxApi.sendResetPasswordRequest(account),
    Mailer.send({
      to: account.email,
      subject: 'FastTrac Application Approved',
      text: content,
      html: content
    })
  ]);

const rejectResponse = (req, res, next) => {
  const { email, emailContent } = req.body;
  const surveyResponse = new SurveyResponse();

  surveyGizmo.getResponseData(req.params.responseId)
  .then(response => surveyResponse.setData(response))
  .then(() => surveyResponse.setRejected())
  .then(() => Mailer.send({
    to: email,
    subject: 'FastTrac Application Rejected',
    text: emailContent,
    html: emailContent
  }))
  .then(() => res.send(surveyResponse))
  .catch(error => next(error));
};

module.exports = { approveResponse, rejectResponse };
