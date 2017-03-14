const React = require('react');
const FormResponse = require('./formResponse/formResponse.jsx');

module.exports = class FormResponses extends React.Component {
  constructor() {
    super();

    this.state = {
      responses: []
    }
  }

  getResponses() {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        this.setState({responses: JSON.parse(xhr.responseText)});
      }
      else if (xhr.readyState === 4 && xhr.status !== 200) {
        throw new Error('Fetching responses failed');
      }
    }

    xhr.open('GET', '/responses', true);
    xhr.send();
  }

  componentDidMount() {
    this.getResponses()
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
              <td>Submitted at</td>
              <td>Company Name</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {
              this.state.responses.map(response =>
                <FormResponse key={`form-response-${response.id}`} response={response} />
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
}
