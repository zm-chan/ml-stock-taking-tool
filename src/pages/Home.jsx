import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";

function Home() {
  const { logoutUser } = useUser();
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <>
      <div>Home component</div>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default Home;
