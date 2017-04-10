const React = require('react');
const ErrorModal = require('../../modals/errorModal/errorModal.jsx');
const responsesStore = require('../../../../stores/responses');
const responseActions = require('../../../../actions/response');

const FormResponseDetails = ({ showApproveModal, showRejectModal }) => {
  const response = responsesStore.getViewResponse();
  if (!response) return null;

  const { questions } = response;
  const isApprovedOrRejected = response.statusString === 'Approved' || response.statusString === 'Rejected';
  const noop = Function.prototype;

  let approveButton;
  let rejectButton;
  if (isApprovedOrRejected) {
    approveButton = <button onClick={noop} disabled>Approve</button>;
    rejectButton = <button onClick={noop} disabled>Reject</button>;
  } else {
    approveButton = <button onClick={() => showApproveModal(response)}>Approve</button>;
    rejectButton = <button onClick={() => showRejectModal(response)}>Reject</button>;
  }

  return (
    <div className="form-response-details">
      <ErrorModal />
      <div className="content">
        <h1>
          {response.statusString}
        </h1>
        {
          Object.keys(questions).map(key =>
            <p key={`view-response-details-${response.id}-${key}`}>
              <b>{key}</b>
              {questions[key]}
            </p>
          )
        }
      </div>
      <button onClick={responseActions.closeViewResponse}>Close</button>
      {approveButton}
      {rejectButton}
    </div>
  );
};

FormResponseDetails.propTypes = {
  showApproveModal: React.PropTypes.func.isRequired,
  showRejectModal: React.PropTypes.func.isRequired
};

module.exports = FormResponseDetails;
