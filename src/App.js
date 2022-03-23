import React, { useState, createContext, useContext } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import ChatApp from './components/ChatApp/ChatApp';
import UserLogin from './components/UserLogin/UserLogin';
import UserCreate from './components/UserCreate/UserCreate';
import { AuthService, ChatService, SocketService } from './services';


const authService = new AuthService();
const chatService = new ChatService(authService.getBearerHeader);
const socketService = new SocketService(chatService);
export const UserContext = createContext();
const AuthProvider = ({ children }) => {
  const context = {
    authService,
    chatService,
    socketService,
    appSelectedChannel: {},
    appSetChannel: (ch) => {
      setAuthContext({ ...authContext, appSelectedChannel: ch })
      chatService.setSelectedChannel(ch);
    }
  }

  const [authContext, setAuthContext] = useState(context);

  return (
    <UserContext.Provider value={authContext}>
      {children}
    </UserContext.Provider>
  )
}

const PrivateRoute = ({ children }) => { //...props is not needed for now I think
  const context = useContext(UserContext)
  const location = useLocation(); //useLocation from react router dom

  if (!context.authService.isLoggedIn) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  } // Navigate is from react router dom instead of Redirect

  return children;

  // return (
  //   <Route {...props} render={({ location }) => isLoggedIn
  //   ? (children)
  //   : (<Redirect to={{ pathName: '/login', state: { from: location } }} />)
  //   }
  //   />
  // )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* <Route path="/" element={<ChatApp />} /> */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserCreate />} />
          <Route 
            path="/"
            element={
            <PrivateRoute>
              <ChatApp />
            </PrivateRoute>}
          />
        </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
