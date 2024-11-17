import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Accueil.css';
import Calendar from 'react-calendar'; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import bannerImage from '../assets/Background Blue Backgrounds Images & Pictures _ Free Download On Pngtree (1).jpg'; 
import programImage1 from '../assets/télécharge.jpg';     
import programImage2 from '../assets/Analyse de votre business et conseils en stratégie marketing - Jewstore.jpg';   

const Accueil = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="home-container">
      {/* Banner Section */}
      <div className="banner">
        <img src={bannerImage} alt="Faculty Banner" className="banner-image" />
        <div className="banner-text">
          <h1>Bienvenue à l'institut supérieur d'études technologique à Kebili</h1>
          <p>Découvrez nos programmes et rejoignez une communauté d'excellence.</p>
        </div>
      </div>

      {/* Programs Section */}
      <section className="program-section">
        <h2>Nos Programmes</h2>
        <div className="programs">
          <Link to="/signin" className="program-card-link">
            <div className="program-card">
              <img src={programImage1} alt="Program 1" />
              <h3>Technologie d'informatique</h3>
              <p>Un programme complet axé sur les technologies émergentes et l'innovation numérique.</p>
            </div>
          </Link>
          
          <div className="program-card">
            <img src={programImage2} alt="Program 2" />
            <h3>Administration d'affaires</h3>
            <p>Préparez-vous à gérer et à diriger des organisations avec des compétences en gestion, finance et stratégie d'entreprise.</p>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="calendar-section">
        <h2>Calendrier </h2>
        <Calendar onChange={setDate} value={date} />
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2>Contactez-nous</h2>
        <p>Pour plus d'informations, veuillez nous contacter à <a href="isetkebili@gmail.com">contact@iset-kebili.tn</a>.</p>
      </section>
    </div>
  );
};

export default Accueil;


