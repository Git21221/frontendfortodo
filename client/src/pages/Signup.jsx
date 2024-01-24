import React, { useState } from "react";
import { Input } from "../components/index.js";
import validator from "validator";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [message, setMessage] = useState("");
  const [fullName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setisValidEmail] = useState(true);
  const navigate = useNavigate();

  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/register`;
  const hostedServer = `${
    import.meta.env.VITE_HOSTED_SERVER_LINK
  }/users/register`;

  const data = { fullName, email, username, password };

  const requestOptions = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };

  const submitHandler = async (e) => {
    console.log(fullName, email, username, password);

    //validate all details
    if ([username, fullName, password, email].some((field) => field === ""))
      setMessage("All fields are required!");
    else if (!validator.isEmail(email)) {
      setisValidEmail(false);
      setMessage("Email is not valid");
    } else {
      try {
        let res;
        import.meta.env.VITE_DEVELOPMENT_ENV === "true"
          ? (res = await fetch(localServer, requestOptions))
          : (res = await fetch(hostedServer, requestOptions));
        setMessage("Registered successfully");
        navigate("/login");
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const cssAccTomsg = !isValidEmail ? "text-red-600" : "text-emerald-800";

  return (
    <div className="img-container h-screen w-screen flex items-center justify-center flex-col gap-8 text-white">
      <div className="form bg-zinc-700 p-10 rounded-2xl bg-opacity-60 backdrop-blur-3xl flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">Register yourself</h1>
        <p className={cssAccTomsg}>{message}</p>
        <form
          method="post"
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input
            type="text"
            placeholder="Full Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Input
            type="text"
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            className="bg-zinc-100 rounded-3xl px-3 py-2 bg-opacity-30 text-black hover:bg-zinc-50 transition-all font-bold"
            onClick={submitHandler}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;