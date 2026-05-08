// src/app/routes.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import Home from "../pages/Home";
import Login from "../features/auth/pages/Login";
import Dashboard from "../pages/dashboards/AdminDashboard";
import AccessDenied from "../pages/AccessDenied";

import PrivateRoute from "../components/auth/PrivateRoute";
import PublicRoute from "../components/auth/PublicRoute";
import NotFound from "../pages/NotFound";
import TeamLeaderDashboard from "../pages/dashboards/TeamLeaderDashboard";
import SubAdminDashboard from "../pages/dashboards/SubAdminDashboard";
import AdminDashboard from "../pages/dashboards/AdminDashboard";
import PersonalAssitanceDashboard from "../pages/dashboards/PersonalAssistanceDashboard";
import UpperAdminDashboard from "../pages/dashboards/UpperAdminDashboard";
import SubHRDashboard from "../pages/dashboards/SubHRDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [

      // Public Routes
      {
        element: <PublicRoute />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/login", element: <Login /> },
        ],
      },

      // TL Dashboard (only TL allowed)
      {
        element: <PrivateRoute allowedRoles={["L2", "L3"]} />,
        children: [
          { path: "/team_leader_dashboard", element: <TeamLeaderDashboard /> },
        ],
      },

      // Admin and SubAdmin Dashboard (only SubAdmin allowed)
      {
        element: <PrivateRoute allowedRoles={["L1"]} />,
        children: [
          { path: "/admin_dashboard", element: <AdminDashboard /> },
          { path: "/upper_admin_dashboard", element: <UpperAdminDashboard /> },
          { path: "/personal_assistance_dashboard", element: <PersonalAssitanceDashboard /> },
          { path: "/sub_admin_dashboard", element: <SubAdminDashboard /> },
        ],
      },

      // TL Dashboard (only TL allowed)
      {
        element: <PrivateRoute allowedRoles={["L3", "L4"]} />,
        children: [
          { path: "/sub_hr_dashboard", element: <SubHRDashboard /> },
        ],
      },


      // Access Denied
      {
        path: "/access-denied",
        element: <AccessDenied />,
      },

      {
        path: "*",
        element: <NotFound />,
      }

    ],
  },
]);