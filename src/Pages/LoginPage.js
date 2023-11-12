import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Import Icons
import { BackwardIcon } from "@heroicons/react/24/solid";

export const LoginPage = ({ motion }) => {
  const [user, setUser] = useState({ user: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (ev) => {
    let name = ev.target.name;
    let value = ev.target.value;

    setUser((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleClick = () => {
    console.log(user);
    navigate("/search");
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
  };

  return (
    <>
      <div className="flex flex-row justify-center h-[100dvh] pt-[2em] pb-[4em] px-[2em]">
        <motion.div
          className="flex flex-col w-full lg:w-[30%] justify-between text-center"
          initial={{ y: "20", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            mass: 0.4,
            damping: 8,
            //some bug here with staggerChildren. will take a look
            staggerChildren: 2,
          }}
        >
          <div>
            <div className="absolute">
              <BackwardIcon
                className="h-6 w-6 text-blue-600 scale-100 transition-all hover:scale-[120%] active:scale-95"
                onClick={() => {
                  navigate("/");
                }}
              />
            </div>

            <h1 className="font-bold text-txtcolor-primary text-[2rem] pt-[20%] pb-[2em] text-left">
              Log In
            </h1>

            <div className="flex flex-col lg:gap-0 gap-[1em]">
              <input
                type="text"
                name="username"
                onChange={handleChange}
                value={user.username}
                autoComplete="off"
                placeholder="USERNAME"
                className="primary-input-form"
              />

              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={user.password}
                autoComplete="off"
                placeholder="PASSWORD"
                className="primary-input-form"
              />
            </div>
          </div>

          <motion.div
            initial={{ y: "20", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <form onSubmit={handleSubmit}>
              <input
                type="button"
                value="SIGN IN"
                onClick={handleClick}
                className="secondary-cta-btn w-[100%] lg:w-[100%]"
              />
            </form>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};