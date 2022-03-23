import React, { useState } from 'react'
import { DARK_AVATARS, LIGHT_AVATARS } from '../../constants'
import './AvatarList.css';

const AvatarList = ({ chooseAvatar }) => {
  const [theme, setTheme] = useState('dark');
  const [darkBg, setDarkBg] = useState('gray');
  const [lightBg, setLightBg] = useState('lightgray');

  const selectThemedAvatar = value => {
    setTheme(value);
    if (value === 'dark') {
      setDarkBg('gray');
      setLightBg('lightgray');
    } else {
      setDarkBg('lightgray');
      setLightBg('gray');
    }
  }

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
        <button
          onClick={() => selectThemedAvatar('dark')}
          style={{backgroundColor: darkBg, cursor: 'pointer', paddingLeft: '0.5rem', paddingRight: '0.5rem'}}>
            Dark
        </button>
        <button
        onClick={() => selectThemedAvatar('light')}
        style={{backgroundColor: lightBg, cursor: 'pointer', paddingLeft: '0.5rem', paddingRight: '0.5rem'}}>
          Light
        </button>
      </div>
      <div className='avatar-list'>
        {theme === 'dark' ? (
          DARK_AVATARS.map(img => (
            <div role='presentation' key={img} className='create-avatar' onClick={() => chooseAvatar(img)}>
              <img src={img} alt="avatar" />
            </div>
          ))
        ) : (
          LIGHT_AVATARS.map(img => (
            <div role='presentation' key={img} className='create-avatar' onClick={() => chooseAvatar(img)}>
              <img style={{backgroundColor: 'lightgray'}} src={img} alt="avatar" />
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default AvatarList