
//removed sensitive content
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './Home.js';
import Journal from './Journal.js';
import AboutPage from './AboutPage.js';
import SignIn from './SignIn.js'; // Import the SignIn component

import reportWebVitals from './reportWebVitals';
import {HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Link} from 'react-router-dom';
import { AuthContextProvider } from './AuthContext.js';
import {UserAuth} from './AuthContext'
import Protected from './Protected'
import { useLocation } from 'react-router-dom';




function Navbar() {
  const {user, logOut} = UserAuth();
  const location = useLocation(); // Get the current route
   // Don't show the navbar on the sign-in page
 

 
  const handleSignOut = async () => {
    try{
      await logOut()
    } catch (error) {
      console.log(error)
    }
    //signOut(auth);
  };

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const handleScroll = () => {
    if (window.scrollY === 0) {
      // User is at the top of the page
      setShowNavbar(true);
    } else if (window.scrollY > lastScrollY) {
      // Scrolling down
      setShowNavbar(false);
    } else {
      // Scrolling up
      setShowNavbar(true);
    }
    setLastScrollY(window.scrollY);
  };
  

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  if (location.pathname === '/signin') {
    return null;
  }

  return (
    <nav className={`navbar ${showNavbar ? '' : 'navbar-hidden'}`}>
      <div className="navbar-logo">
        <a href="/">monerkotha</a>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to ="/" className="homelink">home</Link>
        </li>
        <li>
          <Link to ="/about" className="aboutlink">about</Link>
        </li>
        <li>
          <Link to ="/myjournal" className="myjournallink">my journal</Link>
        </li>
        <li>
          {user?.displayName? (
            <Link button onClick = {handleSignOut} className="signinlink">logout</Link>
           ) : (
           <Link to ="/signin" className="signinlink">sign in</Link> 
          )}
          {/*<Link to ="/signin" className="signinlink">sign in</Link>*/}
        </li>
      </ul>
    </nav>
  );
}
  



//MEMEHEADER STUFF BELOW:

function App() {
  return (
    <div>
      <AuthContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/myjournal"
            element={
              <Protected>
                <Journal />
              </Protected>
            }
          />
        </Routes>
      </AuthContextProvider>
      </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  
  </BrowserRouter>
);


reportWebVitals();
