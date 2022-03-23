import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import Modal from '../Modal/Modal';
import UserAvatar from '../UserAvatar/UserAvatar';
import './ChatApp.css'
import { useNavigate, useLocation } from 'react-router-dom'
import Channels from '../Channels/Channels';
import socket from 'socket.io-client/lib/socket';
import Chats from '../Chats/Chats';
import AvatarList from '../AvatarList/AvatarList';
import Alert from '../Alert/Alert';


const ChatApp = () => {
  const { authService, socketService, chatService } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();  
  const [modal, setModal] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [unreadChannels, setUnreadChannels] = useState([]);
  const [editProfile, setEditProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false)
  const INIT_STATE = {
    _id: authService.id,
    name: authService.name,
    email: authService.email,
    avatarName: authService.avatarName,
    avatarColor: authService.avatarColor
  }
  const [userInfo, setUserInfo] = useState(INIT_STATE);

  const onChange = ({target: { name, value }}) => {
    setUserInfo({ ...userInfo, [name]: value });
  }

  const chooseAvatar = avatar => {
    setUserInfo({ ...userInfo, avatarName: avatar });
    setAvatarModal(false);
  }

  const generateBgColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    setUserInfo({ ...userInfo, avatarColor: `#${randomColor}` });
  }

  useEffect(() => {
    socketService.establishConnection();
    return () => socketService.closeConnection();
  }, []);

  useEffect(() => {
    socketService.getChatMessage((newMessage, messages) => {
      if (newMessage.channelId === chatService.selectedChannel.id) {
        setChatMessages(messages);        
      }
      if (chatService.unreadChannels.length) {
        setUnreadChannels(chatService.unreadChannels);
      }
    })
  }, []);

  useEffect(() => {
    setEditProfile(false);
  }, [modal]);

  useEffect(() => {
    const { _id, name, email, avatarName, avatarColor } = authService;
    setUserInfo({
      _id,
      name,
      email,
      avatarName,
      avatarColor,
    });
  }, [authService])

  const logoutUser = () => {
    authService.logoutUser();
    setModal(false);
    let from = location.state?.from?.pathname || "/";
    navigate(from, { replace: true });  
  } 

  const updateUser = e => {
    e.preventDefault();
    const { name, email, avatarName, avatarColor } = userInfo;
    setIsLoading(true);
    let from = location.state?.from?.pathname || "/";
    authService.updateUser(name, email, avatarName, avatarColor).then(() => {
      navigate(from, { replace: true });
      authService.setUserData({
        _id: authService.id,
        name,
        email,
        avatarName,
        avatarColor
      })
    }).catch((error) => {
      console.error('updating user', error)
      setError(true);
    })
    setModal(false);
    setIsLoading(false);
  }

  const deleteUser = () => {
    authService.deleteUser();
    logoutUser(); 
  }

  const { name, email, avatarName, avatarColor } = userInfo;
  const errorMessage = 'Error Updating account. Please try again.';

  return (
    <div className='chat-app'>
      <nav>
        <h1>Smack Chat</h1>
        <div className='user-avatar' onClick={() => setModal(true)} >
          <UserAvatar 
            avatar={{avatarName, avatarColor}} 
            size='sm' 
            className='nav-avatar'
          />
          <div>{name}</div>
        </div>
      </nav>
      <div className="smack-app">
        <Channels  unread={unreadChannels} />
        <Chats chats={chatMessages} />
      </div>


      <Modal title='Profile' isOpen={modal} close={() => setModal(false)} >
        {!editProfile ? (
          <>
            <button 
              style={{display: 'flex', width: '100px', justifyContent: 'center'}} 
              className='submit-btn' 
              onClick={() => setEditProfile(true)}>
                Edit Profile?
              </button>
            <div className='profile'>
              <UserAvatar />
              <h4>Username: {name}</h4>
              <h4>Email: {email}</h4>
            </div>
            <button onClick={logoutUser} className='submit-btn logout-btn'>Logout</button>
            <button onClick={deleteUser} style={{marginTop: '1rem'}} className='submit-btn logout-btn'>Delete User</button>
          </>
        ) : (
          <>
            {error ? <Alert message={errorMessage} type='alert-danger'/> : null}
            {isLoading ? <div>Loading...</div> : null}
            <form className='profile' onSubmit={updateUser}>
              <UserAvatar avatar={{avatarName, avatarColor}}/>
              <div onClick={() => setAvatarModal(true)} className='avatar-text'>Choose avatar</div>
              <div onClick={generateBgColor} className='avatar-text'>Generate background color</div>
              <h4>Username: </h4>
              <input 
                onChange={onChange}
                value={name}
                type="text" 
                className='editInput' 
                name="name" 
                placeholder='enter user name'
              />
              <h4>Email: </h4>
              <input 
                onChange={onChange}
                value={email}
                type="email" 
                className='editInput' 
                name="email" 
                placeholder='enter email'
              />
              <input className='submit-btn' type="submit" value='Update Account' />
            </form>

            <Modal title='Choose Avatar' isOpen={avatarModal} close={() => setAvatarModal(false)}>
              <AvatarList chooseAvatar={chooseAvatar} />
            </Modal>         
          </>
        )}    
      </Modal>
    </div>
  );
};

export default ChatApp;
