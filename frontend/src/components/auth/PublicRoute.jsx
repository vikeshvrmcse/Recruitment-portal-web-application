import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { isAuthenticated, level } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    if (level === "L1") {
      return <Navigate to="/sub_admin_dashboard" replace />;
    } else if (level === "L2") {
      return <Navigate to="/tl_dashboard" replace />;
    } else if (level === "L3") {
      return <Navigate to="/admin_dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;