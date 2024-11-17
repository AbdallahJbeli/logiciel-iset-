import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import '../signup/SignUp.css'


const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/signup", {
        name,
        email,
        password,
        role,
      });
      navigate("/signin");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Créer un compte</h2>
        <form onSubmit={handleSignUp}>
          <div className="input-group">
            <label htmlFor="name">Nom et Prénom</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Mot De Passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="student">Etudiant</option>
              <option value="professor">Professeur</option>
            </select>
          </div>
          <button type="submit" className="signup-button">
            Créer
          </button>
        </form>
        <p className="signin-link">
          déjà avoir un compte? <Link to="/SignIn">Se Connecter </Link>.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
