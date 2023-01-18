import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Button from "../Button";
import OAuth from "../OAuth";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        navigate("/profile");
      }
    } catch (error) {
      toast.error("Bad User Credentials");
    }
  };
  return (
    <main className="w-full shadow px-2 py-5 bg-white">
      <h2 className="text-2xl font-normal text-gray-800">Log In</h2>
      <form className="mb-4" onSubmit={onSubmitHandler}>
        <div className="py-4">
          <input
            className="w-full p-2 rounded-sm border-2"
            type="email"
            id="email"
            value={email}
            placeholder="Email"
            onChange={onChangeHandler}
          />
        </div>
        <div className="py-4 mb-4">
          <input
            className="w-full p-2 rounded-sm border-2"
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={onChangeHandler}
          />
        </div>
        <Button>Submit</Button>
      </form>
      <OAuth />
      <Link className="mt-8 text-xl text-orange-400 font-bold" to="/register">
        Register Instead
      </Link>
    </main>
  );
}

export default LoginForm;
