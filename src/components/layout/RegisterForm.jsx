import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;

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
      // get auth value
      const auth = getAuth();
      // register user with createUserWithEmailAndPassword, which returns a promise
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // we get user info
      const user = userCredential.user;
      // update display name
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      await addDoc(collection(db, "users"), formDataCopy);

      // redirect, navigate to chat page
      navigate("/chat");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="w-full shadow px-2 py-5 bg-white">
      <h2 className="text-2xl font-normal text-gray-800">Register</h2>
      <form className="mb-8" onSubmit={onSubmitHandler}>
        <div className="py-4">
          <input
            className="w-full p-2 rounded-sm border-2"
            type="text"
            id="name"
            value={name}
            placeholder="Name"
            onChange={onChangeHandler}
          />
        </div>
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
        <button
          type="submit"
          className="bg-teal-500 px-4 py-1 border-0 border-black rounded-full text-xl text-white transition-all hover:bg-teal-700 "
        >
          Submit
        </button>
      </form>
      <Link className="mt-8 text-xl text-orange-400 font-bold" to="/">
        Log In Instead
      </Link>
    </main>
  );
}

export default RegisterForm;
