import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import homeImg from "../assets/home.png";
import axios from "axios";
import loadingGif from "../assets/load_1.gif";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
  const navigate = useNavigate();
  const [isLogging, setIsLogging] = useState(false);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [currentAction, setCurrentAction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = () => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch((err) => {
          console.error("Error accessing webcam:", err);
          setErrorMessage("Could not access webcam. Please check permissions.");
          toast.error("Could not access webcam. Please check permissions.");
        });
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsLogging(false);
  };

  const captureAndProcessImage = async (actionType) => {
    setIsLoading(true);
    if (!videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    const base64Image = canvas.toDataURL("image/jpeg");

    stopCamera();

    try {
      let response;
      if (actionType === "check-in") {
        response = await axios.post(`${apiUrl}/check-in`, {
          image: base64Image,
        });
      } else {
        response = await axios.post(`${apiUrl}/check-out`, {
          image: base64Image,
        });
      }

      const logMessage = `${response.data.message} - ${new Date().toLocaleTimeString()}`;
      setAttendanceLogs((prev) => [logMessage, ...prev]); // Add new logs at the top
      setCurrentAction("");
      setErrorMessage("");
      
      // Show success toast notification
      toast.success(response.data.message);
      
      setIsLoading(false);
      setIsLogging(false);
      
    } catch (error) {
      // More specific error handling
      let errorMsg = "An unexpected error occurred";
      
      if (error.response) {
        const errorDetail = error.response.data.detail;

        // Check for specific error scenarios
        if (errorDetail.includes("already checked in today")) {
          errorMsg = "You have already checked in today.";
        } else if (errorDetail.includes("has not checked in today")) {
          errorMsg = "You must check in before checking out.";
        } else if (errorDetail.includes("User not recognized")) {
          errorMsg = "User not recognized. Please try again or add user.";
        } else {
          // Generic error handling for other scenarios
          errorMsg = errorDetail || "An unexpected error occurred";
        }
      } else if (error.request) {
        // Network error or server not responding
        errorMsg = "Unable to connect to the server. Please check your connection.";
      }

      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      
      setCurrentAction("");
      setIsLogging(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="homeContainer">
      {/* Toast Container - this is where all notifications will be rendered */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {isLoading && (
        <div className="loading-overlay-home">
          <img src={loadingGif} alt="Loading..." />
          <p>Processing ...</p>
        </div>
      )}
      
      <h1 className="homeTop">
        Clock-in/ -out by clicking the respective buttons below
      </h1>
      
      <div className="homeDown">
        <div className="homeLeft">
          <div className="feedContainer">
            {!isLogging && (
              <img src={homeImg} alt="thumbnail" className="homeImage" />
            )}
            <video
              ref={videoRef}
              id="videoFeed"
              className={`videoFeed ${isLogging ? "visible" : "hidden"}`}
              autoPlay
              playsInline
            ></video>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
          
          {/* Recent Activity Panel for Mobile */}
          <div className="recent-activity-mobile">
            <h3>Recent Activity</h3>
            {attendanceLogs.length > 0 ? (
              <p className="latest-log">{attendanceLogs[0]}</p>
            ) : (
              <p className="no-logs">No recent activity</p>
            )}
          </div>
        </div>

        <div className="homeRight">
          <div className="actionButtons">
            <button
              className="startButton"
              onClick={() => {
                setIsLogging(true);
                setCurrentAction("check-in");
                setErrorMessage("");
                startCamera();
                setTimeout(() => captureAndProcessImage("check-in"), 2500);
              }}
              disabled={currentAction !== ""}
            >
              Check In
            </button>
            <button
              className="stopButton"
              onClick={() => {
                setIsLogging(true);
                setCurrentAction("check-out");
                setErrorMessage("");
                startCamera();
                setTimeout(() => captureAndProcessImage("check-out"), 2500);
              }}
              disabled={currentAction !== ""}
            >
              Check Out
            </button>
            <button
              className="addUserButton"
              onClick={() => navigate("/adduser")}
            >
              Add New User
            </button>
          </div>

          {currentAction && <p className="status-message">Processing {currentAction}...</p>}
          
          {/* Recent Logs Section (Visible on desktop) */}
          <div className="recent-logs-desktop">
            <h3>Recent Activity</h3>
            <div className="logs-container">
              {attendanceLogs.length > 0 ? (
                attendanceLogs.slice(0, 3).map((log, index) => (
                  <div key={index} className="log-item">{log}</div>
                ))
              ) : (
                <p className="no-logs">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Attendance Log History (can be accessed by scrolling) */}
      <div className="result">
        <h2>Attendance Log History</h2>
        <ul>
          {attendanceLogs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;