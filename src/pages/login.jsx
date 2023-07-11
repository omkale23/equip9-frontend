import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [apiError, setApiError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mobile: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const res = await fetch("http://localhost:8000/login", config);
    const jsonResponse = await res.json();
    if (!jsonResponse.error) {
      localStorage.setItem("uId", jsonResponse.token);
      navigate("/home");
    }
    setApiError(jsonResponse.error);
    setErrorMsg(jsonResponse.error);
  };

  return (
    <div className="mx-auto h-screen flex items-center justify-center bg-blue-300 w-full flex-col">
      <div className="rounded-md h-auto bg-white p-7 w-2/3 drop-shadow-xl">
        <h1 className="text-5xl mb-5 text-center">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-col flex px-8">
          <div className="flex flex-col mb-2">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              {...register("mobile", { pattern: /^\d{10}$/ })}
              id="mobile"
              name="mobile"
              className=" border border-slate-500 h-8 rounded-sm px-1"
              type="number"
            />
            {errors.mobile && (
              <span className="text-red-400">Enter a valid mobile number</span>
            )}
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="password">Password</label>
            <input
              {...register("password", { required: true })}
              id="password"
              name="password"
              className=" border border-slate-500 h-8 rounded-sm px-1"
              type="password"
            />
            {errors.password && (
              <span className="text-red-400">
                Please enter a valid password with more than 5 characters
              </span>
            )}
          </div>
          {apiError && <span className="text-red-400">{errorMsg}</span>}
          <button
            type="submit"
            className="py-2 rounded-md text-white mt-4 shadow-md bg-sky-500  w-20"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
