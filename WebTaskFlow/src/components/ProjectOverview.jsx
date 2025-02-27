import { useState, useEffect } from "react";
import axios from "axios";

// Chart.js imports
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

import Banner from "./Banner"; // Adjust path if needed

const StatCard = ({ label, value, bgColor = "bg-white" }) => (
  <div className={`${bgColor} rounded-xl shadow-sm p-6 transition-transform hover:scale-105`}>
    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

export default function ProjectOverview({ projectName }) {
  const [tasksCount, setTasksCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [rolesCount, setRolesCount] = useState(0);
  const [tasksAssignedCount, setTasksAssignedCount] = useState(0);
  const [roleDistribution, setRoleDistribution] = useState({});

  // State for banner visibility
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Fetch tasks
    axios
      .get("http://localhost:5000/get_task")
      .then((res) => setTasksCount(res.data.length))
      .catch((error) => console.error("Error fetching tasks:", error));

    // Fetch employees
    axios
      .get("http://localhost:5000/get_employee")
      .then((res) => {
        setUsersCount(res.data.length);
        const roleCounts = {};
        res.data.forEach((emp) => {
          const role = emp.Role;
          roleCounts[role] = (roleCounts[role] || 0) + 1;
        });
        setRolesCount(Object.keys(roleCounts).length);
        setRoleDistribution(roleCounts);
      })
      .catch((error) => console.error("Error fetching users:", error));

    // Fetch tasks assigned
    axios
      .get("http://localhost:5000/get_task_history")
      .then((res) => setTasksAssignedCount(res.data.length))
      .catch((error) => console.error("Error fetching task history:", error));

    // Listen for scroll to show/hide banner
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      // If user is at (or beyond) the bottom, show the banner
      if (scrollPosition >= pageHeight) {
        setShowBanner(true);
      } else {
        setShowBanner(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const deleteProject = () => {
    if (window.confirm("Are you sure you want to delete this project? This will clear all data.")) {
      Promise.all([
        axios.delete("http://localhost:5000/clear_task_history"),
        axios.delete("http://localhost:5000/clear_tasks"),
        axios.delete("http://localhost:5000/clear_employees"),
      ])
        .then(() => {
          localStorage.removeItem("projectName");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error clearing project data:", error);
          alert("Failed to clear project data completely");
        });
    }
  };

  // Chart data: Tasks vs. Tasks Assigned
  const tasksChartData = {
    labels: ["Tasks", "Tasks Assigned"],
    datasets: [
      {
        data: [tasksCount, tasksAssignedCount],
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const tasksChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Tasks vs. Tasks Assigned",
        font: { size: 16 },
      },
    },
  };

  // Chart data: Role Distribution
  const rolesChartData = {
    labels: Object.keys(roleDistribution),
    datasets: [
      {
        data: Object.values(roleDistribution),
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 205, 86, 0.8)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 205, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const rolesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Roles Graph",
        font: { size: 16 },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto bottom-0 min-h-[1200px] flex flex-col">
      {/* Main Content (flex-grow) */}
      <div className="flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{projectName}</h1>
          <p className="text-gray-600">
            An overview of the details of your project are displayed below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="TASKS"
            value={tasksCount}
            bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
          />
          <StatCard
            label="USERS"
            value={usersCount}
            bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
          />
          <StatCard
            label="ROLES"
            value={rolesCount}
            bgColor="bg-gradient-to-br from-green-50 to-green-100"
          />
          <StatCard
            label="TASKS ASSIGNED"
            value={tasksAssignedCount}
            bgColor="bg-gradient-to-br from-orange-50 to-orange-100"
          />
        </div>

        {/* Charts Section */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {/* Tasks vs Tasks Assigned Graph */}
          <div className="flex flex-col items-center w-4/5">
            <div
              className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center w-full"
              style={{ height: "400px" }}
            >
              <Doughnut data={tasksChartData} options={tasksChartOptions} />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              This graph compares the total tasks versus tasks assigned.
            </p>
          </div>

          {/* Roles Distribution Graph */}
          <div className="flex flex-col items-center w-4/5">
            <div
              className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center w-full"
              style={{ height: "400px" }}
            >
              <Doughnut data={rolesChartData} options={rolesChartOptions} />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Roles Distribution Graph
            </p>
          </div>
        </div>

        <div className="flex justify-end mb-8">
          <button
            onClick={deleteProject}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Project
          </button>
        </div>
      </div>

      < Banner />
    </div>
  );
}
