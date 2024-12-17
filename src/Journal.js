//removed sensitive content


import React, { useState, useEffect } from 'react';
import { addDoc, deleteDoc, doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { notesCollection, notesCollection2 } from './firebase';
import EntryList from './EntryList'; 
import CharityDashboard from './CharityDashboard';
import {UserAuth} from './AuthContext'
import {query, where } from "firebase/firestore";





function Journal() {
    const {logOut,user}=UserAuth();
    console.log(user);
    const [groupedEntries, setGroupedEntries] = useState({});
    const [groupedArchivedEntries, setGroupedArchivedEntries] = useState({});
    const [showArchived, setShowArchived] = useState(false);
      
    const handleSignOut = async () => {
        try{
          await logOut()
        } catch (error) {
          console.log(error)
        }
      };

    const toggleArchivedNotes = () => {
        setShowArchived(!showArchived);
    };

    const groupEntriesByMonth = (entries) => {
        entries.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    
        return entries.reduce((groups, entry) => {
            if (entry.createdAt && entry.createdAt.seconds) {
                const date = new Date(entry.createdAt.seconds * 1000); // Convert Firebase Timestamp to JS Date
    
                if (isNaN(date.getTime())) {
                    console.warn("Invalid date value found:", entry.createdAt);
                    return groups; 
                }
    
                const month = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
    
                if (!groups[month]) {
                    groups[month] = [];
                }
                groups[month].push(entry);
            } else {
                console.warn("Missing or invalid createdAt field:", entry);
            }
    
            return groups;
        }, {});
    };
    


  
    // Archive an entry by moving it to the archived collection
    const archiveEntry = async (id) => {
    try {
        const entryToArchive = Object.values(groupedEntries).flat().find(entry => entry.id === id);
        if (entryToArchive) {

            // Delete from the active collection and add to archived, preserving createdAt
            await deleteDoc(doc(notesCollection, entryToArchive.id));
            await addDoc(notesCollection2, {
                ...entryToArchive, 
                updatedAt: Timestamp.now(), // Only update the updatedAt field
            });
        } else {
            console.error("Entry not found to archive.");
        }
    } catch (error) {
        console.error("Error archiving entry: ", error);
    }
};


    const restoreEntry = async (id) => {
        try {
            const entryToRestore = Object.values(groupedArchivedEntries).flat().find(entry => entry.id === id);
            if (entryToRestore) {
                await deleteDoc(doc(notesCollection2, entryToRestore.id));
                await addDoc(notesCollection, {
                    ...entryToRestore, 
                    updatedAt: Timestamp.now(), // Only update the updatedAt field
                });
            } else {
                console.error("Entry not found to restore.");
            }
        } catch (error) {
            console.error("Error restoring entry: ", error);
        }
    };

    // Delete an entry from either active or archived entries
    const deleteEntry = async (id, archiveMode) => {
        try {
            if (archiveMode) {
                const entryToDelete = Object.values(groupedArchivedEntries).flat().find(entry => entry.id === id);
                if (entryToDelete) {
                    await deleteDoc(doc(notesCollection2, entryToDelete.id));
                } else {
                    console.error("Entry not found to delete in archive.");
                }
            } else {
                const entryToDelete = Object.values(groupedEntries).flat().find(entry => entry.id === id);
                if (entryToDelete) {
                    await deleteDoc(doc(notesCollection, entryToDelete.id));
                } else {
                    console.error("Entry not found to delete in active collection.");
                }
            }
        } catch (error) {
            console.error("Error deleting entry: ", error);
        }
    };

    

    return (
        <div className="appContainer">
            <div className="left-border" ></div>
            <div className="contentsHome2"> 
                <div>
                    <p className="contentsHome2Welcome">Welcome, {user?.displayName + " ♡"|| "Guest"}</p>
                </div> 
                {/*<EntryForm addEntry={addEntry2} /> */}

                <p className="contentsHome2p1">My Gratitude Notes</p>
                {Object.entries(groupedEntries).map(([month, entries]) => (
                    <div key={month}>
                        <p className="month_tracker">{month}</p>
                        <EntryList
                            entries={entries}
                            onArchive={archiveEntry} 
                            onDelete={deleteEntry}
                            archiveMode={false} 
                        />
                    </div>
                ))}
                <CharityDashboard />
                <div className="ArchiveToggleSet">
                    <p className="contentsHome2p2">Archived Notes</p>
                    <button onClick={toggleArchivedNotes} className="ArchiveToggle">
                        {showArchived ? 'Hide' : 'Show'} Archived Notes
                    </button>
                </div>

                 {showArchived && (
                <div>
                    {Object.entries(groupedArchivedEntries).map(([month, entries]) => (
                        <div key={month}>
                            <p className="month_tracker">{month}</p>
                            <EntryList
                                entries={entries}
                                onArchive={restoreEntry} 
                                onDelete={deleteEntry} 
                                archiveMode={true} 
                            />
                        </div>
                    ))}
                    
                </div>
            )}
           
                <button onClick ={handleSignOut} className="LogOutButton">Logout</button>

            </div>
        </div>
    );
}


export default Journal;
