//import { text } from 'framer-motion/client';
import React, { useState, useEffect } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
function EntryForm({ addEntry }) {
  const [text, setText] = useState('');
  const [buttonColor, setButtonColor] = useState('#F5F0E3'); // Initial button color
  const [showPopup, setShowPopup] = useState(false); // State for showing the pop-up
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

 // Update windowWidth state on resize
 useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);

  // Cleanup on component unmount
  return () => window.removeEventListener('resize', handleResize);
}, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      const newEntry = {
        id: Date.now(),
        text,
        date: new Date().toLocaleDateString(),
      };
      addEntry(newEntry);
      setText('');
      //setButtonColor('#D3D3D3'); // Change button color after clicking
      setShowPopup(true);
      // Hide the pop-up after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000); // 3000ms = 3 seconds
    }
  };
  const formStyle = {
    ...styles.form,
  };

  
  if (windowWidth <= 1250 && windowWidth >=750) {
    formStyle.width = '600px';
  } else if (windowWidth <= 750 && windowWidth >=300){
    formStyle.width = '320px';
  } else {
    formStyle.width = '1100px';
  }


  return (
    <div style={styles.formWrapper} className="formWrapper">
      <form onSubmit={handleSubmit} style={formStyle}
>
        <textarea
          style={styles.textarea}
          css={styles.textarea}
          placeholder="write your thoughts here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button 
          type="submit" 
          css={styles.button}
          style={{ ...styles.button, backgroundColor: buttonColor, width: formStyle.width, }}
          onMouseDown={() => setButtonColor('#D7D1C8')} // Temporary color when pressed
          onMouseUp={() => setButtonColor('#F5F0E3')} // Revert to the clicked color
        >Save</button>
              {/* Pop-up message */}
              {showPopup && <div style={styles.popup} className="popup">Your note has been saved to 'my journal' ❀</div>}

      </form>
    </div>
  );
}


const styles = {
  formWrapper: {
    position: 'relative',
    transition: 'all 0.3s ease',
    margin: '0 auto',
    flex: 1,
    display: 'flex',
    //width: '1100px',
    justifyContent: 'center',
  },

  form: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
    width: '1100px',

    
  },

  textarea: css`

    min-height: 700px;
    margin-bottom: 10px;
    padding-top: 40px;
    padding-left:40px;
    background-color: #F5F0E3;
    border-radius: 6px;
    font-size: 3vw;
    font-family: Arial;
    color: #333;
    border-color: transparent;
    box-sizing: border-box; 

    @media (max-width: 375px) {
        min-height: 200px;
        padding-top: 20px;
        padding-left:20px;
    }
   `,


  button: css`
    padding-block: 13px;
    background-color: red;
    color: black;
    border: transparent;
    border-radius: 6px;
    cursor: pointer;
    width: 1100px;
    margin:auto;
    boxSizing:border-box;
    font-size: 1.5rem;
    
    @media (max-width: 375px) {
       padding-block: 6px;
       background-color: red;
       font-size: .65rem;

    }


  `,


};

export default EntryForm;
