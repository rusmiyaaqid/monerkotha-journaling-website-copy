import React, {useState} from 'react';

function EntryList({ entries, onArchive, onDelete, archiveMode }) {
  const [hoveredEntry, setHoveredEntry] = useState(null);
  const handleMouseEnter = (entryId) => setHoveredEntry(entryId);
  const handleMouseLeave = () => setHoveredEntry(null);


  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Convert Firebase Timestamp to JS Date
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(date);
  };

  return (
    
    ///*
    <div className="entryBigContainer">
      {entries.map(entry => (
        <div key={entry.id} className="entryContainer" onMouseEnter={() => handleMouseEnter(entry.id)}
        onMouseLeave={handleMouseLeave}>

          <div className="entryComponents">
            <p className="entryText">{entry.text}</p>
            {/*<button style= {styles.RestoreArchiveButton(hoveredEntry === entry.id)} onClick={() => onArchive(entry.id, archiveMode)}>*/}
            <button 
              className={`RestoreArchiveButton ${hoveredEntry === entry.id ? 'hovered' : ''}`} 
              onClick={() => onArchive(entry.id, archiveMode)}
            >
              {archiveMode ? <i className="material-icons">unarchive</i> : <i className="material-icons">archive</i>}
            </button>
            {/*<button style={styles.deleteButton(hoveredEntry === entry.id)} onClick={() => onDelete(entry.id, archiveMode)}>*/}
            <button 
              className={`deleteButton ${hoveredEntry === entry.id ? 'hovered' : ''}`} 
              onClick={() => onDelete(entry.id, archiveMode)}
            >
              <span className="material-icons">delete</span>
            </button>
          </div>
          {/*<p style={styles.entryDate}>Date: {formatDate(entry.createdAt)}</p>*/}
          {/*<p style={styles.entryDate(hoveredEntry === entry.id)}>{formatDate(entry.createdAt)}</p>*/}
          <p className={`entryDate ${hoveredEntry === entry.id ? 'hovered' : ''}`}>{formatDate(entry.createdAt)}</p>



        </div>
      ))}
    </div> 
    //*/
    


  );
}

export default EntryList;
