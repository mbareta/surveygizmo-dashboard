const surveyGizmo = require('../lib/SurveyGizmo');
const EdxApi = require('../lib/EdxApi');
const Mailer = require('../lib/mailer');

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
  .then(({ isCreated, form: account }) => {
    createdAccount = account;

    if (isCreated) {
      surveyResponse.status.accountCreated = new Date();
      surveyResponse.save()
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
      });
    }
  })
  .then(() => EdxApi.grantCcxRole(createdAccount, token))
  .then(() => {
    surveyResponse.status.grantedCcxRole = new Date();
    surveyResponse.save();

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
