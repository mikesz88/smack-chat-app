import React from 'react';
import propTypes from 'prop-types';
import './Alert.css';

const Alert = ({ message, type }) => (
    <div className={`alert ${type}`} role='alert'>
        {message}
    </div>
);

Alert.propTypes = {
    message: propTypes.string,
    type: propTypes.string,
}

Alert.defaultProps = {
    message: 'Alert Message',
    type: 'success',
}

export default Alert;
