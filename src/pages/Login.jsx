import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Login() {
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const { userState } = useUser();

  if (userState) {
    return <Navigate to="/" />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // const userCredential = await signInWithEmailAndPassword(
      //   auth,
      //   email,
      //   password,
      // );
      // const user = userCredential.user;
      // console.log(user);
      // loginUser(user);
      setError(false);
      navigate("/");
    } catch (error) {
      setError(true);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="grid w-5/6 max-w-xs gap-y-5 rounded-2xl px-4 py-6 text-center shadow-xl sm:max-w-sm sm:gap-y-7 sm:px-6 sm:py-8 sm:shadow-2xl lg:max-w-md lg:px-8 lg:py-10"
      >
        <h2 className="text-xl font-semibold sm:text-2xl lg:text-3xl">
          Login Form
        </h2>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          className="h-9 text-sm sm:py-5 sm:text-base lg:h-12 lg:text-lg"
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          className="h-9 text-sm sm:py-5 sm:text-base lg:h-12 lg:text-lg"
        />
        <Button
          type="submit"
          className="capitalize sm:py-5 sm:text-base lg:py-6 lg:text-lg"
        >
          Login
        </Button>
        {error && (
          <span className="text-sm text-red-600 lg:text-lg">
            Wrong email or password!
          </span>
        )}
      </form>
    </main>
  );
}

export default Login;
