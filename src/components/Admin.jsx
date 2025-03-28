import React from 'react';
import '../styles/Admin.css';
import devImage from "../assets/develope.png"


const Admin = () => {
  return (
    <div className="adminContainer">
      <img 
        src={devImage} 
        alt="Development Illustration" 
        className="adminImage"
      />
      <p className="adminText">This section is currently under development.</p>
      <button className="adminButton">Explore Other Features</button>
    </div>
  );
};

export default Admin;
