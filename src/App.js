import React from 'react'; 
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Accueil from './components/accueil/Accueil';
import SignIn from './components/signin/SignIn';
import SignUp from './components/signup/SignUp';
import Apropos from './components/apropos/Apropos';
import StudentDashboard from './components/dashboard/StudentDashboard';  
import ProfessorDashboard from './components/dashboard/ProfessorDashboard';  

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path='/student-dashboard' element={<StudentDashboard />} />
        <Route path='/professor-dashboard' element={<ProfessorDashboard />} />
        <Route path='/Apropos' element={<Apropos />} />
      </Routes>
    </Router>
  );
}

export default App;
