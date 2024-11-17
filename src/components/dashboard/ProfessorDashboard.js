// ProfessorDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import './ProfessorDashboard.css';

const ProfessorDashboard = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch existing items (e.g., assignments, resources) from the database
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/professor/items", { withCredentials: true });
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Add new item
  const handleAddItem = async () => {
    try {
      await axios.post("http://localhost:5000/professor/items", { title: newItem }, { withCredentials: true });
      setNewItem("");
      fetchItems(); // Refresh the list after adding
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // Update item
  const handleUpdateItem = async (id) => {
    try {
      await axios.put(`http://localhost:5000/professor/items/${id}`, { title: editText }, { withCredentials: true });
      setEditItem(null);
      fetchItems(); // Refresh the list after updating
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Delete item
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/professor/items/${id}`, { withCredentials: true });
      fetchItems(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Professor Dashboard</h2>

      {/* Add New Item */}
      <div className="add-item">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      {/* Display List of Items */}
      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id}>
            {editItem === item.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => handleUpdateItem(item.id)}>Save</button>
              </>
            ) : (
              <>
                <span>{item.title}</span>
                <button onClick={() => { setEditItem(item.id); setEditText(item.title); }}>Edit</button>
                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfessorDashboard;
