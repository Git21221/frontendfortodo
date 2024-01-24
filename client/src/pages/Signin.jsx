import React, { useState } from "react";
import { Input } from "../components/index.js";
import validator from "validator";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/login/authSlice.js";

function Signin() {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setisValidEmail] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/login`;
  const hostedServer = `${import.meta.env.VITE_HOSTED_SERVER_LINK}/users/login`;

  const email = username;

  const data = { email, username, password };

  const requestOptions = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  const submitHandler = async (e) => {
    console.log(email, username, password);

    //validate all details
    if ([username, password].some((field) => field === ""))
      setMessage("All fields are required!");
    else {
      try {
        let res;
        import.meta.env.VITE_DEVELOPMENT_ENV === "true"
          ? (res = await fetch(localServer, requestOptions))
          : (res = await fetch(hostedServer, requestOptions));

        const userData = await res.json();

        if (res.ok) {
          setMessage("login successfully");
          dispatch(setUser({ user: userData.data, isAuthenticated: true }));
        } else setMessage("Username or password is wrong");

        navigate("/");
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const cssAccTomsg = !isValidEmail ? "text-red-600" : "text-emerald-800";

  return (
    <div className="img-container h-screen w-screen flex items-center justify-center flex-col gap-8 text-white">
      <Helmet>
        <title>Sign In | TODO</title>
      </Helmet>
      <div className="form bg-zinc-700 p-10 rounded-2xl bg-opacity-60 backdrop-blur-3xl flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">Login</h1>
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
            placeholder="Username or email"
            onChange={(e) => {
              setUsername(e.target.value);
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
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
