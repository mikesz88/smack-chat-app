import React, { useContext } from 'react';
import propTypes from 'prop-types';
import { UserContext } from '../../App';
import  './UserAvatar.css';

const UserAvatar = ({ avatar, className, size }) => {
    const { authService } = useContext(UserContext);
    const { avatarName, avatarColor } = avatar;
    return (
        <img 
            className={`avatar-icon ${className} ${size}`}
            style={{backgroundColor: avatarColor || authService.avatarColor}} 
            src={avatarName || authService.avatarName} 
            alt="avatar" 
        />
    );
};

UserAvatar.propTypes = {
    className: propTypes.string,
    size: propTypes.string,
    avatar: propTypes.object,
}

UserAvatar.defaultProps = {
    className: '',
    size: 'lg',
    avatar: {},
}

export default UserAvatar;
