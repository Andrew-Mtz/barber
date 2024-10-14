import './spinner.css';
import PropTypes from 'prop-types';

const Spinner = ({ styles }) => {
  return <div style={styles} className="loading-spinner"></div>;
};

Spinner.propTypes = {
  styles: PropTypes.object,
};

export default Spinner;
