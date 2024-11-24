import React, { useState } from 'react';
import '../dashboard/ProfessorDashboard.css'
import axios from 'axios';

const ProfessorDashboard = () => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');  // State to store the note
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('note', note);
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/professor/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      alert('File and note uploaded successfully');
    } catch (error) {
      console.error('Error uploading file and note:', error);
      alert('Error uploading file and note');
    }
  };

  return (
    <div className="professor-dashboard-container">
      <h2>Professor Dashboard</h2>
      <form onSubmit={handleUpload}>
        <div className="input-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="note">Note</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="file">Upload File</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default ProfessorDashboard;
