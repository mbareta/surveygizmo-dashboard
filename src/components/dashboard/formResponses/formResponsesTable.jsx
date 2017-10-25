const React = require('react');
const FormResponse = require('./formResponse/formResponse.jsx');
const Icon = require('../../icon/index.jsx');
const { comparators } = require('../../../utils/responses');

const { array, bool, func } = React.PropTypes;

const FormResponsesTable = ({ isPrinting, responses, onSort }) => (
  <table className={`${isPrinting ? '' : 'no-print'} form-responses`}>
    <thead>
      <tr>
        <td>
          Name
          <button
            className="no-chrome no-print sort-button"
            onClick={() => onSort(comparators.name)}
          >
            <Icon icon="sortDesc" />
          </button>
        </td>
        <td>
          Email
          <button
            className="no-chrome no-print sort-button"
            onClick={() => onSort(comparators.email)}
          >
            <Icon icon="sortDesc" />
          </button>
        </td>
        <td>
          Company Name
          <button
            className="no-chrome no-print sort-button"
            onClick={() => onSort(comparators.company)}
          >
            <Icon icon="sortDesc" />
          </button>
        </td>
        <td>
          Submitted at
          <button
            className="no-chrome no-print sort-button"
            onClick={() => onSort(comparators.submittedAt)}
          >
            <Icon icon="sortDesc" />
          </button>
        </td>
        <td>
          Status
          <button
            className="no-chrome no-print sort-button"
            onClick={() => onSort(comparators.status)}
          >
            <Icon icon="sortDesc" />
          </button>
        </td>
        <td className="no-print">Actions</td>
      </tr>
    </thead>
    <tbody>
      {responses.map(response => (
        <FormResponse
          key={`form-response-${response.id}`}
          response={response}
          viewResponse={this.viewResponse}
        />
      ))}
    </tbody>
  </table>
);

FormResponsesTable.propTypes = {
  responses: array.isRequired, // eslint-disable-line
  isPrinting: bool.isRequired,
  onSort: func.isRequired
};

module.exports = FormResponsesTable;
