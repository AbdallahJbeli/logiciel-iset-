// student dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get("http://localhost:5000/student/items", { withCredentials: true });
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="student-dashboard-container">
      <h2>Student Dashboard</h2>
      {loading ? ( // Conditional rendering based on loading state
        <p>Loading...</p>
      ) : (
        <ul className="student-item-list">
          {items.length > 0 ? (
            items.map((item) => (
              <li key={item.id}>
                <span>{item.title}</span>
                {item.file_path && (
                  <a href={`http://localhost:5000/uploads/${item.file_path}`} target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                )}
              </li>
            ))
          ) : (
            <p>No items available</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default StudentDashboard;
