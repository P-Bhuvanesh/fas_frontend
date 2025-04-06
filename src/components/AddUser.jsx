import React, { useState, useEffect, useRef } from "react";
import scanImg from "../assets/scanImage.png";
import { useNavigate } from "react-router-dom";
import "../styles/AddUser.css";
import loadingGif from "../assets/load.gif";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    department: "",
  });
  const [users, setUsers] = useState([]); 
  const [isCapturing, setIsCapturing] = useState(false);
  const [images, setImages] = useState([]);
  const [notification, setNotification] = useState("");
  const videoRef = useRef(null);
  const captureAreaRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/get_users_check");
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users); // Store users in state
        } else {
          console.error("Failed to fetch users:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startCapture = async () => {
    if (!formData.name || !formData.email || !formData.designation || !formData.department) {
      alert("Please fill in all details before capturing.");
      return;
    }

    // Check if the email already exists
    const userExists = users.some((user) => user.email === formData.email);
    if (userExists) {
      alert("User already exists!\nCheck active users for clarity");
      resetForm();
      return;
    }

    setIsCapturing(true);
    setNotification("Capturing images... Tilt your face slightly while capturing");

    setTimeout(() => {
      captureAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);

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
    setIsLoading(true);
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

      alert(result.message);
      if (response.ok) {
        navigate("/home");
      }
    } catch (error) {
      alert(error.message);
      window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      designation: "",
      department: "",
    });
    setImages([]);
    setNotification("");
  };
  

  return (
    <div className="addUserContainer">
      {isLoading && (
        <div className="loading-overlay">
          <img src={loadingGif} alt="Loading..." />
          <p>Hold tight...</p>
        </div>
      )}
      <div className="addUserInst">
        Provide the relevant details and click capture to add.
      </div>

      <div className="addUserMain">
        <div className="addUserLeft">
          <div className="addUserInput">
            <label htmlFor="name">Name :</label>
            <input type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="addUserInput">
            <label htmlFor="email">Email :</label>
            <input type="email" name="email" placeholder="Enter your Mail Id" value={formData.email} onChange={handleChange} />
          </div>
          <div className="addUserInput">
            <label htmlFor="designation">Designation :</label>
            <input type="text" name="designation" placeholder="Enter your designation" value={formData.designation} onChange={handleChange} />
          </div>
          <div className="addUserInput">
            <label htmlFor="department">Department :</label>
            <input type="text" name="department" placeholder="Enter your department" value={formData.department} onChange={handleChange} />
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
        <button ref={captureAreaRef} className="stopCapture" onClick={stopCapture}>Stop Capturing</button>
      </div>

      <div className="resultant-area" style={{ display: images.length > 0 ? "block" : "none" }}>
        <p className="afterCaptureinfo">
          Click submit to add <span id="user-name">{formData.name}</span> to the database.
        </p>
        <button onClick={handleSubmit} disabled={isLoading} className="submitButton">
          {isLoading ? "Processing..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AddUser;
