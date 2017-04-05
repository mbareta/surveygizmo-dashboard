const surveyGizmo = require('../lib/SurveyGizmo');
const EdxApi = require('../lib/EdxApi');
const Mailer = require('../lib/mailer');

const SurveyResponse = require('../models/surveyResponse');

const approveResponse = (req, res, next) => {
  const token = req.session.token.access_token;

  SurveyResponse.findOne({ 'questions.Submitter Email': req.body.email })
  .then(surveyResponse => {
    if (isApprovedOrRejected(surveyResponse)) {
      return res.send(surveyResponse);
    }

    const emailContent = req.body.emailContent;
    const responseId = req.params.responseId;
    return doApproveResponse(emailContent, responseId, token)
    .then(response => res.send(response));
  })
  .catch(error => next(error));
};

const isApprovedOrRejected = response =>
  response &&
  (response.status.accountCreated &&
  response.status.sentPasswordReset &&
  response.status.grantedCcxRole ||
  response.status.rejected);


const doApproveResponse = (emailContent, responseId, token) => {
  let createdAccount;

  const surveyResponse = new SurveyResponse({
    responseId: 0,
    submittedAt: '',
    questions: {},
    status: {
      accountCreated: null,
      grantedCcxRole: null,
      sentPasswordReset: null,
      rejected: null
    }
  });

  return surveyGizmo.getResponseData(responseId)
  .then(response => {
    surveyResponse.responseId = response.id;
    surveyResponse.submittedAt = response.submittedAt;
    surveyResponse.questions = response.questions;
    surveyResponse.save();
  })
  .then(() => EdxApi.createAccount(surveyResponse.questions))
  .then(account => {
    createdAccount = account;
    surveyResponse.status.accountCreated = new Date();
    surveyResponse.save();
  })
  .then(() => EdxApi.grantCcxRole(createdAccount, token))
  .then(() => {
    surveyResponse.status.grantedCcxRole = new Date();
    surveyResponse.save();
  })
  .then(() => EdxApi.sendResetPasswordRequest(createdAccount))
  .then(() => {
    surveyResponse.status.sentPasswordReset = new Date();
    surveyResponse.save();
  })
  .then(() => {
    Mailer.send({
      to: createdAccount.email,
      subject: 'FastTrac Application Approved',
      text: emailContent,
      html: emailContent
    });

    return surveyResponse;
  });
};

const rejectResponse = (req, res, next) => {
  const { email, emailContent } = req.body;
  const surveyResponse = new SurveyResponse({
    responseId: 0,
    submittedAt: '',
    questions: {},
    status: {
      accountCreated: null,
      grantedCcxRole: null,
      sentPasswordReset: null,
      rejected: new Date()
    }
  });

  surveyGizmo.getResponseData(req.params.responseId)
  .then(response => {
    surveyResponse.responseId = response.id;
    surveyResponse.submittedAt = response.submittedAt;
    surveyResponse.questions = response.questions;

    return Mailer.send({
      to: email,
      subject: 'FastTrac Application Rejected',
      text: emailContent,
      html: emailContent
    });
  })
  .then(() => {
    surveyResponse.save();
    res.send(surveyResponse);
  })
  .catch(error => next(error));
};

module.exports = { approveResponse, rejectResponse };
