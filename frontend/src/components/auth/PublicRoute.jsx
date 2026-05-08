import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { isAuthenticated, level, accessLevel, dept } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    if (level === "L1" && accessLevel===1) {
      return <Navigate to="/admin_dashboard" replace />;
    } if (level === "L1" && accessLevel===2) {
      return <Navigate to="/personal_assistance_dashboard" replace />;
    }  if (level === "L1" && accessLevel===3) {
      return <Navigate to="/upper_admin_dashboard" replace />;
    } if (level === "L1" && accessLevel===4) {
      return <Navigate to="/sub_admin_dashboard" replace />;
    } if (level === "L2" && accessLevel===5) {
      return <Navigate to="/team_leader_dashboard" replace />;
    } if (level === "L3" && accessLevel===6 && dept!=="HR") {
      return <Navigate to="/team_leader_dashboard" replace />;
    } if ((level === "L4" && accessLevel===7 ) || (level==="L3" && (accessLevel===6 && dept === "HR"))) {
      return <Navigate to="/sub_hr_dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;