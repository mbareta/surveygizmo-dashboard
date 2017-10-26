const React = require('react');

const cx = require('classNames');
const { withAscending } = require('../../utils/responses');

class Sort extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ascending: false
    };
  }

  onClick() {
    const { onSort, comparator } = this.props;
    const { ascending } = this.state;
    if (ascending) {
      onSort(withAscending(comparator));
    } else {
      onSort(comparator);
    }

    this.setState(({ ascending }) => ({ ascending: !ascending }));
  }

  render() {
    const { className, children } = this.props;
    const { ascending } = this.state;

    return (
      <button
        className={cx('no-chrome no-print sort-button', className)}
        onClick={() => this.onClick()}
      >
        {children(ascending)}
      </button>
    );
  }
}

Sort.propTypes = {
  onSort: React.PropTypes.func.isRequired,
  className: React.PropTypes.string,
  children: React.PropTypes.func.isRequired
};

module.exports = Sort;
