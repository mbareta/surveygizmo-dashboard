const React = require('react');

class FormResponse extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      approved: false
    };
  }

  getStatusString() {
    const { status } = this.props.response;

    if (typeof status === 'undefined') {
      return 'Pending';
    }
    else if (status.rejected) {
      return 'Rejected';
    }
    else if (
      status.sentPasswordReset &&
      status.grantedCcxRole &&
      status.accountCreated
    ) {
      return 'Approved';
    }
    return 'Error. Stuck in limbo.';
  }

  render() {
    const { response, showApproveModal, showRejectModal } = this.props;
    const { questions } = response;

    return (
      <tr className={`form-responses-item ${this.state.approved ? 'approved' : 'not-approved'}`}>
        <td>{`${questions['Full name']}`}</td>
        <td>{questions['Submitter Email']}</td>
        <td>{questions.Organization}</td>
        <td>{(new Date(response.submittedAt)).toLocaleDateString()}</td>
        <td>{this.getStatusString()}</td>
        <td>
          <button onClick={() => showApproveModal(response)}>Approve</button>
          <button onClick={() => showRejectModal(response)}>Reject</button>
        </td>
      </tr>
    );
  }
}

FormResponse.propTypes = {
  response: React.PropTypes.object.isRequired, // eslint-disable-line
  showApproveModal: React.PropTypes.func.isRequired,
  showRejectModal: React.PropTypes.func.isRequired
};

module.exports = FormResponse;
