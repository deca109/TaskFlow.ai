import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import { Home, Users, CheckSquare, GitMerge } from "lucide-react";
import ProjectOverview from "./components/ProjectOverview";
import TasksPage from "./components/TasksPage";
import NewTaskPage from "./components/NewTaskPage";
import UsersPage from "./components/UsersPage";
import NewUserPage from "./components/NewUserPage";
import EditUserPage from "./components/EditUserPage";
import TaskAssignment from "./components/TaskAssignment";
import Banner from "./components/Banner";

const NavLink = ({ to, children, icon: Icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          isActive
            ? "bg-indigo-600 text-white"
            : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
        }`}
      >
        <Icon size={20} />
        <span>{children}</span>
      </Link>
    </li>
  );
};

export default function App() {
  const [projectName, setProjectName] = useState("");
  const [isProjectCreated, setIsProjectCreated] = useState(false);

  const handleCreateProject = () => {
    if (projectName.trim() !== "" || localStorage.getItem("projectName")) {
      setProjectName(projectName.trim() || localStorage.getItem("projectName"));
      localStorage.setItem("projectName", projectName.trim());
      setIsProjectCreated(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("projectName")) {
      setProjectName(localStorage.getItem("projectName"));
      setIsProjectCreated(true);
    }
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <aside className="w-64 bg-white shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="flex items-center text-xl font-bold text-gray-800">
              <img src="../public/logo.svg" alt="Logo" className="h-6 w-auto mr-2" />
              TaskFlow.ai{" "}
              <span className="text-xs font-medium text-indigo-600 mt-[7px] ml-1">
                v0.1
              </span>
            </h1>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <NavLink to="/" icon={Home}>
                Project
              </NavLink>
              <NavLink to="/users" icon={Users}>
                Users
              </NavLink>
              <NavLink to="/tasks" icon={CheckSquare}>
                Tasks
              </NavLink>
              <NavLink to="/task-assignment" icon={GitMerge}>
                Task Assignment
              </NavLink>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-8 relative">
          {isProjectCreated ? (
            <>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <ProjectOverview projectName={projectName} />
                    </>
                  }
                />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/tasks/new" element={<NewTaskPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/new" element={<NewUserPage />} />
                <Route path="/users/:id/edit" element={<EditUserPage />} />
                <Route path="/task-assignment" element={<TaskAssignment />} />
              </Routes>
            </>
          ) : (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                New Project
              </h2>
              <p className="text-gray-600 mb-6">
                Start by creating a new project to which tasks and users can be
                added.
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                PROJECT NAME
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-6"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />

              <button
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors mb-8"
                onClick={handleCreateProject}
              >
                Create Project
              </button>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Instructions
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    Start by creating a new project. Navigate to the{" "}
                    <span className="font-medium">Users</span> page to add team
                    members with their skills and roles.
                  </p>
                  <p>
                    Go to the <span className="font-medium">Tasks</span> page to
                    create new tasks with required skills and estimated
                    completion time.
                  </p>
                  <p>
                    Use the <span className="font-medium">Task Assignment</span>{" "}
                    page to assign tasks to team members. The system will
                    recommend the best employee based on skills and workload.
                  </p>
                  <p>
                    You can track project progress and view statistics in the{" "}
                    <span className="font-medium">Project Overview</span>{" "}
                    dashboard.
                  </p>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">Note:</span> You must create
                      at least one user before creating tasks, and have at least
                      one task created before using the task assignment feature.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </Router>
  );
}
