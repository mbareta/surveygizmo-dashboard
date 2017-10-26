const React = require('react');
const FormResponse = require('./formResponse/formResponse.jsx');
const Icon = require('../../icon/index.jsx');
const Sort = require('../../sort/index.jsx');
const { comparators } = require('../../../utils/responses');

const { array, bool, func } = React.PropTypes;

const FormResponsesTable = ({ isPrinting, responses, onSort }) => (
  <table className={`${isPrinting ? '' : 'no-print'} form-responses`}>
    <thead>
      <tr>
        <td>
          Name
          <Sort
            comparator={comparators.name}
            onSort={onSort}
          >
            {ascending => <Icon icon={ ascending ? 'sortAsc' : 'sortDesc'} />}
          </Sort>
        </td>
        <td>
          Email
          <Sort
            comparator={comparators.email}
            onSort={onSort}
          >
            {ascending => <Icon icon={ ascending ? 'sortAsc' : 'sortDesc'} />}
          </Sort>
        </td>
        <td>
          Company Name
          <Sort
            comparator={comparators.company}
            onSort={onSort}
          >
            {ascending => <Icon icon={ ascending ? 'sortAsc' : 'sortDesc'} />}
          </Sort>
        </td>
        <td>
          Submitted at
          <Sort
            comparator={comparators.submittedAt}
            onSort={onSort}
          >
            {ascending => <Icon icon={ ascending ? 'sortAsc' : 'sortDesc'} />}
          </Sort>
        </td>
        <td>
          Status
          <Sort
            comparator={comparators.status}
            onSort={onSort}
          >
            {ascending => <Icon icon={ ascending ? 'sortAsc' : 'sortDesc'} />}
          </Sort>
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
