import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
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
    <>
      <header className="py-4">
        <h1 className="text-4xl font-light text-purple-800">Simple Chat App</h1>
      </header>

      <main className="py-5">
        <h2 className="text-2xl font-semibold text-gray-800">Log In</h2>
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
          <button className="bg-teal-500 px-4 py-1 border-2 border-black rounded-full text-xl text-white">
            Log In
          </button>
        </form>

        <Link className="mt-8 text-xl text-orange-400 font-bold" to="/register">
          Register Instead
        </Link>
      </main>
    </>
  );
}

export default Login;
