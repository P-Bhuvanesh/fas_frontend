import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import homeImg from "../assets/home.png";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [isLogging, setIsLogging] = useState(false);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [currentAction, setCurrentAction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [challengePrompt, setChallengePrompt] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Check server connection on component mount
  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        const response = await axios.get('http://localhost:8000/health');
        if (response.data.status === 'healthy') {
          setErrorMessage('');
        } else {
          setErrorMessage("Server is not fully operational.");
        }
      } catch (error) {
        setErrorMessage("Unable to connect to the server. Please ensure the backend is running.");
      }
    };
  
    checkServerConnection();
  }, []);

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

  const initiateFaceVerificationChallenge = async (actionType) => {
    try {
      // Get a random face verification challenge
      const challengeResponse = await axios.post('http://localhost:8000/face-verification-challenge', {
        challenge_type: null  // Let server choose random challenge
      });

      // Set the challenge prompt to guide the user
      setChallengePrompt(challengeResponse.data.challenge_prompt);
      
      // Prepare for the verification process
      setCurrentAction(actionType);
      setIsLogging(true);
      setErrorMessage("");
      startCamera();
    } catch (error) {
      setErrorMessage("Failed to generate verification challenge");
      setIsLogging(false);
    }
  };

  const captureAndVerifyFace = async () => {
    if (!videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    // Convert canvas to a Blob for file upload
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'captured_face.jpg');

      try {
        // Verify the face challenge first
        await axios.post('http://localhost:8000/verify-face-challenge', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // If verification succeeds, proceed with check-in/out
        let response;
        if (currentAction === 'check-in') {
          response = await axios.post('http://localhost:8000/check-in-verified', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          response = await axios.post('http://localhost:8000/check-out-verified', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }

        // Update logs and reset state
        setAttendanceLogs(prev => [
          ...prev, 
          `${response.data.message} - ${new Date().toLocaleTimeString()}`
        ]);
        
        stopCamera();
        setCurrentAction("");
        setChallengePrompt("");
        setErrorMessage("");
        setIsLogging(false);
      } catch (error) {
        // Error handling similar to previous implementation
        if (error.response) {
          const errorDetail = error.response.data.detail;
          
          if (errorDetail.includes("already checked in today")) {
            setErrorMessage("You have already checked in today.");
          } else if (errorDetail.includes("has not checked in today")) {
            setErrorMessage("You must check in before checking out.");
          } else if (errorDetail.includes("User not recognized")) {
            setErrorMessage("User not recognized. Please try again or add user.");
          } else if (errorDetail.includes("Face verification failed")) {
            setErrorMessage("Face verification challenge failed. Please try again.");
          } else {
            setErrorMessage(errorDetail || "An unexpected error occurred");
          }
        } else if (error.request) {
          setErrorMessage("Unable to connect to the server. Please check your connection.");
        } else {
          setErrorMessage("An unexpected error occurred");
        }
        
        stopCamera();
        setCurrentAction("");
        setChallengePrompt("");
        setIsLogging(false);
      }
    }, 'image/jpeg');
  };

  return (
    <div className="homeContainer">
      <h1 className="homeTop">Real-time Facial Attendance Application</h1>
      <p className="homeDescription">
        Automatically mark attendance using facial recognition technology.
        Secure, efficient, and real-time tracking for workplaces and institutions.
      </p>

      <div className="homeDown">
        <div className="homeLeft">
          <div className="feedContainer">
            {!isLogging && <img src={homeImg} alt="thumbnail" className="homeImage" />}
            <video
              ref={videoRef}
              id="videoFeed"
              className={`videoFeed ${isLogging ? "visible" : "hidden"}`}
              autoPlay
              playsInline
            ></video>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </div>

        <div className="homeRight">
          <div className="actionButtons">
            <button 
              className="startButton" 
              onClick={() => initiateFaceVerificationChallenge('check-in')}
              disabled={currentAction !== ""}
            >
              Check In
            </button>
            <button 
              className="stopButton" 
              onClick={() => initiateFaceVerificationChallenge('check-out')}
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

          {challengePrompt && (
            <div className="challengePrompt">
              <p><strong>Verification Challenge:</strong> {challengePrompt}</p>
              <button 
                onClick={captureAndVerifyFace}
                className="verifyButton"
              >
                I'm Ready
              </button>
            </div>
          )}

          {currentAction && !challengePrompt && <p>Processing {currentAction}...</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
      </div>

      <div className="result">
        <h2>Attendance Logs</h2>
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