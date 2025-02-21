import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NewUserPage from "./NewUserPage"; 
import { motion } from "framer-motion"; 
import * as XLSX from 'xlsx';

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

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get_employee");
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAdded = async () => {
    await fetchUsers(); 
  };

  const handleRemove = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/delete_employee/${userId}`);
        setUsers(users.filter((user) => user.Employee_ID !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);


        const existingEmployees = await axios.get("http://localhost:5000/get_employee");
        const existingIds = new Set(existingEmployees.data.map(emp => emp.Employee_ID));


        const newEmployees = data.filter(emp => !existingIds.has(parseInt(emp.Employee_ID)));

        if (newEmployees.length === 0) {
          setUploadStatus('No new users to add. All Employee IDs already exist.');
          return;
        }

        const formattedData = newEmployees.map(row => ({
          Employee_ID: parseInt(row.Employee_ID),
          Name: row.Name,
          Role: row.Role,
          Skills: row.Skills,
          Experience: parseInt(row.Experience),
          Availability: parseInt(row.Availability),
          Current_Workload: parseInt(row.Current_Workload),
          Performance_Score: parseInt(row.Performance_Score)
        }));

        const response = await axios.post('http://localhost:5000/add_employee', formattedData);
        setUploadStatus(`Successfully added ${newEmployees.length} new users. ${data.length - newEmployees.length} users skipped due to existing IDs.`);
        fetchUsers();
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadStatus('Error uploading users. Please check the file format.');
      }
    };

    reader.readAsBinaryString(file);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      className="container mx-auto px-4 py-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Users</h2>
        <div className="flex gap-4">
          <motion.div whileTap={{ scale: 0.95 }}>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="fileUpload"
            />
            <label
              htmlFor="fileUpload"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Upload Excel
            </label>
          </motion.div>
          {users.length > 0 && (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link
                to="/users/new"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create New User
              </Link>
            </motion.div>
          )}
        </div>
      </div>
      
      {uploadStatus && (
        <div className={`mb-4 p-4 rounded-lg ${
          uploadStatus.includes('Error') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {uploadStatus}
        </div>
      )}

      {users.length === 0 ? (
        <div className="space-y-8">
          <NewUserPage onUserAdded={handleUserAdded} />
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">No users added yet.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workload
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <motion.tr
                    key={user.Employee_ID}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.Employee_ID}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      {user.Name}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {user.Role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                      <div className="flex flex-wrap justify-center gap-1">
                        {user.Skills.split(",").map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      {user.Experience} years
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      {user.Availability} hrs
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      {user.Current_Workload} %
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      {user.Performance_Score}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        to={`/users/${user.Employee_ID}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleRemove(user.Employee_ID)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UsersPage;
