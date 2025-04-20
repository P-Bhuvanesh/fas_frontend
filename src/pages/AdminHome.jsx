import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminHome.css";

const AdminHome = () => {

  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("TrustenDev");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    recentActivity: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState({
    database: false,
    server: false
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }
    checkBackendStatus();
    loadDashboardData();
  }, [navigate]);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${apiUrl}/status`);
      const data = await response.json();
      setBackendStatus(data);

      if (!data.database) {
        console.error("Database connection failed");
      }
    } catch (error) {
      console.error("Backend status check failed:", error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const usersResponse = await fetch(`${apiUrl}/get_users_check`);
      const usersData = await usersResponse.json();

      const activeUsersResponse = await fetch(`${apiUrl}/active_users`);
      const activeUsersData = await activeUsersResponse.json();

      const totalUsers = usersData.users?.length || 0;

      const processedUsers = (activeUsersData.active_users || [])
        .slice(-5)
        .map(user => ({
          id: user.user_id,
          name: user.name,
          email: user.email,
          status: "active",
          department: user.department,
          designation: user.designation,
          joined: new Date().toISOString().split('T')[0]
        }));

      setStats({
        totalUsers,
        activeUsers: totalUsers,
        pendingApprovals: 0,
        recentActivity: Math.floor(Math.random() * 50) + 20
      });

      setRecentUsers(processedUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };


  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loader"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (!backendStatus.database) {
    return (
      <div className="admin-error">
        <h2>Database Connection Error</h2>
        <p>Unable to connect to the database. Please check your MongoDB connection.</p>
        <button onClick={checkBackendStatus}>Retry Connection</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="admin-home">
      <div className="admin-content">
        <div className="admin-welcome">
          <h2>Welcome back, {adminName}</h2>
          <p>Here's what's happening on your platform today</p>
        </div>

        <div className="admin-profile-bar">
          <div className="admin-name">{adminName}</div>
          <div className="system-status">
            <span className={`status-indicator ${backendStatus.database ? 'online' : 'offline'}`}></span>
            <span>Database: {backendStatus.database ? 'Connected' : 'Disconnected'}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
            <a href="#" onClick={() => navigate("/activeuser")}>View all users</a>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p className="stat-number">{stats.activeUsers}</p>
            <div className="stat-percentage">
              {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total
            </div>
          </div>
          <div className="stat-card">
            <h3>Recent Activity</h3>
            <p className="stat-number">{stats.recentActivity}</p>
            <span>actions in 24h</span>
          </div>
        </div>

        <div className="admin-panels">
          <div className="panel">
            <div className="panel-header">
              <h3>Recently Registered Users</h3>
            </div>
            <div className="panel-content">
              {recentUsers.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Designation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.department}</td>
                        <td>{user.designation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data-message">
                  <p>No users registered yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions">
              <button className="action-card" onClick={() => navigate("/admin/dashboard")}>
                <span className="action-icon">📊</span>
                <span>Analytics Dashboard</span>
              </button>
              <button className="action-card" onClick={() => navigate("/admin/adduser")}>
                <span className="action-icon">👤➕</span>
                <span>Add New User</span>
              </button>
              <button className="action-card" onClick={() => navigate("/activeuser")}>
                <span className="action-icon">👥</span>
                <span>Users</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
