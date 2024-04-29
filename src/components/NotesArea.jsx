import React, { useState } from 'react';
import './NotesArea.css';
import Draggable from 'react-draggable';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const NotesArea = () => {
  // State variables to manage blue box-like structures (text boxes) and their positions
  const [notes, setNotes] = useState([]);

  // Function to handle double-click event
  const handleDoubleClick = (event, text="") => {
    const newNote = {
      id: notes.length + 1,
      text: text,
      positionX: event.clientX,
      positionY: event.clientY
    };
    setNotes([...notes, newNote]);
  };

  // Function to handle text input
  const handleTextChange = (event, id) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, text: event.target.value } : note
    );
    setNotes(updatedNotes);
  };

  // Function to handle text drag-and-drop
  const handleDragStart = (event, id) => {
    event.dataTransfer.setData('text/plain', id.toString());
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text')
    console.log(data)

    handleDoubleClick(event, data)
  };

  const handleDropBox = (event, noteID) => {
    event.preventDefault()

    const data = event.dataTransfer.getData('text')
    console.log(data)

    const notesCopy = [...notes];
    const note = notesCopy.find(note => note['id'] == noteID)
    console.log(note)

    note.text = note.text + '\n' + data

    event.stopPropagation();
    setNotes(notesCopy);
  }

  const exportToExcel = () => {
    const data = notes.map(note => (
      {
        Notes: note.text, 
        TopDistance: note.positionY, 
        LeftDistance: note.positionX, 
        TopLeftDistance: (note.positionX ** 2 + note.positionY ** 2) ** (0.5)
      }
    ))
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Buffer to store the generated Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

    saveAs(blob, "data.xlsx");
  };

  return (
    <>
    <div className="notes-area" onDoubleClick={handleDoubleClick} onDragOver={(event) => {event.preventDefault()}} onDrop={handleDrop}>
      {notes.map(note => (
        <Draggable bounds='parent'>
          <div
            id={note.id}
            className="note-box"
            style={{ left: note.positionX, top: note.positionY }}
            onDragStart={(event) => handleDragStart(event, note.id)}
            onDragOver={handleDragOver}
            onDrop={event => handleDropBox(event, note.id)}
          >
            <textarea
              value={note.text}
              onChange={(event) => handleTextChange(event, note.id)}
              placeholder="Add your notes here.."
            />
          </div>
        </Draggable>
      ))} 
    </div>
    <button className="export-button" onClick={exportToExcel}>Export Notes</button>
    </>
  );
};

export default NotesArea;