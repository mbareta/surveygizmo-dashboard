const express = require('express');
const surveyGizmo = require('../lib/SurveyGizmo');
const Mailer = require('../lib/mailer');
const { approveResponse, rejectResponse } = require('../middlewares/responses');

const router = express.Router();

router.get('/', (req, res, next) =>
  surveyGizmo.getResponseData()
  .then(json => res.send(json))
  .catch(error => next(error))
);

router.get('/email', (req, res, next) => {
  Mailer.send({
    to: 'mbareta@extensionengine.com',
    subject: 'Test',
    text: 'Contents',
    html: '<i> HTML Contents </i>'
  })
  .then(result => {
    res.send(result);
  })
  .catch(error => next(error));
});

router.get('/:responseId', (req, res, next) =>
  surveyGizmo.getResponseData(req.params.responseId)
  .then(json => res.send(json))
  .catch(error => next(error))
);

router.post('/:responseId/approve', approveResponse);

router.post('/:responseId/reject', rejectResponse);

module.exports = router;
