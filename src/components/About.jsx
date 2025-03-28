import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="aboutContainer">
      <h1 className="aboutHeader">About Our Attendance System</h1>
      <p className="aboutDescription">
        Our advanced facial recognition attendance system ensures seamless and accurate tracking of employee attendance.
        This system leverages cutting-edge computer vision technology to improve efficiency and eliminate manual errors.
      </p>

      <div className="aboutFlexContainer">
        <div className="aboutCard">
          <h2>Step 1: User Registration</h2>
          <p>
            Employees can register themselves by clicking the **"Add New User"** button. They must enter their name and department 
            and have their photo captured. This data is securely stored for future recognition.
          </p>
        </div>

        <div className="aboutCard">
          <h2>Step 2: Starting Attendance</h2>
          <p>
            To log attendance, click the **"Start"** button. The system will activate the camera and automatically detect and recognize faces.
            Each identified face will be logged with entry/exit times.
          </p>
        </div>

        <div className="aboutCard">
          <h2>Step 3: Real-Time Tracking</h2>
          <p>
            During the live video feed, multiple faces can be detected simultaneously. The system accurately matches recognized faces 
            with registered user data.
          </p>
        </div>

        <div className="aboutCard">
          <h2>Step 4: Attendance Data Storage</h2>
          <p>
            Captured attendance records are securely stored in a database along with timestamps. Additionally, the captured images 
            are saved in folders categorized by employee names for periodic model retraining.
          </p>
        </div>

        <div className="aboutCard">
          <h2>Step 5: Payroll Integration</h2>
          <p>
            Attendance data is processed to calculate total working hours, overtime, and late entries. This data is efficiently managed 
            for payroll processing.
          </p>
        </div>

        <div className="aboutCard">
          <h2>Step 6: Role-Based Access</h2>
          <p>
            Employees can view their attendance details, while admins can manage users, edit records, and oversee attendance data efficiently.
          </p>
        </div>
      </div>

      <div className="aboutFooter">
        <h2>Key Features:</h2>
        <ul>
          <li>✅ Accurate and fast facial recognition.</li>
          <li>✅ Secure data storage with organized image management.</li>
          <li>✅ Easy-to-use interface with clear success/error messages.</li>
          <li>✅ Responsive design for desktops, tablets, and mobile devices.</li>
        </ul>
        <p>
          Experience an effortless and efficient way to manage employee attendance with our cutting-edge facial recognition system!
        </p>
      </div>
    </div>
  );
};

export default About;
