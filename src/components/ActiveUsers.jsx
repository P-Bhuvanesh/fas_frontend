import React, { useEffect, useState } from "react";
import "../styles/ActiveUsers.css";
import personIcon from "../assets/person.png"; // Static person icon

const apiUrl = import.meta.env.VITE_API_URL;

const ActiveUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ department: "", designation: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = new URLSearchParams();
        if (filter.department) params.append("department", filter.department);
        if (filter.designation) params.append("designation", filter.designation);

        const response = await fetch(`${apiUrl}/active_users?${params}`);
        const data = await response.json();

        setUsers(data.active_users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="activeUsersContainer">
      <h2 className="activeUsersHeader">Active Users ({users.length})</h2>

      <div className="filterSection">
        <label>Department :</label>
        <input
          type="text"
          name="department"
          placeholder="Enter Department"
          value={filter.department}
          onChange={handleFilterChange}
        />

        <label>Designation :</label>
        <input
          type="text"
          name="designation"
          placeholder="Enter Designation"
          value={filter.designation}
          onChange={handleFilterChange}
        />
      </div>

      <div className="usersList">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div key={index} className="activeUserCard">
              <img src={personIcon} alt="Person" className="activeUserImage" />
              <p className="activeUserInfo">User ID: {user.user_id}</p>
              <p className="activeUserInfo">Name: {user.name}</p>
              <p className="activeUserInfo">email: {user.email}</p>
              <p className="activeUserInfo">Dept: {user.department}</p>
              <p className="activeUserInfo">Designation: {user.designation}</p>
            </div>
          ))
        ) : (
          <div className="noUsersMessage">No active users</div>
        )}
      </div>
    </div>
  );
};

export default ActiveUsers;
