import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";

function Login() {
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const { loginUser } = useUser();

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // console.log(user);
      loginUser(user);
      setError(false);
      navigate("/");
    } catch (error) {
      setError(true);
    }
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="email" />
        <input name="password" type="password" placeholder="password" />
        <button type="submit">Login</button>
        {error && <span>Wrong email or password!</span>}
      </form>
    </main>
  );
}

export default Login;
