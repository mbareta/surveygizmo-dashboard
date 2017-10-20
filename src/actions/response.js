const dispatcher = require('../dispatcher');
const responseConstants = require('../constants/response');
const modalConstants = require('../constants/modal');

class ResponseActions {
  loadResponses(pageIndex = 1) {
    const xhr = new XMLHttpRequest(); // eslint-disable-line

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const responses = JSON.parse(xhr.responseText);

        dispatcher.handleAction({
          actionType: responseConstants.SET_RESPONSES,
          data: responses
        });
      } else if (xhr.readyState === 4 && xhr.status !== 200) {
        throw new Error('Fetching responses failed');
      }
    };

    xhr.open('GET', `/responses/page/${pageIndex}`, true);
    xhr.send();
  }

  viewResponse(response) {
    dispatcher.handleAction({
      actionType: responseConstants.VIEW_RESPONSE,
      data: response
    });
  }

  closeViewResponse() {
    dispatcher.handleAction({
      actionType: responseConstants.CLOSE_VIEW_RESPONSE,
      data: null
    });
  }

  approveResponse(response, emailContent) {
    const xhr = new XMLHttpRequest(); // eslint-disable-line
    const data = {
      email: response.questions['Submitter Email'],
      emailContent
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status === 200) {
        const surveyResponse = JSON.parse(xhr.responseText);

        dispatcher.handleAction({
          actionType: responseConstants.APPROVE_RESPONSE,
          data: surveyResponse
        });
      } else if (xhr.status === 400) {
        const error = xhr.responseText;

        dispatcher.handleAction({
          actionType: modalConstants.SHOW_ERROR_MODAL,
          data: {
            content: error
          }
        });
      } else if (xhr.status === 302) {
        dispatcher.handleAction({
          actionType: modalConstants.SHOW_ERROR_MODAL,
          data: {
            content: 'Your session has expired. Please refresh the page and try again.'
          }
        });
      } else if (xhr.status === 500) {
        dispatcher.handleAction({
          actionType: modalConstants.SHOW_ERROR_MODAL,
          data: {
            content:
              'Internal server error has occurred. Please try again or contact the system administrator.'
          }
        });
      } else {
        throw new Error(`Approve response action returned: Status ${xhr.status}, ${xhr.responseText}`);
      }
    };

    xhr.open('POST', `/responses/${response.id}/approve`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  }

  rejectResponse(response, emailContent) {
    const xhr = new XMLHttpRequest(); // eslint-disable-line
    const data = {
      email: response.questions['Submitter Email'],
      emailContent
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status === 200) {
        const surveyResponse = JSON.parse(xhr.responseText);

        dispatcher.handleAction({
          actionType: responseConstants.REJECT_RESPONSE,
          data: surveyResponse
        });
      } else if (xhr.status === 302) {
        dispatcher.handleAction({
          actionType: modalConstants.SHOW_ERROR_MODAL,
          data: {
            content: 'Your session has expired. Please refresh the page and try again.'
          }
        });
      } else if (xhr.status === 500) {
        dispatcher.handleAction({
          actionType: modalConstants.SHOW_ERROR_MODAL,
          data: {
            content:
              'Internal server error has occurred. Please try again or contact the system administrator.'
          }
        });
      } else {
        throw new Error(`Reject response failed. ${xhr.status}: ${xhr.responseText}`);
      }
    };

    xhr.open('POST', `/responses/${response.id}/reject`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  }
}

module.exports = new ResponseActions();
