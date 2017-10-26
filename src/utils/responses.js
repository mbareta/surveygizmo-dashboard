/**
 * First and second value must be comparable
 */
function compareStrings(first, second) {
  return first.localeCompare(second, { sensitivity: 'accent' });
}

function compareBySubmittedAt(first, second) {
  const firstDate = new Date(first.submittedAt);
  const secondDate = new Date(second.submittedAt);

  if (firstDate < secondDate) {
    return -1;
  }

  return 1;
}

function compareByName(first, second) {
  const firstName = `${first.questions['Submitter First Name']} ${first.questions[
    'Submitter Last Name'
  ]}`;
  const secondName = `${second.questions['Submitter First Name']} ${second.questions[
    'Submitter Last Name'
  ]}`;

  return compareStrings(firstName, secondName);
}

function compareByEmail(first, second) {
  const firstEmail = first.questions['Submitter Email'];
  const secondEmail = second.questions['Submitter Email'];

  return compareStrings(firstEmail, secondEmail);
}

function compareByCompany(first, second) {
  const firstCompany = first.questions['Organization Name'];
  const secondCompany = second.questions['Organization Name'];

  return compareStrings(firstCompany, secondCompany);
}

function compareByStatus(first, second) {
  return compareStrings(first.statusString, second.statusString);
}

function withAscending(comparator) {
  return (first, second) => {
    if (comparator(first, second) < 0) {
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
  submittedAt: compareBySubmittedAt,
};

module.exports = { comparators, withAscending };
