import React, { useState } from "react";
import login from "../assets/login.png";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useAppContext } from "../Context/AppContext";
import { toast } from "sonner";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const {setUser} = useAppContext();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      let condition = isLogin
        ? !data.email || !data.password
        : !data.name || !data.email || !data.password;
      if (condition) {
        toast.warning("All fields are required");
        return;
      }
      setLoading(true);
      const endpoint = isLogin ? API_PATHS.USER.LOGIN : API_PATHS.USER.SIGNUP;
      const payload = isLogin
        ? { email: data.email, password: data.password }
        : { name: data.name, email: data.email, password: data.password };
      const res = await axiosInstance.post(endpoint, payload);
      localStorage.setItem('user',JSON.stringify(res?.data?.user))
      setUser(res?.data?.user)
      toast.success(res?.data?.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      setData({
        name: "",
        email: "",
        password: "",
      });
    }
  };

  const toggleLogin = () => setIsLogin((p) => !p);

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:flex w-1/2">
        <img
          className="h-full w-full object-cover"
          src={login}
          alt="leftSideImage"
        />
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="md:w-96 w-80 flex flex-col items-center justify-center"
        >
          <h2 className="text-4xl text-gray-900 font-medium">
            {isLogin ? "Sign in" : "Sign up"}
          </h2>
          <p className="text-sm text-gray-500/90 my-3">
            {isLogin
              ? "Welcome back! Please sign in to continue"
              : "Welcome! Create your account below"}
          </p>
          {!isLogin && (
            <div className="flex items-center w-full bg-transparent border border-gray-400/70 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <svg
                width="16"
                height="11"
                viewBox="0 0 16 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                  fill="#6B7280"
                />
              </svg>
              <input
                type="name"
                name="name"
                value={data.name}
                onChange={changeHandler}
                placeholder="Name"
                className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>
          )}
          <div className="flex items-center mt-6 w-full bg-transparent border border-gray-400/70 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg
              width="16"
              height="11"
              viewBox="0 0 16 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={changeHandler}
              placeholder="Email id"
              className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <div className="flex items-center mt-6 w-full bg-transparent border border-gray-400/70 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg
              width="13"
              height="17"
              viewBox="0 0 13 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={changeHandler}
              placeholder="Password"
              className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-8 cursor-pointer w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
          >
            {isLogin
              ? loading
                ? "Logging in..."
                : "Login"
              : loading
              ? "Signing up..."
              : "Sign Up"}
          </button>
          <p className="text-gray-500/90 text-sm mt-4">
            {isLogin ? "Don’t have an account? " : "Already have an account? "}
            <span
              onClick={toggleLogin}
              className="cursor-pointer text-indigo-400 hover:underline"
            >
              {isLogin ? "Login" : "Sign up"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
