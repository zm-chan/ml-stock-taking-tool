import { Navigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { userState } = useUser();

  if (!userState) {
    return <Navigate to={"/login"} />;
  }

  return children;
}

export default ProtectedRoute;
