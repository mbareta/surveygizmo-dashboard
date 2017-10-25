const React = require('react');
const icons = require('./icons/index');

const Icon = ({ width, height, icon }) => {
  const Svg = icons[icon];

  return <Svg width={width} height={height} />;
};

Icon.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  icon: React.PropTypes.string.isRequired
};

Icon.defaultProps = {
  width: 15,
  height: 15
};

module.exports = Icon;
