const React = require('react');
const FormResponse = require('./formResponse/formResponse.jsx');
const ApproveModal = require('../modals/approveModal/approveModal.jsx');
const RejectModal = require('../modals/rejectModal/rejectModal.jsx');

module.exports = class FormResponses extends React.Component {
  constructor() {
    super();

    this.showApproveModal = this.showApproveModal.bind(this);
    this.showRejectModal = this.showRejectModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.state = {
      responses: [],
      approveResponse: null,
      rejectResponse: null
    };
  }

  getResponses() {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.setState({ responses: JSON.parse(xhr.responseText) });
      }
      else if (xhr.readyState === 4 && xhr.status !== 200) {
        throw new Error('Fetching responses failed');
      }
    };

    xhr.open('GET', '/responses', true);
    xhr.send();
  }

  showApproveModal(approveResponse) {
    this.setState({ approveResponse });
  }

  showRejectModal(rejectResponse) {
    this.setState({ rejectResponse });
  }

  closeModal() {
    this.setState({
      rejectResponse: null,
      approveResponse: null
    });
  }

  componentDidMount() {
    this.getResponses();
  }

  render() {
    return (
      <div>
        <h2>
          Affiliate Signup Responses ({this.state.responses.length})
        </h2>
        <table className="form-responses">
          <thead>
            <tr>
              <td>Name</td>
              <td>Email</td>
              <td>Company Name</td>
              <td>Submitted at</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {
              this.state.responses.map(response =>
                <FormResponse
                  key={`form-response-${response.id}`}
                  response={response}
                  showApproveModal={this.showApproveModal}
                  showRejectModal={this.showRejectModal}
                />
              )
            }
          </tbody>
        </table>

        <ApproveModal response={this.state.approveResponse} close={this.closeModal}/>
        <RejectModal response={this.state.rejectResponse} close={this.closeModal}/>
      </div>
    );
  }
};
