function compareBySubmittedAt(first, second) {
  const firstDate = new Date(first.submittedAt);
  const secondDate = new Date(second.submittedAt);

  if (firstDate > secondDate) {
    return -1;
  }

  return 1;
}

module.exports = compareBySubmittedAt;
