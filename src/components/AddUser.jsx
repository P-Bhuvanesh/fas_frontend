import React, { useState, useRef } from "react";
import scanImg from "../assets/scanImage.png";
import "../styles/AddUser.css";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "",
  });
  const [isCapturing, setIsCapturing] = useState(false);
  const [images, setImages] = useState([]);
  const [notification, setNotification] = useState("");
  const videoRef = useRef(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Start video stream and capture images
  const startCapture = async () => {
    if (!formData.name || !formData.designation || !formData.department) {
      alert("Please fill in all details before capturing.");
      return;
    }

    setIsCapturing(true);
    setNotification("Capturing images... Please stay still.");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();

    const imageArray = [];
    let count = 0;
    const captureInterval = setInterval(() => {
      if (count >= 10) {
        clearInterval(captureInterval);
        setImages(imageArray);
        setNotification("Image capture successful!");
        stopCapture();
        return;
      }
      
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");
      imageArray.push(imageData);
      count++;
    }, 500);
  };

  // Stop capturing
  const stopCapture = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCapturing(false);
    setNotification("");
  };

  // Submit data to FastAPI backend
  const handleSubmit = async () => {
    try {
        const response = await fetch("http://localhost:8000/add_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, images }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || "Something went wrong");
        }

        alert(result.message);  // Show success message
        if (response.ok) {
          window.location.reload(); // Refresh the page after alert
        }
    } catch (error) {
        alert(error.message);  // Show error message
        window.location.reload();
    }
};

// Function to reset form and images
const resetForm = () => {
    setFormData({ name: "", designation: "", department: "" });
    setNotification("");
};


  return (
    <div className="addUserContainer">
      <div className="addUserInst">
        Provide the relevant details and click capture to store your facial images.
      </div>

      <div className="addUserMain">
        <div className="addUserLeft">
          <div className="addUserInput">
            <label htmlFor="name">Name :</label>
            <input type="text" name="name" placeholder="Enter your name" onChange={handleChange} />
          </div>
          <div className="addUserInput">
            <label htmlFor="designation">Designation :</label>
            <input type="text" name="designation" placeholder="Enter your designation" onChange={handleChange} />
          </div>
          <div className="addUserInput">
            <label htmlFor="department">Department :</label>
            <input type="text" name="department" placeholder="Enter your department" onChange={handleChange} />
          </div>
        </div>
        <div className="addUserRight">
          <img src={scanImg} alt="scanImage" />
        </div>
      </div>

      <button className="startCapture" onClick={startCapture} disabled={isCapturing}>
        Start Capture
      </button>

      {notification && <div className="notification">{notification}</div>}

      <div className="captureArea" style={{ display: isCapturing ? "block" : "none" }}>
        <video ref={videoRef}></video>
        <button className="stopCapture" onClick={stopCapture}>Stop Capturing</button>
      </div>

      <div className="resultant-area" style={{ display: images.length > 0 ? "block" : "none" }}>
        <p className="afterCaptureinfo">
          Click submit to add <span id="user-name">{formData.name}</span> to the database.
        </p>
        <button onClick={handleSubmit} className="submitButton">Submit</button>
      </div>
    </div>
  );
};

export default AddUser;
