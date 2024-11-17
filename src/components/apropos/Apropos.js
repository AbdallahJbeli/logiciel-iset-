import React from 'react';
import './Apropos.css';
import facultyImage from '../assets/kebeli-iset.jpg'; 

const Apropos = () => {
  return (
    <div className="about-container">
      <div className="about-banner">
        <img src={facultyImage} alt="ISET Kebili" className="about-image" />
        
      </div>
      <section className="about-content">
        <h2>Notre Mission</h2>
        <p>
          L'Institut Supérieur des Études Technologiques (ISET) de Kebili est une institution publique qui forme les 
          étudiants dans divers domaines technologiques, techniques, et de gestion. Notre mission est de fournir un 
          enseignement de qualité, axé sur les compétences professionnelles, et de promouvoir l'innovation et l'entrepreneuriat.
        </p>

        <h2>Notre Histoire</h2>
        <p>
          Fondée en 2004, l'ISET de Kebili a depuis évolué pour devenir un acteur clé dans l'enseignement supérieur de 
          la région sud de la Tunisie. Avec une infrastructure moderne et des programmes variés, nous répondons aux besoins 
          des industries locales et internationales.
        </p>

        <h2>Nos Valeurs</h2>
        <ul>
          <li>Excellence académique</li>
          <li>Innovation et entrepreneuriat</li>
          <li>Responsabilité sociale</li>
          <li>Développement durable</li>
        </ul>

        <h2>Contactez-nous</h2>
        <p>
          Si vous souhaitez en savoir plus sur l'ISET Kebili, n'hésitez pas à nous contacter à l'adresse suivante : 
          <a href="mailto:contact@iset-kebili.tn">contact@iset-kebili.tn</a> ou par téléphone au <strong>+216 75 491 000</strong>.
          <p>Adresse : Route de Gabès - BP n°61 - 4200 - Kébili Tunisie</p>
        </p>
      </section>
    </div>
  );
};

export default Apropos;
