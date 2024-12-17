import React, { useState, useEffect } from 'react';
import EntryForm from './EntryForm.js';
//import EntryList from './EntryList.js';
import { onSnapshot, addDoc } from 'firebase/firestore';
import { notesCollection, notesCollection2 } from './firebase.js';
import flower from './flower.png';
//import wheel from './wheel.png';
import memesData from './memesData.js';
import wheel2 from './wheel2.png';

import {Timestamp } from 'firebase/firestore';
//import { auth} from './firebase';
//import CharityDashboard from './CharityDashboard';
import {UserAuth} from './AuthContext'
//import { onAuthStateChanged } from "firebase/auth";
//import { collection, getDocs, query, where } from "firebase/firestore";
import CryptoJS from "crypto-js";

function Meme({ meme, getMemeImage, isSpinning }) {
  return (
    <main>
      <div className="form">
        <button onClick={getMemeImage}>
          <img src={wheel2} alt="Spin Wheel" className={`wheel-image2 ${isSpinning ? "spin" : ""}`} />
        </button>
      </div>
   
    </main>
  );
}

function Home() {
  /*from Meme component
  */
  const {user}=UserAuth();
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  useEffect(() => {
    // Show the "Please sign in" pop-up if the user is not logged in
    if (!user) {
      setShowSignInPopup(true);
    } else {
      setShowSignInPopup(false); // Hide the pop-up if user is logged in
    }
  }, [user]); // Dependency on user, so it updates when user logs in or out




 const [meme, setMeme] = useState({
    randomImage: "",
    name: "",
    info: "",
    donate:"",
  });
  
  const [allMemes, setAllMemes] = useState(memesData);
  const [isSpinning, setIsSpinning] = useState(false);

  function getMemeImage() {
    setIsSpinning(true);

    setTimeout(() => {
      const memesArray = allMemes.data.memes;
      const randomNumber = Math.floor(Math.random() * memesArray.length);
      const randomMeme = memesArray[randomNumber];

      setMeme({
        randomImage: randomMeme.url,
        name: randomMeme.name,
        info: randomMeme.info,
        donate: randomMeme.donate,
      });

      setIsSpinning(false);
    }, 2000);
  }
  /* meme component ends*/



  const [entries, setEntries] = useState([]);
  const [archivedEntries, setArchivedEntries] = useState([]);
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Secret key stored in .env file


  // Load entries and archived entries from Firestore on initial render
  useEffect(() => {
    const unsubscribeEntries = onSnapshot(notesCollection, (snapshot) => {
      const notesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // Sort entries by updatedAt in descending order
      const sortedNotes = notesArr.sort((a, b) => b.createdAt - a.createdAt);
      //const sortedNotes = notesArr.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

      setEntries(sortedNotes);
    });

    const unsubscribeArchivedEntries = onSnapshot(notesCollection2, (snapshot) => {
      const archivedArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // Sort archived entries by updatedAt in descending order
      const sortedArchivedNotes = archivedArr.sort((a, b) => b.createdAt - a.createdAt);
      setArchivedEntries(sortedArchivedNotes);

    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeEntries();
      unsubscribeArchivedEntries();
    };
  }, []);


// Encrypt the entry text
const encryptText = (text) => {
  if (!secretKey) {
      console.error("Encryption key is not defined.");
      return text; // Return the original text if no key is available
  }

  try {
      return CryptoJS.AES.encrypt(text, secretKey).toString();
  } catch (error) {
      console.error("Error encrypting text:", error);
      return ""; // Return empty string if encryption fails
  }
};

  // Add a new entry to Firestore
  const addEntry2 = async (entry) => {
    if (!user?.uid) {
        console.error("User is not authenticated.");
        return;
    }

    const encryptedText = encryptText(entry.text); // Encrypt the text
    console.log("Adding note for user ID:", user.uid); // Debugging line

    try {
        await addDoc(notesCollection, {
            text: encryptedText,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            userId: user.uid, // Store the user ID with the note
        });
        console.log("Note added successfully!");
    } catch (error) {
        console.error("Error adding entry:", error);
    }
};

  
  const handleDonateClick = () => {
    window.open(meme.donate, '_blank');  // Open the URL in a new tab
  };
  return (
    <div className= "appContainer">
      <div className="left-border" ></div>
      <div className="contentsHome" >
        
        <img src={flower} alt="Journal" className="journal-image"/>
       
        <h1 className="note-title">
          Today I am <span className="highlight">grateful</span> for
        </h1>
        {showSignInPopup && (
        <div className="popup">
          Please sign in to save and view your notes ❀
        </div>
      )}
        
        <EntryForm addEntry={addEntry2} />
        
        <div className= "spin-set">
          <h1 className="spin-question">
            Want to share your <span className="highlight">gratitude</span> with someone in <span className="highlight">need</span>? Spin the wheel:
          </h1>
  
          <div className="wheel-container">
            <Meme meme={meme} getMemeImage={getMemeImage} isSpinning={isSpinning} />
          </div>
        </div>
   

        {/* Optionally, display meme data directly here  */}
        {meme.randomImage && (
        <div className="organisation-container">
          <div className="meme--text">
            {meme.name && <p>{meme.name}</p>}
          </div>
          
          <div className="organisation-card">
            {meme.randomImage && <img src={meme.randomImage} className="meme--image" alt="Random Meme" />}
            <div className="organisation-card-text">
              {/*<div className="org-icon">
                <i class="fas fa-info-circle"></i>
              </div>*/}

              <div className="org-info">
                {meme.info && <p>{meme.info}</p>}
              </div>
              
              <div className="org-donate-button">
                <button id="donateButton" className="donate-button" onClick={handleDonateClick}>Donate</button>
              
              </div>
              
            </div>
          </div>
        </div>
        )}
        
      </div>
    </div>
  );
}

export default Home;
