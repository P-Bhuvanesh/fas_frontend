import React, { useState, useEffect } from "react";
import "../styles/Admin.css";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  ArcElement,
  Tooltip,
  Legend,
  BarElement
);

const Admin = () => {


  const apiUrl = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [daysPresent, setDaysPresent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    avgCheckIn: "N/A",
    avgCheckOut: "N/A",
    totalHours: 0,
  });

  const timeToDecimal = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + minutes / 60;
  };

  const decimalToTime = (decimal) => {
    if (decimal === null || decimal === undefined) return "N/A";
    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal - hours) * 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateStats = (data) => {
    if (!data || data.length === 0) return;

    let totalCheckInHours = 0;
    let totalCheckOutHours = 0;
    let validEntries = 0;
    let totalWorkHours = 0;

    data.forEach((entry) => {
      if (entry.check_in && entry.check_out) {
        const checkInTime = timeToDecimal(entry.check_in);
        const checkOutTime = timeToDecimal(entry.check_out);

        totalCheckInHours += checkInTime;
        totalCheckOutHours += checkOutTime;
        totalWorkHours += checkOutTime - checkInTime;
        validEntries++;
      }
    });

    if (validEntries > 0) {
      setStats({
        avgCheckIn: decimalToTime(totalCheckInHours / validEntries),
        avgCheckOut: decimalToTime(totalCheckOutHours / validEntries),
        totalHours: Math.round(totalWorkHours * 10) / 10,
      });
    }
  };

  const getFilteredData = () => {
    if (!selectedMonth) return attendanceData;
    return attendanceData.filter(
      (entry) => entry.date.slice(0, 7) === selectedMonth
    );
  };

  const getDates = () => {
    return getFilteredData().map((entry) => entry.date);
  };

  const getHoursWorked = () => {
    return getFilteredData().map((entry) => {
      if (entry.check_in && entry.check_out) {
        const checkIn = timeToDecimal(entry.check_in);
        const checkOut = timeToDecimal(entry.check_out);
        return checkOut - checkIn;
      }
      return 0;
    });
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${apiUrl}/get_users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => {
        setUsers([]);
        setError("Failed to load users. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setLoading(true);
      fetch(`${apiUrl}/get-attendance/${selectedUser}`)
        .then((res) => res.json())
        .then((data) => {
          const sortedData = data.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
          setAttendanceData(sortedData);
          setError(null);
          setSelectedMonth(new Date().toISOString().slice(0, 7));
        })
        .catch(() => {
          setAttendanceData([]);
          setError("Failed to load attendance data. Please try again.");
        })
        .finally(() => setLoading(false));
    } else {
      setAttendanceData([]);
      setDaysPresent(0);
    }
  }, [selectedUser]);

  useEffect(() => {
    const filtered = getFilteredData();
    setDaysPresent(filtered.filter((entry) => entry.check_in).length);
    calculateStats(filtered);
  }, [selectedMonth, attendanceData]);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Employee Attendance Dashboard</h1>
      </header>

      <div className="admin-controls">
        <div className="user-selector">
          <label>Select Employee:</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Select Employee --</option>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.name || user.user_id}
                </option>
              ))
            ) : (
              <option disabled>
                {loading ? "Loading users..." : "No users available"}
              </option>
            )}
          </select>
        </div>

        {selectedUser && (
          <div className="month-selector">
            <label>Select Month:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              disabled={loading}
            />
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-spinner">Loading data...</div>}

      {selectedUser && getFilteredData().length > 0 ? (
        <div className="dashboard-content">
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Days Present</h3>
              <p className="stat-value">{daysPresent}</p>
            </div>
            <div className="stat-card">
              <h3>Avg. Check-in</h3>
              <p className="stat-value">{stats.avgCheckIn}</p>
            </div>
            <div className="stat-card">
              <h3>Avg. Check-out</h3>
              <p className="stat-value">{stats.avgCheckOut}</p>
            </div>
            <div className="stat-card">
              <h3>Total Hours</h3>
              <p className="stat-value">{stats.totalHours} hrs</p>
            </div>
          </div>

          <div className="charts-row">
            <div className="chart-container">
              <h3>Check-in & Check-out Times</h3>
              <Line
                data={{
                  labels: getDates(),
                  datasets: [
                    {
                      label: "Check-in",
                      data: getFilteredData().map((entry) =>
                        timeToDecimal(entry.check_in)
                      ),
                      borderColor: "rgba(54, 162, 235, 0.8)",
                      backgroundColor: "rgba(54, 162, 235, 0.2)",
                      fill: false,
                      tension: 0.1,
                      pointRadius: 3,
                    },
                    {
                      label: "Check-out",
                      data: getFilteredData().map((entry) =>
                        timeToDecimal(entry.check_out)
                      ),
                      borderColor: "rgba(255, 99, 132, 0.8)",
                      backgroundColor: "rgba(255, 99, 132, 0.2)",
                      fill: false,
                      tension: 0.1,
                      pointRadius: 3,
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: {
                      title: {
                        display: true,
                        text: "Time (24hr format)",
                      },
                      min: 6,
                      max: 20,
                      ticks: {
                        callback: (value) => decimalToTime(value),
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Date",
                      },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.dataset.label}: ${decimalToTime(
                            context.parsed.y
                          )}`,
                      },
                    },
                  },
                }}
              />
            </div>

            <div className="chart-container">
              <h3>Hours Worked Per Day</h3>
              <Bar
                data={{
                  labels: getDates(),
                  datasets: [
                    {
                      label: "Hours Worked",
                      data: getHoursWorked(),
                      backgroundColor: "rgba(75, 192, 192, 0.6)",
                      borderColor: "rgba(75, 192, 192, 1)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Hours",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Date",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      ) : selectedUser ? (
        <div className="no-data-message">
          {loading
            ? "Loading data..."
            : "No attendance data available for this employee."}
        </div>
      ) : (
        <div className="no-user-message">
          Please select an employee to view attendance data.
        </div>
      )}
    </div>
  );
};

export default Admin;
