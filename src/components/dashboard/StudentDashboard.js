import React, { useState, useEffect } from 'react';
import '../dashboard/StudentDashboard.css'
import axios from 'axios';

const StudentDashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/student/items', { withCredentials: true });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-dashboard-container">
      <h2>Student Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {items.length > 0 ? (
            items.map((item) => (
              <li key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.note}</p>
                {item.file_path && <a href={`http://localhost:5000/uploads/${item.file_path}`} download>Download File</a>}
              </li>
            ))
          ) : (
            <p>No notes available.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default StudentDashboard;
