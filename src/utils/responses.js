function compareBySubmittedAt(first, second) {
  const firstDate = new Date(first.submittedAt);
  const secondDate = new Date(second.submittedAt);

  if (firstDate > secondDate) {
    return -1;
  }

  return 1;
}

function compareByName(first, second) {
  const firstName = `${first.questions['Submitter First Name']} ${first.questions['Submitter Last Name']}`;
  const secondName = `${second.questions['Submitter First Name']} ${second.questions['Submitter Last Name']}`;

  if (firstName < secondName) {
    return -1;
  }

  return 1;
}

function compareByEmail(first, second) {
  const firstEmail = first.questions['Submitter Email'];
  const secondEmail = second.questions['Submitter Email'];

  if (firstEmail < secondEmail) {
    return -1;
  }

  return 1;
}

function compareByCompany(first, second) {
  const firstCompany = first.questions['Organization Name'];
  const secondCompany = second.questions['Organization Name'];

  if (firstCompany < secondCompany) {
    return -1;
  }

  return 1;
}

function compareByStatus(first, second) {
  if (first.statusString < second.statusString) {
    return -1;
  }

  return 1;
}

function withReverse(comparator) {
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

module.exports = { comparators, withReverse };
