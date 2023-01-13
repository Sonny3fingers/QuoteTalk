import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
  return (
    <main className="w-full shadow px-2 py-5 bg-white">
      <h2 className="text-2xl font-normal text-gray-800">Log In</h2>
      <form className="mb-8">
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
        <button className="bg-teal-500 px-4 py-1 border-0 rounded-full text-xl text-white transition-all hover:bg-teal-700">
          Submit
        </button>
      </form>
      <Link className="mt-8 text-xl text-orange-400 font-bold" to="/register">
        Register Instead
      </Link>
    </main>
  );
}

export default LoginForm;
