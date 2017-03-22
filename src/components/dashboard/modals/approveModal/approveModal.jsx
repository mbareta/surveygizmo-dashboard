const React = require('react');

module.exports = class ApproveModal extends React.Component {
  constructor() {
    super();

    this.approveResponse = this.approveResponse.bind(this);
    this.close = this.close.bind(this);
    this.updateEmailContent = this.updateEmailContent.bind(this);

    this.state = {
      open: false,
      emailContent: ''
    };
  }

  approveResponse() {
    const xhr = new XMLHttpRequest();
    const data = {
      emailContent: this.state.emailContent
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.setState({ approved: true });
        this.close();
      }
      else if (xhr.readyState === 4 && xhr.status !== 200) {
        throw new Error('Approve response failed');
      }
    };

    xhr.open('POST', `/responses/${this.props.response.id}/approve`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  }

  close() {
    const { close } = this.props;
    typeof close === 'function' && close();
    this.setState({ open: false });
  }

  updateEmailContent(textarea) {
    this.setState({ emailContent: textarea.value });
  }

  componentWillUpdate(nextProps) {
    if (!(nextProps === this.props)) {
      this.setState({
        open: !!nextProps.response,
        emailContent: `Dear ${nextProps.response && nextProps.response.questions['Full name']},
we have approved your account.
Go to edx and log in.`
      });
    }
  }

  render() {
    const { response } = this.props;

    return this.state.open && (
      <div className="approve-modal">
        <button className="close-modal" onClick={this.close}>
          Close
        </button>
        <div className="approve-modal-content">
          <h1>Approve application for {response.questions['Full name']}?</h1>
          <label htmlFor="">
            The following email will be sent to {response.questions['Submitter Email']}:
          </label>
          <textarea
            rows="6"
            onChange={this.updateEmailContent}
            value={this.state.emailContent}
          />
          <button onClick={this.approveResponse}>Yes</button>
          <button onClick={this.close}>No</button>
          <hr/>
          <br/>
          <p>
            <b>WARNING</b>: Approving this application will
            create a user account for this person and
            grant them CCX Coach role on your course.
          </p>
        </div>
      </div>
    );
  }
};
