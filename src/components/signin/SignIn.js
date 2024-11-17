import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import '../signin/SignIn.css'

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/signin",
        { email, password },
        { withCredentials: true }
      );
      
      const role = response.data.role;
      
      if (role === "student") {
        navigate("/student-dashboard");
      } else if (role === "professor") {
        navigate("/professor-dashboard");
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Se Connecter</h2>
        <form onSubmit={handleSignIn}>
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
          <button type="submit" className="signin-button">
            Se connecter
          </button>
        </form>
        <p className="signup-link">
          N'a pas un compte? <Link to="/SignUp">Créer un compte </Link>.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
