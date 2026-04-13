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
import TLDashboard from "../pages/dashboards/TLDashboard";
import SubAdminDashboard from "../pages/dashboards/SubAdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [

      //Public Routes
      {
        element: <PublicRoute />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/login", element: <Login /> },
        ],
      },


      //Private Routes
      {
        element: <PublicRoute />,
        children: [
          { path: "/tl_dashboard", element: <TLDashboard /> },
        ],
      },
      //Private Routes
      {
        element: <PublicRoute />,
        children: [
          { path: "/sub_admin_dashboard", element: <SubAdminDashboard /> },
        ],
      },

      
      //Access Denied
      {
        path: "/access-denied",
        element: <AccessDenied />,
      },

      {
        path:"*",
        element:<NotFound/>
      }

    ],
  },
]);