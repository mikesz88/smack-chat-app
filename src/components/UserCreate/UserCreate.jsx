import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import './UserCreate.css';
import { UserContext } from '../../App';
import Alert from '../Alert/Alert';
import UserAvatar from '../UserAvatar/UserAvatar';
import AvatarList from '../AvatarList/AvatarList';

const UserCreate = () => {
  const { authService } = useContext(UserContext);
  const INIT_STATE = {
    userName: '',
    email: '',
    password: '',
    avatarName: 'avatarDefault.png',
    avatarColor: 'none',
  }
  const [userInfo, setUserInfo] = useState(INIT_STATE);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onChange = ({target: { name, value }}) => {
    setUserInfo({ ...userInfo, [name]: value });
  }

  const chooseAvatar = avatar => {
    setUserInfo({ ...userInfo, avatarName: avatar });
    setModal(false);
  }

  const generateBgColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    setUserInfo({ ...userInfo, avatarColor: `#${randomColor}` });
  }

  const createUser = e => {
    e.preventDefault();
    const { userName, email, password, avatarName, avatarColor } = userInfo;
    if (!!userName && !!email && !!password) {
      setIsLoading(true);
      authService.registerUser(email, password).then(() => {
        authService.loginUser(email, password).then(() => {
          authService.createUser(userName, email, avatarName, avatarColor).then(() => {
            setUserInfo(INIT_STATE);
            let from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
          }).catch((error) => {
            console.error('creating user', error)
            setError(true);
          })
      }).catch((error) => {
        console.error('logging in user', error)
        setError(true);
      })
    }).catch((error) => {
      console.error('registering user', error)
      setError(true);
    })
    setIsLoading(false);
    }
  }

  const { userName, email, password, avatarName, avatarColor } = userInfo;
  const errorMessage = 'Error Creating account. Please try again.';

  return (
    <>
      <div className='center-display'>
        {error ? <Alert message={errorMessage} type='alert-danger'/> : null}
        {isLoading ? <div>Loading...</div> : null}
        <h3 className='title'>Create an account</h3>
        <form onSubmit={createUser} className='form'>
          <input 
            onChange={onChange}
            value={userName}
            type="text" 
            className='form-control' 
            name='userName' 
            placeholder='enter user name'
          />
          <input 
            onChange={onChange}
            value={email}
            type="email" 
            className='form-control' 
            name='email' 
            placeholder='enter email'
          />
          <input 
            onChange={onChange}
            value={password}
            type="password" 
            className='form-control' 
            name='password' 
            placeholder='enter password'
          />
          <div className='avatar-container'>
            <UserAvatar avatar={{avatarName, avatarColor}} className='create-avatar' />
            <div onClick={() => setModal(true)} className='avatar-text'>Choose avatar</div>
            <div onClick={generateBgColor} className='avatar-text'>Generate background color</div>
          </div>
          <input className='submit-btn' type="submit" value='Create Account' />
        </form>
        <div className='footer-text'>Already have an Account? Login <Link to='/login'>Here</Link></div>
      </div>

      <Modal title='Choose Avatar' isOpen={modal} close={() => setModal(false)}>
        <AvatarList chooseAvatar={chooseAvatar} />
      </Modal>
    </>
  );
};

export default UserCreate;
