/**
 * First and second value must be comparable
 */
function compare(firstValue, secondValue) {
  if (firstValue < secondValue) {
    return -1;
  }

  return 1;
}

function compareBySubmittedAt(first, second) {
  const firstDate = new Date(first.submittedAt);
  const secondDate = new Date(second.submittedAt);

  return compare(firstDate, secondDate);
}

function compareByName(first, second) {
  const firstName = `${first.questions['Submitter First Name']} ${first.questions['Submitter Last Name']}`;
  const secondName = `${second.questions['Submitter First Name']} ${second.questions['Submitter Last Name']}`;

  return compare(firstName, secondName);
}

function compareByEmail(first, second) {
  const firstEmail = first.questions['Submitter Email'];
  const secondEmail = second.questions['Submitter Email'];

  return compare(firstEmail, secondEmail);
}

function compareByCompany(first, second) {
  const firstCompany = first.questions['Organization Name'];
  const secondCompany = second.questions['Organization Name'];

  return compare(firstCompany, secondCompany);
}

function compareByStatus(first, second) {
  return compare(first.statusString, second.statusString);
}

function withAscending(comparator) {
  return (first, second) => {
    if (comparator(first, second) === -1) {
      return 1;
    }
    return -1;
  };
}

const comparators = {
  name: compareByName,
  email: compareByEmail,
  company: compareByCompany,
  status: compareByStatus,
  submittedAt: compareBySubmittedAt
};

module.exports = { comparators, withAscending };
