import React from 'react';
import propTypes from 'prop-types';
import './Modal.css';

const Modal = ({ children, title, close, isOpen }) => (
    <>
        {isOpen ? (
            <div className='modal'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h5 className='modal-title'>{title}</h5>
                        <button onClick={() => close(false)} className='close'>&times;</button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
        ) : null}
    </>
);

Modal.propTypes = {
    title: propTypes.string,
    close: propTypes.func,
    isOpen: propTypes.bool,
}

Modal.defaultProps = {
    title: 'Title',
    close: () => {},
    isOpen: false
}

export default Modal;
