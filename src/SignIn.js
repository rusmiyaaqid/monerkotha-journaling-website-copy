import React, { useState, useEffect } from 'react';
import {GoogleButton} from 'react-google-button';
import {UserAuth} from './AuthContext';
import {useNavigate} from 'react-router-dom'

const SignIn = () => {

  const [error, setError] = useState(null);
  const{googleSignIn, user} = UserAuth();
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    if (user !=null){
      navigate('/myjournal');
    }
  }, [user]);

  return ( 
    <div className="signContainer">
     <div className="miniContainer">
        {error && <p>{error}</p>}
        <p className="Title">Welcome</p>
        <p className="TitleText">Sign in to continue to monerkotha </p>


        <div>
          <GoogleButton onClick={handleGoogleSignIn} style={styles.GoogleButton} className="GoogleButton"/>
        </div>
      </div>
    </div>
  );
};


const styles={

  GoogleButton: {
    backgroundColor: '#FCF8EF',
    color:'black',
    borderRadius:'5px',
    fontSize:'13px',
    boxShadow:'none',
    border: '.5px solid #E1DDD8',

    '@media (max-width: 375px)': {
      fontSize: 'px', 
      padding: '5px 10px', 
    },


  },

};

export default SignIn;
