import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import Alert from '../Alert/Alert';

const UserLogin = () => {
  const { authService } = useContext(UserContext);
  const [userLogins, setUserLogins] = useState({ email: '', password: '' });
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onChange = ({target: { name, value }}) => {
    setUserLogins({ ...userLogins, [name]: value });
  }

  const onLoginUser = (e) => {
    e.preventDefault();
    const { email, password } = userLogins;
    if (!!email && !!password) {
      let from = location.state?.from?.pathname || "/";
      authService.loginUser(email, password)
      .then(() => navigate(from, { replace: true }))
      .catch(() => {
        setError(true);
        setUserLogins({ email: '', password: '' });
      })
    }
  }

  const errorMsg = 'Sorry, you entered an incorrect email or password';

  return (
    <div className='center-display'>
      {error ? <Alert message={errorMsg} type='alert-danger' /> : null}
      <form  onSubmit={onLoginUser} className='form'>
        <label htmlFor='credentials'>Enter your <strong>email address</strong> and <strong>password</strong></label>
        <input 
          onChange={onChange} 
          value={userLogins.email}
          id='credentials1' 
          type="email"
          className='form-control' 
          name='email' 
          placeholder='elonmusk@tesla.com' />
        <input 
          onChange={onChange} 
          value={userLogins.password}
          id='credentials2' 
          type="password" 
          className='form-control' 
          name='password' 
          placeholder='password'/>
        <input id='credentials3' type="submit" className='submit-btn' value='Sign In' />
      </form>
      <div className='footer-text'>
        No Account? Create one
        <Link to='/register'> HERE</Link>
      </div>
    </div>
  );
};

export default UserLogin;
