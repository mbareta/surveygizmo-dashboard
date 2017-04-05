const mongoose = require('../lib/mongoose');

const surveyResponseSchema = mongoose.Schema({
  responseId: Number,
  submittedAt: String,
  questions: {},
  status: {
    accountCreated: { type: Date, default: null },
    grantedCcxRole: { type: Date, default: null },
    sentPasswordReset: { type: Date, default: null },
    rejected: { type: Date, default: null }
  }
});

surveyResponseSchema.methods.setAccountCreated = function () {
  this.status.accountCreated = new Date();
  return this.save();
};

surveyResponseSchema.methods.setGrantedCcxRole = function () {
  this.status.grantedCcxRole = new Date();
  return this.save();
};

surveyResponseSchema.methods.setSentPasswordReset = function () {
  this.status.sentPasswordReset = new Date();
  return this.save();
};

surveyResponseSchema.statics.getByEmail = function (email) {
  return this.findOne({ 'questions.Submitter Email': email });
};

const SurveyResponse = mongoose.model('SurveyResponse', surveyResponseSchema);

module.exports = SurveyResponse;
