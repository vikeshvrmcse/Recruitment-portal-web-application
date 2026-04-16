import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, level } = useSelector((state) => state.auth);

  if (level === null) {
    return <div>Loading...</div>; // or spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(level)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;