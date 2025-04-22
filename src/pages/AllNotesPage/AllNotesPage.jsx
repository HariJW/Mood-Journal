import { Link } from "react-router-dom";
import "./AllNotesPage.css";
import { useEffect, useState } from "react";
import defaultNotes from "../../data/defaultNotes";

function AllNotesPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const storedNotes = localStorage.getItem("moodEntries");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    } else {
      setNotes(defaultNotes);
    }
  }, []);

  return (
    <div className="all-notes-page">
      <div className="all-notes-page-content">
        <div className="top-bar">
          <h2 className="top-bar-title">MoodMate</h2>
          <Link to="/" className="topbar-link">
            Mark Notes
          </Link>
        </div>
        <div className="all-notes-page-main">
          <h2 className="all-notes-title">All Notes</h2>
          <div className="all-notes-wrapper">
            {notes.map((note, index) => (
              <div className="note-card" key={index}>
                <div className="note-emoji">{note.emoji}</div>
                <div className="note-details">
                  <div className="note-details-text">{note.note}</div>
                  <div className="note-details-footer">
                    <p className="node-date">{note.date}</p>
                    {note.temp && (
                      <span className="weather">{note.temp}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllNotesPage;
