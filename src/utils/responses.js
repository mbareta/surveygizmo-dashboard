function compareBySubmittedAt(fst, sec) {
  const fstDate = new Date(fst.submittedAt);
  const secDate = new Date(sec.submittedAt);

  if (fstDate > secDate) {
    return -1;
  }

  return 1;
}

module.exports = compareBySubmittedAt;
