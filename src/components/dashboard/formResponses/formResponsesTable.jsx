const React = require('react');
const FormResponse = require('./formResponse/formResponse.jsx');
const { comparators } = require('../../../utils/responses');

const { array, bool, func } = React.PropTypes;

const FormResponsesTable = ({ isPrinting, responses, onSort }) => (
  <table className={`${isPrinting ? '' : 'no-print'} form-responses`}>
    <thead>
      <tr>
        <td>
          Name
          <button onClick={() => onSort(comparators.name)}>ˆ</button>
        </td>
        <td>
          Email
          <button onClick={() => onSort(comparators.email)}>ˆ</button>
        </td>
        <td>
          Company Name
          <button onClick={() => onSort(comparators.company)}>ˆ</button>
        </td>
        <td>
          Submitted at
          <button onClick={() => onSort(comparators.submittedAt)}>ˆ</button>
        </td>
        <td>
          Status
          <button onClick={() => onSort(comparators.status)}>ˆ</button>
        </td>
        <td className="no-print">Actions</td>
      </tr>
    </thead>
    <tbody>
      {
        responses.map(response =>
          <FormResponse
            key={`form-response-${response.id}`}
            response={response}
            viewResponse={this.viewResponse}
          />
        )
      }
    </tbody>
  </table>);

FormResponsesTable.propTypes = {
  responses: array.isRequired, // eslint-disable-line
  isPrinting: bool.isRequired,
  onSort: func.isRequired
};

module.exports = FormResponsesTable;
