/* eslint-disable */
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

  if (isApprovedOrRejected) {
    var approveButton = <button className="no-print" onClick={noop} disabled>Approve</button>; // eslint-disable-line
    var rejectButton = <button className="no-print" onClick={noop} disabled>Reject</button>; // eslint-disable-line
  } else {
    var approveButton = <button className="no-print" onClick={() => showApproveModal(response)}>Approve</button>; // eslint-disable-line
    var rejectButton = <button className="no-print" onClick={() => showRejectModal(response)}>Reject</button>; // eslint-disable-line
  }

  return (
    <div className="form-response-details">
      <ErrorModal />
      <div className="content">
        <h1>
          {response.statusString}
        </h1>
        {
          [
            'Organization Name', 'Street Address', 'Street Address 2', 'City', 'State', 'Postal Code',
            'Affiliate Phone Number - please format: xxx-xxx-xxxx', 'Website', 'Submitter First Name',
            'Submitter Last Name', 'Submitter Email', 'Submitter Phone Number - please format: xxx-xxx-xxxx',
            'Are you (submitter) our main point of contact?', 'Point of contact First Name', 'Point of contact Last Name',
            'Point of contact email', 'Point of contact phone number - please format: xxx-xxx-xxxx',
            'Public Contact - Display Website', 'Public Contact E-mail', 'Public Contact Phone number - please format: xxx-xxx-xxxx',
            'Social - Facebook', 'Social - Twitter', 'Social - LinkedIn', 'Organization Tax Status',
            'Organization Type', 'Mission Statement', 'What do you provide to entrepreneurs, at present?',
            'How many entrepreneurs do you serve each year?', 'Does your organization currently offer entrepreneurship education?',
            'How would you describe your curriculum?', 'Do you have more demand for your services than capability to offer services?',
            'What are your goals for educating entrepreneurs?', 'Describe your target market for this product?',
            'How do you plan on marketing this product?', 'How did you hear about Kauffman FastTrac?'
          ].map(key =>
            <p key={`view-response-details-${response.id}-${key}`}>
              <b>{key}</b>
              {questions[key]}
            </p>
          )
        }
      </div>
      <button className="no-print" onClick={responseActions.closeViewResponse}>Close</button>
      <button className="no-print" onClick={window.print}>Print</button>
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
