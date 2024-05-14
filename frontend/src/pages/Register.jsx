import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const register = () => {
   

    navigate("/todo");
  };

  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="bg-gray-800 max-w-[400px] w-full mx-auto rounded-lg p-8 px-8 shadow-lg">
        <input
          type="text"
          className="rounded-lg bg-gray-700 w-full py-2 px-4 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />
        <input
          type="text"
          className="rounded-lg bg-gray-700 w-full py-2 px-4 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
        />
        <input
          type="password"
          className="rounded-lg bg-gray-700 w-full py-2 px-4 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={register}
        >
          Register
        </button>
        {/* Removed Firebase related button */}
        <div className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login now
          </Link>
          .
        </div>
      </div>
    </div>
  );
}

export default Register;
