import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";
import image from "../assets/crop.png";
import loadingGif from "../assets/load_1.gif";

const Hero = () => {

  const apiUrl = import.meta.env.VITE_API_URL;
  
  const [checks, setChecks] = useState({
    camera: false,
    database: false,
    server: false,
  });
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [statusError, setStatusError] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigateToHome = () => {
    localStorage.setItem("allStatusesComplete", "true");
    navigate("/home");
  };

  const checkStatus = () => {
    setIsLoading(true);
  
    let dbServerData = { database: false, server: false };
    
    const fetchPromise = fetch(`${apiUrl}/status`)
      .then((res) => res.json())
      .then((data) => {
        dbServerData = data;
      })
      .catch((err) => {
        console.error("Error fetching status:", err);
      });
  
    let cameraAvailable = false;
  
    const cameraPromise = navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setCameras(videoDevices);
  
        cameraAvailable = videoDevices.length > 0;
  
        if (videoDevices.length > 0 && !selectedCamera) {
          setSelectedCamera(videoDevices[0].deviceId);
          localStorage.setItem("selectedCamera", videoDevices[0].deviceId);
        }
  
        localStorage.setItem("availableCameras", JSON.stringify(videoDevices));
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
      });
  
    Promise.all([fetchPromise, cameraPromise])
      .then(() => {
        const fullStatus = {
          camera: cameraAvailable,
          database: dbServerData.database,
          server: dbServerData.server,
        };
        setChecks(fullStatus);
        setStatusError(!fullStatus.camera || !fullStatus.database || !fullStatus.server);
        localStorage.setItem("systemChecks", JSON.stringify(fullStatus));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  


  useEffect(() => {
    const statusChecked = localStorage.getItem("statusChecked");
    
    if (!statusChecked) {
      checkStatus();
      localStorage.setItem("statusChecked", "true");
    } else {
      const savedChecks = localStorage.getItem("systemChecks");
      if (savedChecks) {
        const parsedChecks = JSON.parse(savedChecks);
        setChecks(parsedChecks);
        setStatusError(!parsedChecks.camera || !parsedChecks.database || !parsedChecks.server);
      }
      
      const savedCameras = localStorage.getItem("availableCameras");
      if (savedCameras) {
        setCameras(JSON.parse(savedCameras));
      }
      
      const savedSelectedCamera = localStorage.getItem("selectedCamera");
      if (savedSelectedCamera) {
        setSelectedCamera(savedSelectedCamera);
      }
    }

    const handleBeforeUnload = () => {
      localStorage.removeItem("statusChecked");
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };

  }, []);


  return (
    <div className="heroContainer">
      {isLoading && (
        <div className="loading-overlay-hero">
          <img src={loadingGif} alt="Loading..." />
          <p>Checking requirements...</p>
        </div>
      )}

      <div className="heroContent">
        <div className="heroHeading">
          <h1>
            Welcome to <span className="highlight">Trusten.Vision</span>
          </h1>
          <div className="tagline">
            <p className="subtitle">
              An Advanced Real-time Facial Attendance Application
            </p>
            <div className="accent-line"></div>
          </div>
        </div>

        <div className="heroFeatures">
          <p>
            <span className="feature-icon">✓</span> Automatically mark
            attendance using facial recognition technology
          </p>
          <p>
            <span className="feature-icon">✓</span> Secure, efficient, and
            real-time tracking for workplaces
          </p>
          <p>
            <span className="feature-icon">✓</span> Easy implementation for
            institutions of any size
          </p>
        </div>

        <div
          className={`status-container ${
            statusError ? "status-error" : "status-ok"
          }`}
        >
          <h3 className="status-title">System Status</h3>
          <div
            className={`status-item ${
              checks.camera ? "status-available" : "status-unavailable"
            }`}
          >
            <span className="status-label">Camera Availability:</span>
            <span className="status-value">
              {checks.camera ? "Available" : "Not Found"}
            </span>
          </div>
          <div
            className={`status-item ${
              checks.database ? "status-available" : "status-unavailable"
            }`}
          >
            <span className="status-label">Database Status:</span>
            <span className="status-value">
              {checks.database ? "Online" : "Offline"}
            </span>
          </div>
          <div
            className={`status-item ${
              checks.server ? "status-available" : "status-unavailable"
            }`}
          >
            <span className="status-label">Python Server:</span>
            <span className="status-value">
              {checks.server ? "Running" : "Down"}
            </span>
          </div>
        </div>

        {cameras.length > 1 && (
          <div className="camera-select">
            <label htmlFor="camera-select">Select Camera Device:</label>
            <select
              id="camera-select"
              onChange={(e) => setSelectedCamera(e.target.value)}
              value={selectedCamera}
            >
              {cameras.map((camera, index) => (
                <option key={index} value={camera.deviceId}>
                  {camera.label || `Camera ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="button-container">
          <button
            onClick={handleNavigateToHome}
            disabled={!checks.camera || !checks.database || !checks.server}
            className="primary-button"
          >
            <span className="button-icon">▶</span> Go to Attendance
          </button>
          <button
            onClick={() => navigate("/adduser")}
            disabled={!checks.camera || !checks.database || !checks.server}
            className="secondary-button"
          >
            <span className="button-icon">+</span> Add User
          </button>
        </div>
      </div>

      <div className="heroImage">
        <div className="image-container">
          <img src={image} alt="Facial recognition illustration" />
          <div className="image-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
