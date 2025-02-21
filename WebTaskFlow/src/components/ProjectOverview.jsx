import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NewUserPage from "./NewUserPage";
import { motion } from "framer-motion";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 } 
  }
};

const StatCard = ({ label, value, bgColor = "bg-white" }) => (
  <motion.div
    className={`${bgColor} rounded-xl shadow-sm p-6 transition-transform hover:scale-105`}
    whileHover={{ scale: 1.05 }}
  >
    <p className="text-sm font-medium text-gray-500 mb-1 text-center">{label}</p>
    <p className="text-3xl font-bold text-gray-900 text-center">{value}</p>
  </motion.div>
);

export default function ProjectOverview({ projectName }) {
  const [tasksCount, setTasksCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [rolesCount, setRolesCount] = useState(0);
  const [tasksAssignedCount, setTasksAssignedCount] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/get_task")
      .then((res) => {
        setTasksCount(res.data.length);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });

    axios
      .get("http://localhost:5000/get_employee")
      .then((res) => {
        setUsersCount(res.data.length);
        const uniqueRoles = new Set(res.data.map((emp) => emp.Role));
        setRolesCount(uniqueRoles.size);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

    axios
      .get("http://localhost:5000/get_task_history")
      .then((res) => {
        setTasksAssignedCount(res.data.length);
      })
      .catch((error) => {
        console.error("Error fetching task history:", error);
      });
  }, []);

  const deleteProject = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This will clear all data."
      )
    ) {
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

  return (
    <motion.div
      className="max-w-6xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="mb-8 text-center">
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

      <div className="flex justify-end">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={deleteProject}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete Project
        </motion.button>
      </div>
    </motion.div>
  );
}
