import React, { useEffect, useState } from 'react';
import './charityDashboard.css'; // Import CSS file
import { addDoc, getDocs, deleteDoc, doc} from "firebase/firestore";
import { charityCollection } from './firebase';
import {onSnapshot, Timestamp } from 'firebase/firestore';
import { collection, query, where } from "firebase/firestore";
import {UserAuth} from './AuthContext'





const CharityDashboard = () => {
  const {logOut,user}=UserAuth();

  const [donationType, setDonationType] = useState("donation"); // Default to donation
  const [amount, setAmount] = useState("");
  const [organization, setOrganization] = useState("");
  const [item, setItem] = useState("");
  const [date, setDate] = useState("");
  const [donations, setDonations] = useState([]); // Store donations/purchases
  

useEffect(() => {
  if (!user?.uid) return;
      const userDonationsQuery = query(charityCollection, where('userId', '==', user.uid)); // Filter by userId
      const unsubscribe = onSnapshot(userDonationsQuery, (querySnapshot) => {
        const donationsData = querySnapshot.docs.map(doc => ({
          id: doc.id, // Add document ID
          ...doc.data(),
          createdAt: doc.data().createdAt instanceof Timestamp ? doc.data().createdAt : Timestamp.fromDate(new Date(doc.data().createdAt)),
          updatedAt: doc.data().updatedAt instanceof Timestamp ? doc.data().updatedAt : Timestamp.fromDate(new Date(doc.data().updatedAt)),
        }));
        setDonations(donationsData);
    });
    return () => unsubscribe();
}, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format date
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

      // Get the current timestamp for the createdAt field
    const createdAt = new Date(); // Current date and time when the entry is added

    const newDonation = {
      type: donationType,
      amount,
      organization,
      item,
      date: formattedDate,
      createdAt: createdAt,
      userId: user.uid, // Make sure to associate donation with user

    };
    try {
        const docRef = await addDoc(charityCollection, newDonation);
        setDonations([...donations, { id: docRef.id, ...newDonation }]); // Add ID
        setAmount("");
        setOrganization("");
        setItem("");
        setDate("");
      } catch (error) {
        console.error("Error adding donation: ", error);
      }
    };
    // Function to handle deletion of a donation item
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(charityCollection, id));
      setDonations(donations.filter((donation) => donation.id !== id));
    } catch (error) {
      console.error("Error deleting donation:", error);
    }
  };


  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">زكاة Charity Dashboard</h2>
      <p className="dashboard-info">Donated to an organization or bought from a sustainable brand? Keep track of them here!</p>
      <form onSubmit={handleSubmit} className="donation-form">
        <div className="radio-group">
            <label className="radio-option">
                <input
                type="radio"
                name="donationType"
                value="donation"
                checked={donationType === "donation"}
                onChange={() => setDonationType("donation")}
                />
                <span className="custom-radio"></span> I donated to an organization
            </label>
            <label className="radio-option">
                <input
                type="radio"
                name="donationType"
                value="purchase"
                checked={donationType === "purchase"}
                onChange={() => setDonationType("purchase")}
                />
                <span className="custom-radio"></span> I purchased an item from a sustainable brand
            </label>
        </div>
        <div className="form-group"
            style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            marginBottom: '0.5rem',
           
            }}
        >
          <label>Amount (Optional):</label>

          {/*<label>Amount:</label>*/}
          <input
            type="number"
            value={amount}
            placeholder="Enter a dollar amount"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        
        <div className="form-group"
            style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            marginBottom: '0.5rem',
            }}
        >
         {/* <label>Organization:</label>*/}
         <label>Organization:</label>
          <input
            type="text"
            value={organization}
            placeholder="Enter an organisation or sustainable company (does not have to be from our list!)"
            onChange={(e) => setOrganization(e.target.value)}
            required
          />
          
        </div>

        {donationType === "purchase" && (
          <div className="form-group" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            marginBottom: '0.5rem',
           
            }}
          >
          <label>Item Purchased:</label>
            <input
              type="text"
              value={item}
              placeholder= "Enter the item you purchased"
              onChange={(e) => setItem(e.target.value)}

              required
            />
          </div>
        )}

        <div className="form-group"
         /* <label>Date:</label>*/
         style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            marginBottom: '0.5rem',
           
            }}
        >
         <label>Date:</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">Add to Dashboard</button>
      </form>
      <hr className="custom-divider" />
      {/*<h3 className="history-title">Donation History</h3>*/}
      <ul className="donation-history">
        {donations.map((donation, index) => (
        <li key={index} className="donation-item">
        {donation.type === "donation" ? (
            <>
            ○ I donated {donation.amount ? `$${donation.amount}` : ""} to {donation.organization} on {donation.date}
            </>
        ) : (
            <>
            ○ I purchased a {donation.item} { donation.amount ? `'for' + $${donation.amount}` : ""} from {donation.organization} on {donation.date}
            </>
        )}
        <button className="delete-button2" onClick={() => handleDelete(donation.id)}>
            <i className="material-icons">delete</i>
        </button>
        </li>
       ))}
      </ul>

    </div>
  );
};

export default CharityDashboard;
