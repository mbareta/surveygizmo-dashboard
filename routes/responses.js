const express = require('express');
const surveyGizmo = require('../lib/SurveyGizmo');
const Mailer = require('../lib/mailer');
const { approveResponse } = require('../middlewares/responses');

const router = express.Router();

router.get('/', (req, res, next) =>
  surveyGizmo.getResponseData()
  .then(json => res.send(json))
  .catch(error => next(error))
);

router.get('/email', (req, res, next) => {
  res.send(
    Mailer.send({
      from: '"FastTrac" <admin@localhost>',
      to: 'mbareta@extensionengine.com',
      subject: 'Testis',
      text: 'Textis',
      html: '<i> HTML </i>'
    })
  );
});

router.get('/:responseId', (req, res, next) =>
  surveyGizmo.getResponseData(req.params.responseId)
  .then(json => res.send(json))
  .catch(error => next(error))
);

router.post('/:responseId/approve', approveResponse);

module.exports = router;
