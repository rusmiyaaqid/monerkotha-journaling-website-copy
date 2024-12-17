/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

//import React, { useEffect, useState } from 'react';
import './index.css'; // Import CSS file
//import { addDoc, getDocs, deleteDoc, doc} from "firebase/firestore";
//import { charityCollection } from './firebase.js';
import memesData from './memesData.js';
import socialEnterpriseData from './socialEnterpriseData.js';

const CharityCard = ({ name, info, url, learnMore, donate }) => (
  <div  className="cardAbout">
      {/*<img src={url} alt={name}  className="imageAbout"/>*/}
      <p  className="nameAbout">{name}</p>
      <p  className="infoAbout">{info}</p>
      <a href={learnMore} target="_blank" rel="noopener noreferrer"  className="learnMoreAbout">
          Learn More
      </a>
      <a href={donate} target="_blank" rel="noopener noreferrer"  className="donateLinkAbout">
          Donate
      </a>
  </div>
);

function AboutPage() {

 
  return (

    <div className= "AboutPageContentsContainer">
      <div className="left-border" ></div>
      <div className= "AboutPageContents" >
        <h1 className="aboutOrganisationTitle" >
        monerkotha
        </h1>
        <p className="descriptionText">monerkotha, or ‘words of the mind’ combines journaling with philanthropic actions. Gratitude journaling, in and of itself, is a practice that improves mental health, emotional resilience and reduces stress. Combined with charitable giving - a pillar in Islam - the practices together create positive feedback loop that amplifies the benefits of journaling. </p>
        <h1 className="aboutOrganisationTitle" >
        how does this work?
        </h1>
        <p className="descriptionText" >Every time you submit a journal entry, you have the option to spin a wheel, learn about an organization or social enterprise and donate to it if you would like. Of course, you are welcome to choose a different organization. No matter what you choose, you can take note of it in the زكاة(zakat) Charity Dashboard. We do not earn profits from your donations or purchases, we only highlight organizations that have a strong impact on our world. We will soon have a community feature that allows you to interact with others on your growth journey and give you a chance to spotlight organizations of your choice on our website!</p>
        
        
        <h1 className="aboutOrganisationTitle" >
        Organisations
        </h1>
        
      
      
        {/* Map over charity data and display cards */}
        <div className="containerAbout" >
          {memesData.data.memes.map((charity) => (
            <CharityCard
              key={charity.id}
              name={charity.name}
              info={charity.info}
              url={charity.url}
              learnMore= {charity.learnMore}
              donate={charity.donate}
            />
          ))}
        </div>

        <h1 className="aboutOrganisationTitle">
        Social Enterprises
        </h1>

         {/* Map over charity data and display cards */}
         <div className="containerAbout">
          {socialEnterpriseData.data.socialOrganisations.map((charity) => (
            <CharityCard
              key={charity.id}
              name={charity.name}
              info={charity.info}
              url={charity.url}
              learnMore= {charity.learnMore}
              donate={charity.donate}
            />
          ))}
        </div>

      </div>
    </div>
  );
}


export default AboutPage;


