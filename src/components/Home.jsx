import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import homeImg from "../assets/home.png";
import axios from "axios";
import loadingGif from "../assets/load_1.gif";

const Home = () => {
  const navigate = useNavigate();
  const [isLogging, setIsLogging] = useState(false);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [currentAction, setCurrentAction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Check server connection on component mount
  // useEffect(() => {
  //   const checkServerConnection = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8000/health');
  //       if (response.data.status === 'healthy') {
  //         setErrorMessage('');
  //       } else {
  //         setErrorMessage("Server is not fully operational.");
  //       }
  //     } catch (error) {
  //       setErrorMessage("Unable to connect to the server. Please ensure the backend is running.");
  //     }
  //   };

  //   checkServerConnection();
  // }, []);

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
        response = await axios.post("http://localhost:8000/check-in", {
          image: base64Image,
        });
      } else {
        response = await axios.post("http://localhost:8000/check-out", {
          image: base64Image,
        });
      }

      setAttendanceLogs((prev) => [
        ...prev,
        `${response.data.message} - ${new Date().toLocaleTimeString()}`,
      ]);
      setCurrentAction("");
      setErrorMessage("");
      setIsLoading(false);
      setIsLogging(false);
    } catch (error) {
      // More specific error handling
      if (error.response) {
        const errorDetail = error.response.data.detail;

        // Check for specific error scenarios
        if (errorDetail.includes("already checked in today")) {
          setErrorMessage("You have already checked in today.");
        } else if (errorDetail.includes("has not checked in today")) {
          setErrorMessage("You must check in before checking out.");
        } else if (errorDetail.includes("User not recognized")) {
          setErrorMessage("User not recognized. Please try again or add user.");
        } else {
          // Generic error handling for other scenarios
          setErrorMessage(errorDetail || "An unexpected error occurred");
        }
      } else if (error.request) {
        // Network error or server not responding
        setErrorMessage(
          "Unable to connect to the server. Please check your connection."
        );
      } else {
        // Other errors
        setErrorMessage("An unexpected error occurred");
      }

      setCurrentAction("");
      setIsLogging(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="homeContainer">
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

          {currentAction && <p>Processing {currentAction}...</p>}
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
